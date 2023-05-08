import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import BankNM from "../../../hooks/useBankName";
import ReactDomServer from 'react-dom/server';
import ExcelIcon from "../../../assets/images/icon/excel.png";
import "../inquiry.css";
const ExcelExportComponent = ({ stateData, depAInsData, loadData, stateBal, depInsBal, loanBal }) => {
  
  const excelDownload = () => {
    createTable().then((url) => {
      // console.log(`엑셀 blob url : ${url}`);
      const downloadNode = document.createElement("a");
      downloadNode.setAttribute("href", url);
      downloadNode.setAttribute("download", "전체계좌조회.xlsx");
      downloadNode.click();
      downloadNode.remove();
    });
  };
  // 현재시각 조회
  const date = new Date();
  const currentTime = `${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

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
    const wbout = XLSX.write(workbook, woptions, { cellStyles: true });

    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    return blob;
  };

  const createTable = () => {
    // 메인 타이틀 => A
    const mainTitle = [{ A: "전체계좌조회" }, {}];

    // column header 타이틀
    // 총 합계
    let allBalTable=[
      {
        A: "수시입출금",
        B: "",
        C: stateBal,
        D: "",
        E: "정기예적금",
        F: depInsBal,
        G: "",
        H: "대출",
        I: loanBal
      }
    ]
    // 수시입출금
    let stateTable = [
      {
        A: "순번",
        B: "은행명",
        C: "계좌명",
        D: "계좌번호",
        E: "계좌별칭",
        F: "신규일자",
        G: "만기일자",
        H: "잔액",
        I: "출금가능잔액",
      },
    ];
    // 정기예적금
    let depAInsTable = [
      {
        A: "순번",
        B: "은행명",
        C: "계좌명",
        D: "계좌번호",
        E: "계좌별칭",
        F: "신규일자",
        G: "만기일자",
        H: "잔액",
        I: "출금가능잔액",
      },
    ];
    // 대출
    let loanTable = [
      {
        A: "순번",
        B: "은행명",
        C: "계좌명",
        D: "계좌번호",
        E: "계좌별칭",
        F: "신규일자",
        G: "만기일자",
        H: "잔액",
        I: "출금가능잔액",
      },
  ];
    
    stateData.forEach((row, index) => {
      stateTable.push({
        A: index + 1,
        B: ReactDomServer.renderToStaticMarkup(<BankNM bankCD={row.bankCd} />),
        C: row.loanNm,
        D: ` ${row.acctNo} `,
        E: row.acctNickNm==="nick" ? "없습니다." : row.acctNickNm,
        F: row.newDt==="1000-01-01" ? "없습니다." : row.newDt,
        G: row.expiDt==="1000-01-01" ? "없습니다." : row.expiDt,
        H: row.bal,
        I: row.realAmt,
      });
    });
    depAInsData.forEach((row, index) => {
      depAInsTable.push({
        A: index + 1,
        B: ReactDomServer.renderToStaticMarkup(<BankNM bankCD={row.bankCd} />),
        C: row.loanNm,
        D: ` ${row.acctNo} `,
        E: row.acctNickNm==="nick" ? "없습니다." : row.acctNickNm,
        F: row.newDt==="1000-01-01" ? "없습니다." : row.newDt,
        G: row.expiDt==="1000-01-01" ? "없습니다." : row.expiDt,
        H: row.bal,
        I: row.realAmt,
      });
    });
    loadData.forEach((row, index)=>{
        loanTable.push({
          A: index + 1,
          B: ReactDomServer.renderToStaticMarkup(<BankNM bankCD={row.bankCd} />),
          C: row.loanNm,
          D: ` ${row.acctNo} `,
          E: row.acctNickNm==="nick" ? "없습니다." : row.acctNickNm,
          F: row.newDt==="1000-01-01" ? "없습니다." : row.newDt,
          G: row.expiDt==="1000-01-01" ? "없습니다." : row.expiDt,
          H: row.bal,
          I: row.realAmt,
        });
    });
    // 전체 테이블 합치기
    stateTable = [
      {
        A: "전체계좌조회는 현재 조회가 가능한 계좌목록을 한 번에 확인할 수 있습니다.",
      },
    ]
      .concat([{ A: `기준일: ${String(currentTime)}` }])
      // A5
      .concat([{ A: "* 총 잔액" }])
      // A6
      .concat(allBalTable)
      .concat([""])
      .concat([""])
      .concat({ A: "* 수시입출금" })
      .concat(stateTable)
      .concat([""])
      .concat({ A: "* 정기예적금" })
      .concat(depAInsTable)
      .concat([""])
      .concat({ A: "* 대출" })
      .concat(loanTable);

    // 보고서 제목과 전체 테이블 합치기
    const finalData = [...mainTitle, ...stateTable];

    // sheetjs docs 'Create a Workbook' 참조
    // workbook 생성, xlsx 활용
    const workbook = XLSX.utils.book_new();

    // worksheet 생성
    let worksheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    // workbook에 worksheet를 더해 "일일시재보고서"라는 새 워크시트 생성
    XLSX.utils.book_append_sheet(workbook, worksheet, "전체계좌조회");

    // decode_col - 0과 index 컬럼과 컬럼명을 convert
    // H열 타입 지정 및 tHead 예외처리
    let colNum = XLSX.utils.decode_col("H");
    let range = XLSX.utils.decode_range(worksheet["!ref"]);
    range.s.c = range.e.c = colNum;
    for (let R = range.s.r; R <= range.e.r; R++) {
      if(R>7){
        let addr = XLSX.utils.encode_cell({ r: R, c: colNum });
        if (!worksheet[addr]) continue;
        if(worksheet[addr].v==="잔액" || worksheet[addr].v==="" || worksheet[addr].v===null) continue;
        worksheet[addr].t = "n";
        worksheet[addr].z = "#,##0";
      }
    }
    // decode_col - 0과 index 컬럼과 컬럼명을 convert
    // I열 타입 지정 및 tHead 예외처리
    let colNum2 = XLSX.utils.decode_col("I");
    let range2 = XLSX.utils.decode_range(worksheet["!ref"]);
    range2.s.c = range2.e.c = colNum;
    for (let R = range2.s.r; R <= range2.e.r; R++) {
      if(R>7){
        let addr = XLSX.utils.encode_cell({ r: R, c: colNum2 });
        if (!worksheet[addr]) continue;
        if(worksheet[addr].v==="출금가능잔액" || worksheet[addr].v==="" || worksheet[addr].v===null) continue;
        worksheet[addr].t = "n";
        worksheet[addr].z = "#,##0";
      }
    }
    worksheet["C6"].t="n";
    worksheet["C6"].z="#,##0";
    worksheet["F6"].t="n";
    worksheet["F6"].z="#,##0";
    worksheet["I6"].t="n";
    worksheet["I6"].z="#,##0";
    
    // blob 생성
    const workbookBlob = workbook2blob(workbook);

    // thead index 구하기
    const theadIndexes = [];
    // 포함된 컬럼명으로 구함
    finalData.forEach((data, index) => {
        if(data["A"]==="순번"){
          theadIndexes.push(index)
        }
      }
    );
    const dataInfo = {
      titleRange: "A1:I1",
      allBalTitleRange: "A5:B5",
      stateBalTitleRange: "A6:B7",
      stateBalResRange: "C6:C7",
      depInsTitleRange: "E6:E7",
      depInsResRange: "F6:F7",
      loanBalTitleRange: "H6:H7",
      loanBalResRange: "I6:I7",
      firstSubTitleRange: "A9:B9",
      secondSubTitleRange: `A${theadIndexes[1]}:B${theadIndexes[1]}`,
      thirdSubTitleRange: `A${theadIndexes[2]}:B${theadIndexes[2]}`,
      descRange: "A3:I3",
      dateRange: "A4:I4",
      tbodyRange: `A9:I${finalData.length}`,
      theadRange1:
        theadIndexes.length >= 1
          ? `A${theadIndexes[0] + 1}:I${theadIndexes[0] + 1}`
          : null,
      theadRange2:
        theadIndexes.length >= 1
          ? `A${theadIndexes[1] + 1}:I${theadIndexes[1] + 1}`
          : null,
      theadRange3:
      theadIndexes.length >= 1
        ? `A${theadIndexes[2] + 1}:I${theadIndexes[2] + 1}`
        : null,
      indexRange:`A10:A${finalData.length}`,
      balTitleRange: theadIndexes.length >= 1
      ? `H${theadIndexes[0] + 1}:I${theadIndexes[0] + 1}`
      : null,
      dataColumnRange: `F10:H${finalData.length}`,
      secondTHeadRange:`H${theadIndexes[1]+1}:I${theadIndexes[1]+1}`,
      thirdTHeadRange:`H${theadIndexes[2]+1}:I${theadIndexes[2]+1}`,
      bColumnRange: `B10:B${finalData.length}`,
    };
    return customizeStyle(workbookBlob, dataInfo);
  };
  const customizeStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        // 각 컬럼 너비 지정
        sheet.column("A").width(5);
        sheet.column("B").width(9);
        sheet.column("C").width(30);
        sheet.column("D").width(21);
        sheet.column("E").width(20);
        sheet.column("F").width(15);
        sheet.column("G").width(20);
        sheet.column("H").width(20);
        sheet.column("I").width(20);

        // 각 행 높이 지정
        sheet.row(1).height(46);
        sheet.row(3).height(25);
        sheet.row(4).height(22);
        // title 스타일 지정
        // merged => boolean으로 true시 병합
        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          horizontalAlignment: "left",
          verticalAlignment: "center",
          fontSize: 30,
        });
        // 설명 스타일 지정
        sheet.range(dataInfo.descRange).merged(true).style({
          horizontalAlignment: "left",
          verticalAlignment: "center",
          fontSize: 12,
        });
        // 기준일 부분 스타일 지정
        sheet.range(dataInfo.dateRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
          fontSize: 12,
          bold:true
        });
        // 총 잔액 부분 스타일 지정
        sheet.range(dataInfo.allBalTitleRange).merged(true).style({
          fontSize:14,
          bold:true,
          horizontalAlignment:"left"
        });
        sheet.range(dataInfo.indexRange).style({
          horizontalAlignment: "center",
          verticalAlignment : "center"
        });

        sheet.range(dataInfo.theadRange1).style({
          fill: "7A84F8",
          bold: true,
          fontColor: "ffffff",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.theadRange2).style({
          fill: "7A84F8",
          bold: true,
          fontColor: "ffffff",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.theadRange3).style({
          fill: "7A84F8",
          bold: true,
          fontColor: "ffffff",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.balTitleRange).style({
          horizontalAlignment:"right"
        });

        sheet.range(dataInfo.bColumnRange).style({
          horizontalAlignment:"center"
        });
        sheet.range(dataInfo.secondTHeadRange).style({
          horizontalAlignment:"right"
        })
        sheet.range(dataInfo.thirdTHeadRange).style({
          horizontalAlignment:"right"
        })
        
        sheet.range(dataInfo.dataColumnRange).style({
          horizontalAlignment:"right"
        });
        sheet.range(dataInfo.firstSubTitleRange).merged(true).style({
          fontSize:14,
          bold:true,
          horizontalAlignment:"left"
        });
        sheet.range(dataInfo.secondSubTitleRange).merged(true).style({
          fontSize:14,
          bold:true,
          horizontalAlignment:"left"
        });
        sheet.range(dataInfo.thirdSubTitleRange).merged(true).style({
          fontSize:14,
          bold:true,
          horizontalAlignment:"left"
        });

        sheet.range(dataInfo.stateBalTitleRange).merged(true).style({
          horizontalAlignment:"center",
          verticalAlignment: "center",
          border: true
        });
        sheet.range(dataInfo.stateBalResRange).merged(true).style({
          horizontalAlignment:"right",
          verticalAlignment: "center",
          border: true
        });
        sheet.range(dataInfo.depInsTitleRange).merged(true).style({
          horizontalAlignment:"center",
          verticalAlignment: "center",
          border: true
        });
        sheet.range(dataInfo.depInsResRange).merged(true).style({
          horizontalAlignment:"right",
          verticalAlignment: "center",
          border: true
        });
        sheet.range(dataInfo.loanBalTitleRange).merged(true).style({
          horizontalAlignment:"center",
          verticalAlignment: "center",
          border: true
        });
        sheet.range(dataInfo.loanBalResRange).merged(true).style({
          horizontalAlignment:"right",
          verticalAlignment: "center",
          border: true
        });
      });
      // 파일 링크 생성
      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };

  return <button className="excel-btn" onClick={() => excelDownload()}><img src={ExcelIcon} alt="excel img icon" style={{width:"20px",height:"20px"}}/>Excel</button>;
};
export default ExcelExportComponent;
