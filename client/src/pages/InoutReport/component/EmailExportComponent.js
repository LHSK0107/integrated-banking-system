import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import ReactDomServer from 'react-dom/server';
import BankNM from "../../../hooks/useBankName";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
const EmailExportComponent = ({data}) => {
  const AuthAxios = useAxiosInterceptor();
  const inquiryDate = data?.date;
  const bankName = data?.bankCd==="전체" ? data?.bankCd : ReactDomServer.renderToStaticMarkup(<BankNM bankCD={data?.bankCd} />);
  const accountNumber = data?.acctNo;
  const inoutList = data?.acctlist;
  const excelDownload = () => {
    createTable().then((url) => {
      const fetchBlobData = async(blobUrl) =>{
        const response = await fetch(blobUrl);
        if(!response.ok){
          throw new Error(`fail${blobUrl}`);
        }
        return await response.blob();
      }
      const sendEmailWithAttachment = async (blob)=>{
        console.log(`sendEmail 함수 실행`);
        const formData = new FormData();
        formData.append("file",blob,"일일시재보고서.xlsx");
        const response = await AuthAxios.post("https://iam-api.site/api/users/reports/email", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if(response.status===200){
          alert("이메일 내보내기 성공");
        } else {
          alert("이메일 내보내기에 오류가 발생했습니다.");
          return false;
        }
        return response.data;
      }
      return fetchBlobData(url).then((blob)=>{
        console.log('url 생성');
        return sendEmailWithAttachment(blob);
      });
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
    const mainTitle = [{ A: "입출내역보고서(집계)" }, {}];

    // column header 타이틀
    let tb1 = [
      {
        A: "은행",
        B: "계좌번호",
        C: "이전잔액",
        D: "입금",
        F: "출금",
        G: "",
        H: "잔액",
      }
    ];
    // 입출내역보고서 리스트
    let tb2 = [
      {
        A: "",
        B: "",
        C: "",
        D: "건수",
        E: "금액",
        F: "건수",
        G: "금액",
        H: "",
      },
    ];
    
    let [beforeTotalBal,inTotalcnt, inTotalBal, outTotalcnt, outTotalBal, totalBal] = [0,0,0,0,0,0];
    inoutList?.forEach((row) => {
      beforeTotalBal+=row.beforeBal;
      inTotalcnt+=row.inCnt;
      inTotalBal+=row.inSum;
      outTotalcnt+=row.outCnt;
      outTotalBal+=row.outSum;
      totalBal+=row.afterBal;
      tb2.push({
        A: ReactDomServer.renderToStaticMarkup(<BankNM bankCD={row.bankCd} />),
        B: ` ${row.acctNo}`,
        C: row.beforeBal,
        D: `${row.inCnt}건`,
        E: row.inSum,
        F: `${row.outCnt}건`,
        G: row.outSum,
        H: row.afterBal,
      });
    });
    // 전체 테이블 합치기
    tb1 = [{ A: `조회기간: ${inquiryDate}`, B:"", C:`은행: ${bankName}`, D:`계좌: ${accountNumber}`,E:"",F:"",G:"",H:"" }]
      .concat([""])
      .concat(tb1)
      .concat(tb2)
      .concat([{A:"합계",B:`${inoutList?.length}건`,C:beforeTotalBal,D:`${inTotalcnt}건`,E:inTotalBal,F:`${outTotalcnt}건`,G:outTotalBal,H:beforeTotalBal}])

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
    const totalBalRow = theadIndexes[0]+inoutList.length+3;
    // decode_col - 0과 index 컬럼과 컬럼명을 convert
    // I열 타입 지정 및 tHead 예외처리
    const inoutConvertRange = ['C','E','G','H'];
    inoutConvertRange.forEach((col)=>{
      let colNum2 = XLSX.utils.decode_col(col);
      let range2 = XLSX.utils.decode_range(worksheet["!ref"]);
      range2.s.c = range2.e.c = colNum2;
      for (let R = range2.s.r; R <= range2.e.r; R++) {
        if(R>5 && R<theadIndexes[0]+inoutList.length+3){
          let addr = XLSX.utils.encode_cell({ r: R, c: colNum2 });
          if (!worksheet[addr]) continue;
          worksheet[addr].t = "n";
          worksheet[addr].z = "#,##0";
        }
      }
    });
    
    // workbook에 worksheet를 더해 "일일시재보고서"라는 새 워크시트 생성
    XLSX.utils.book_append_sheet(workbook, worksheet, "입출내역보고서(집계)");

    // blob 생성
    const workbookBlob = workbook2blob(workbook);

    const dataInfo = {
      titleRange: "A1:H2",
      infoRange: "A3:H3",
      dateRange: "A3:B3",
      theadRange: "A5:H6",
      bankHeadRange: "A5:A6",
      acctHeadRange: "B5:B6",
      beforeBalHeadRange: "C5:C6",
      inHeadRange: "D5:E5",
      outHeadRange: "F5:G5",
      balHeadRange: "H5:H6",
      cntBalRange: "D6:G6",
      inoutRange: `D6:G${theadIndexes[0]+inoutList.length+3}`,
      totalBalRange: `A${theadIndexes[0]+inoutList.length+3}:H${theadIndexes[0]+inoutList.length+3}`,
    };
    return customizeStyle(workbookBlob, dataInfo, totalBalRow);
  };
  const customizeStyle = (workbookBlob, dataInfo, totalBalRow) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        // 각 컬럼 너비 지정
        sheet.column("A").width(16);
        sheet.column("B").width(22);
        sheet.column("C").width(15);
        sheet.column("D").width(8.5);
        sheet.column("E").width(11);
        sheet.column("F").width(8.5);
        sheet.column("G").width(11);
        sheet.column("H").width(13);

        // 각 행 높이 지정
        sheet.row(3).height(27);
        sheet.row(5).height(30);
        sheet.row(6).height(30);

        sheet.row(totalBalRow).height(25);

        // title 스타일 지정
        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
          fontSize: 20,
        });
        // 기준일 부분 스타일
        sheet.range(dataInfo.infoRange).style({
          bold: true,
          verticalAlignment: "center",
          fill: "d1d1d1",
          fontSize: 11
        });
        sheet.range(dataInfo.dateRange).merged(true);

        sheet.range(dataInfo.theadRange).style({
          fill: "788496",
          verticalAlignment: "center",
          bold: true,
          fontColor: "ffffff",
        });
        sheet.range(dataInfo.bankHeadRange).merged(true).style({
          rightBorder: true,
          borderColor: "ffffff"
        });
        sheet.range(dataInfo.acctHeadRange).merged(true).style({
          rightBorder: true,
          borderColor: "ffffff"
        });
        sheet.range(dataInfo.beforeBalHeadRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
          rightBorder: true,
          borderColor: "ffffff"
        });
        sheet.range(dataInfo.inHeadRange).merged(true).style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          bottomBorder: true,
          rightBorder: true,
          borderColor: "ffffff"
        });
        sheet.range(dataInfo.outHeadRange).merged(true).style({
          horizontalAlignment: "center",
          verticalAlignment: "center",
          bottomBorder: true,
          rightBorder: true,
          borderColor: "ffffff"
        });
        sheet.range(dataInfo.cntBalRange).style({
          rightBorder: true,
          borderColor: "ffffff"
        });
        sheet.range(dataInfo.balHeadRange).merged(true).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.inoutRange).style({
          horizontalAlignment: "right",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.totalBalRange).style({
          fill: "efefef",
          bold: true,
          verticalAlignment: "center",
        });
      });
      // 파일 링크 생성
      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };
  return excelDownload();
};
export default EmailExportComponent;