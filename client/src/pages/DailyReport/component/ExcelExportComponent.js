import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
const ExcelExportComponent = ({data}) => {
  const inoutData = data?.inoutAcctList;
  const timeData = data?.timeAcctList;
  const loanData = data?.loanAcctList;
  const currentDateTime = `${data?.date} ${data?.time}`;
  const excelDownload = () => {
    createTable().then((url) => {
      const downloadNode = document.createElement("a");
      downloadNode.setAttribute("href", url);
      downloadNode.setAttribute("download", "일일시재보고서.xlsx");
      downloadNode.click();
      downloadNode.remove();
    });
  };

  const s2ab = (s) => {
    const buffer = new ArrayBuffer(s.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }
    return buffer;
  };

  const workbook2blob = (workbook) => {
    const woptions = {
      bookType: "xlsx",
      type: "binary",
    };
    const wbout = XLSX.write(workbook, woptions);

    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    return blob;
  };

  const createTable = () => {
    // 메인 타이틀 => A
    const mainTitle = [{ A: "일일시재보고서" }, {}];

    // column header 타이틀
    let tb1 = [
      {
        A: "입출식예금잔액",
        B: "",
        C: "",
        D: "정기예적금잔액",
        E: "",
        F: "",
        G: "대출금잔액",
        H: "",
        I: "",
      },
    ];
    // 입출식예금
    let tb2 = [
      {
        A: "은행",
        B: "계좌번호",
        C: "계좌별칭",
        D: "출금건수",
        E: "출금액",
        F: "입금건수",
        G: "입금액",
        H: "잔액",
        I: "출금가능잔액"
      },
    ];
    // 정기예적금
    let tb3 = [
      {
        A: "은행",
        B: "계좌번호",
        C: "계좌별칭",
        D: "예금과목",
        E: "",
        F: "가입금액",
        G: "만기일자",
        H: "월납입액",
        I: "잔액"
      }
    ]
    // 대출금
    let tb4 = [
      {
        A: "은행",
        B: "계좌번호",
        C: "계좌별칭",
        D: "대출과목",
        E: "대출한도",
        F: "대출잔액",
        G: "신규일자",
        H: "만기일자",
        I: "구분"
      }
    ]
    let [inoutOutCnt, inoutTotalCnt, inoutIncnt, inoutTotalIn, inoutBal, inoutRealAmt] = [0,0,0,0,0,0];
    inoutData?.forEach((row) => {
      inoutOutCnt+=row.outCnt;
      inoutTotalCnt+=row.totalOut;
      inoutIncnt+=row.inCnt;
      inoutTotalIn+=row.totalIn;
      inoutBal += row.bal;
      inoutRealAmt+=row.realAmt;
      tb2.push({
        A: row.bankNm,
        B: ` ${row.acctNo}`,
        C: row.acctNickNm,
        D: row.outCnt,
        E: row.totalOut,
        F: row.inCnt,
        G: row.totalIn,
        H: row.bal,
        I: row.realAmt,
      });
    });
    let [timeAgmtAmt, timePyatAmt, timeBal] = [0,0,0];
    timeData?.forEach((row) => {
      timeAgmtAmt+=row.agmtAmt;
      timePyatAmt+=row.pyatAmt;
      timeBal+=row.bal;
      tb3.push({
        A: row.bankNm,
        B: ` ${row.acctNo}`,
        C: row.acctNickNm,
        D: row.loanNm,
        F: row.agmtAmt,
        G: row.expiDt,
        H: row.pyatAmt,
        I: row.bal,
      });
    });
    let [loanAgmtAmt, loanBal] = [0,0];
    loanData?.forEach((row) => {
      loanAgmtAmt+=row.agmtAmt;
      loanBal+=row.bal;
      tb4.push({
        A: row.bankNm,
        B: ` ${row.acctNo}`,
        C: row.acctNickNm,
        D: row.loanNm,
        E: row.agmtAmt,
        F: row.bal,
        G: row.newDt,
        H: row.expiDt,
        I: row.loanKind,
      });
    });
    const totalBal = [
      {
        BALANCE: {
          statement: inoutRealAmt,
          inout: timeBal,
          loan: loanBal,
        },
      },
    ];
    totalBal.forEach((row) => {
      const balanceDetail = row.BALANCE;
      tb1.push({
        A: balanceDetail.statement,
        D: balanceDetail.inout,
        G: balanceDetail.loan
      });
    });
    // 전체 테이블 합치기
    tb1 = [{ A: `기준일: ${currentDateTime}` }]
      .concat([""])
      .concat(tb1)
      .concat([""])
      .concat([{ A: "*입출식예금" }])
      .concat(tb2)
      .concat([{A:"합계",B:`${inoutData?.length}건`,D:inoutOutCnt,E:inoutTotalCnt,F:inoutIncnt,G:inoutTotalIn,H:inoutBal,I:inoutRealAmt}])
      .concat([""])
      .concat([{ A: "*정기예적금" }])
      .concat(tb3)
      .concat([{A:"합계",B:`${timeData?.length}건`,F:timeAgmtAmt,H:timePyatAmt,I:timeBal}])
      .concat([""])
      .concat([{ A: "*대출금" }])
      .concat(tb4)
      .concat([{A:"합계",B:`${loanData?.length}건`,E:loanAgmtAmt,F:loanBal}]);

    // 보고서 제목과 전체 테이블 합치기
    const finalData = [...mainTitle, ...tb1];

    // sheetjs docs 'Create a Workbook' 참조

    // workbook 생성, xlsx 활용
    const workbook = XLSX.utils.book_new();

    // worksheet 생성
    const worksheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });
    // thead index 구하기
    const theadIndexes = [];
    // 포함된 컬럼명으로 구함
    finalData.forEach((data, index) =>
      data["B"] === "계좌번호"
        ? theadIndexes.push(index)
        : null
    );
    // decode_col - 0과 index 컬럼과 컬럼명을 convert
    // I열 타입 지정 및 tHead 예외처리
    const inoutConvertRange = ['E','G','H','I'];
    inoutConvertRange.forEach((col)=>{
      let colNum2 = XLSX.utils.decode_col(col);
      let range2 = XLSX.utils.decode_range(worksheet["!ref"]);
      range2.s.c = range2.e.c = colNum2;
      for (let R = range2.s.r; R <= range2.e.r; R++) {
        if(R>8 && R<theadIndexes[0]+inoutData.length+2){
          let addr = XLSX.utils.encode_cell({ r: R, c: colNum2 });
          if (!worksheet[addr]) continue;
          worksheet[addr].t = "n";
          worksheet[addr].z = "#,##0";
        }
      }
    });
    const timeConvertRange = ['F','H','I'];
    timeConvertRange.forEach((col)=>{
      let colNum2 = XLSX.utils.decode_col(col);
      let range2 = XLSX.utils.decode_range(worksheet["!ref"]);
      range2.s.c = range2.e.c = colNum2;
      for (let R = range2.s.r; R <= range2.e.r; R++) {
        if(R>theadIndexes[1] && R<theadIndexes[1]+timeData.length+2){
          let addr = XLSX.utils.encode_cell({ r: R, c: colNum2 });
          if (!worksheet[addr]) continue;
          worksheet[addr].t = "n";
          worksheet[addr].z = "#,##0";
        }
      }
    });
    const loanConvertRange = ['E','F'];
    loanConvertRange.forEach((col)=>{
      let colNum2 = XLSX.utils.decode_col(col);
      let range2 = XLSX.utils.decode_range(worksheet["!ref"]);
      range2.s.c = range2.e.c = colNum2;
      for (let R = range2.s.r; R <= range2.e.r; R++) {
        if(R>theadIndexes[2] && R<theadIndexes[2]+inoutData.length+2){
          let addr = XLSX.utils.encode_cell({ r: R, c: colNum2 });
          if (!worksheet[addr]) continue;
          worksheet[addr].t = "n";
          worksheet[addr].z = "#,##0";
        }
      }
    });
    
    // workbook에 worksheet를 더해 "일일시재보고서"라는 새 워크시트 생성
    XLSX.utils.book_append_sheet(workbook, worksheet, "일일시재보고서");
    worksheet["A6"].t="n";
    worksheet["A6"].z="#,##0";
    worksheet["D6"].t="n";
    worksheet["D6"].z="#,##0";
    worksheet["G6"].t="n";
    worksheet["G6"].z="#,##0";

    // blob 생성
    const workbookBlob = workbook2blob(workbook);

    const dataInfo = {
      titleRange: "A1:I2",
      dateRange: "A3:I3",
      stateRange: "A5:C5",
      inoutRange: "D5:F5",
      loanRange: "G5:I5",
      stateBalRange: "A6:C6",
      inoutBalRange: "D6:F6",
      loanBalRange: "G6:I6",
      balSummaryRange: "A5:I6",
      inoutAcctRange: `A9:B${theadIndexes[0]+inoutData.length+2}`,
      inoutCntRange: `D9:I${theadIndexes[0]+inoutData.length+2}`,
      inoutTotalRange: `A${theadIndexes[0]+inoutData.length+2}:I${theadIndexes[0]+inoutData.length+2}`,
      timeAcctRange: `A${theadIndexes[1] + 1}:B${theadIndexes[1]+timeData.length+2}`,
      timeloanNmRange: `D${theadIndexes[1] + 1}:E${theadIndexes[1]+timeData.length+2}`,
      timeAgmtAmtRange: `F${theadIndexes[1] + 1}:F${theadIndexes[1]+timeData.length+2}`,
      timeExpiDtRange: `G${theadIndexes[1] + 1}:G${theadIndexes[1]+timeData.length+2}`,
      timeBalRange: `H${theadIndexes[1] + 1}:I${theadIndexes[1]+timeData.length+2}`,
      timeTotalRange: `A${theadIndexes[1]+timeData.length+2}:I${theadIndexes[1]+timeData.length+2}`,
      loanAcctRange: `A${theadIndexes[2] + 1}:B${theadIndexes[2]+loanData.length+2}`,
      loanNmRange: `D${theadIndexes[2] + 1}:D${theadIndexes[2]+loanData.length+2}`,
      loanAgmtAmtRange: `E${theadIndexes[2] + 1}:F${theadIndexes[2]+loanData.length+2}`,
      loanDateRange: `G${theadIndexes[2] + 1}:I${theadIndexes[2]+loanData.length+2}`,
      loanTotalRange: `A${theadIndexes[2]+loanData.length+2}:I${theadIndexes[2]+loanData.length+2}`,
      tbodyRange: `A4:I${finalData.length}`,
      theadRange1:
        theadIndexes.length >= 1
          ? `A${theadIndexes[0] + 1}:I${theadIndexes[0] + 1}`
          : null,
      theadRange2:
        theadIndexes.length >= 2
          ? `A${theadIndexes[1] + 1}:I${theadIndexes[1] + 1}`
          : null,
      theadRange3:
      theadIndexes.length >= 2
        ? `A${theadIndexes[2] + 1}:I${theadIndexes[2] + 1}`
        : null,          
    };
    return customizeStyle(workbookBlob, dataInfo);
  };
  const customizeStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        // 각 컬럼 너비 지정
        sheet.column("A").width(16);
        sheet.column("B").width(22);
        sheet.column("C").width(15);
        sheet.column("D").width(30);
        sheet.column("E").width(20);
        sheet.column("F").width(15);
        sheet.column("G").width(20);
        sheet.column("H").width(20);
        sheet.column("I").width(20);

        // 각 행 높이 지정
        sheet.row(3).height(25);
        sheet.row(5).height(30);
        sheet.row(6).height(30);

        // title 스타일 지정
        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          fontSize: 20,
        });

        // 기준일 부분 스타일
        sheet.range(dataInfo.dateRange).merged(true).style({
          bold: true,
          horizontalAlignment: "left",
          verticalAlignment: "center",
          fontSize: 12,
          fill: "d1d1d1",
        });
        // tbody 스타일 지정
        sheet.range(dataInfo.tbodyRange).style({
          verticalAlignment: "center",
          horizontalAlignment: "center",
        });
        sheet.range(dataInfo.theadRange1).style({
          fill: "003b87",
          bold: true,
          fontColor: "ffffff",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.theadRange2).style({
          fill: "003b87",
          bold: true,
          fontColor: "ffffff",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.theadRange3).style({
          fill: "003b87",
          bold: true,
          fontColor: "ffffff",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.inoutAcctRange).style({
          horizontalAlignment: "left",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.inoutCntRange).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.timeAcctRange).style({
          horizontalAlignment: "left",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.timeloanNmRange).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.timeAgmtAmtRange).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.timeExpiDtRange).style({
          horizontalAlignment: "left",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.timeBalRange).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.loanAcctRange).style({
          horizontalAlignment: "left",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.loanNmRange).style({
          horizontalAlignment: "left",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.loanAgmtAmtRange).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.loanDateRange).style({
          horizontalAlignment: "left",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.inoutTotalRange).style({
          fill: "efefef",
          bold: true,
        });
        sheet.range(dataInfo.timeTotalRange).style({
          fill: "efefef",
          bold: true,
        });
        sheet.range(dataInfo.loanTotalRange).style({
          fill: "efefef",
          bold: true,
        });
        // merged => boolean으로 true시 병합
        sheet.range(dataInfo.stateRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.inoutRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.loanRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.stateBalRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.inoutBalRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.loanBalRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.balSummaryRange).style({
          border: true
        });
      });
      // 파일 링크 생성
      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };
  // return <button onClick={() => excelDownload()}>Excel 내보내기</button>;
  return excelDownload();

};
export default ExcelExportComponent;