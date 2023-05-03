import React from 'react';
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import useAxios from "../../../api/useAxios";
const ExcelExportComponent = ({selectDate, lang}) =>{

  const {apiData} = useAxios("");
  const data1 = [
    {
      BALANCE: {
        statement: "461,169",
        inout: "2,244,000,000",
        loan: "111,637,508",
        cash:"159,890"
      }
    }
  ]
  const data2 = [
    {
      STATE_ACCT:{
        bankNm: "기업은행",
        acctNo: "082-052234-04-013",
        bankNk: "기업 4013",
        outCnt: 0,
        outBal: 0,
        inCnt: 0,
        inBal: 0,
        loanMax: 0,
        bal: "1,604",
        outAmt:"1,604"
      }
    },
    {
      STATE_ACCT:{
        bankNm: "기업은행",
        acctNo: "082-052234-04-021",
        bankNk: "기업 4021",
        outCnt: 0,
        outBal: 0,
        inCnt: 0,
        inBal: 0,
        loanMax: 0,
        bal: "179,778",
        outAmt:"179,778"
      }
    },
    {
      STATE_ACCT:{
        bankNm: "기업은행",
        acctNo: "082-052234-04-013",
        bankNk: "기업 4013",
        outCnt: 0,
        outBal: 0,
        inCnt: 0,
        inBal: 0,
        loanMax: 0,
        bal: "1,604",
        outAmt:"1,604"
      }
    },
    {
      STATE_ACCT:{
        bankNm: "기업은행",
        acctNo: "082-052234-04-021",
        bankNk: "기업 4021",
        outCnt: 0,
        outBal: 0,
        inCnt: 0,
        inBal: 0,
        loanMax: 0,
        bal: "179,778",
        outAmt:"179,778"
      }
    },
  ];
    const excelDownload = () =>{
        createTable().then(url=>{
            console.log(url);
            const downloadNode = document.createElement('a');
            downloadNode.setAttribute("href", url);
            downloadNode.setAttribute("download", "일일시재보고서.xlsx");
            downloadNode.click();
            downloadNode.remove();
        });
    };

    const date = new Date();
    const currentTime = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

    const s2ab = (s) => {
        const buffer = new ArrayBuffer(s.length);
        const view = new Uint8Array(buffer);
        for(let i=0; i!==s.length; ++i){
            view[i]=s.charCodeAt(i)
        }
        return buffer;
    }

    const workbook2blob = (workbook) => {
        const woptions = {
            bookType: 'xlsx',
            type: 'binary'
        }
        const wbout = XLSX.write(workbook, woptions);

        const blob = new Blob([s2ab(wbout)],{
            type: 'application/octet-stream'
        });
        return blob;
    }

    const createTable = () =>{
        // 메인 타이틀 => A
        const mainTitle = [{A:'일일시재보고서'},{}];

        // column header 타이틀
        let tb1 = [
            {
                A: "입출식예금잔액",
                B: "",
                C:"",
                D: "정기예적금잔액",
                E:"",
                F:"",
                G: "대출금잔액",
                H:"",
                I: "현금보유잔액",
                J: ""
            }
        ];
        let tb2 = [
            {
                A: "은행",
                B: "계좌번호",
                C: "계좌별칭",
                D: "출금건수",
                E: "출금액",
                F: "입금건수",
                G: "입금액",
                H: "대출한도",
                I: "잔액",
                J: "출금가능잔액"
            }
        ];
        data1.forEach((row)=>{
            const balanceDetail = row.BALANCE;
            tb1.push({
                A: balanceDetail.statement,
                D: balanceDetail.inout,
                G: balanceDetail.loan,
                I: balanceDetail.cash
            });
        });
        data2.forEach((row)=>{
            const stateAcctDetail = row.STATE_ACCT;
            tb2.push({
                A: stateAcctDetail.bankNm,
                B: stateAcctDetail.acctNo,
                C: stateAcctDetail.bankNk,
                D: stateAcctDetail.outCnt,
                E: stateAcctDetail.outBal,
                F: stateAcctDetail.inCnt,
                G: stateAcctDetail.inBal,
                H: stateAcctDetail.loanMax,
                I: stateAcctDetail.bal,
                J: stateAcctDetail.outAmt
            });
        });
        // 전체 테이블 합치기
        tb1 = [{A:`기준일: ${currentTime}`}]
        .concat([""])
        .concat(tb1)
        .concat([""])
        .concat([{A:"*입출식예금"}])
        .concat(tb2);
        console.log(tb1);

        // 보고서 제목과 전체 테이블 합치기
        const finalData = [...mainTitle, ...tb1];

        // sheetjs docs 'Create a Workbook' 참조

        // workbook 생성, xlsx 활용
        const workbook = XLSX.utils.book_new();

        // worksheet 생성
        const worksheet = XLSX.utils.json_to_sheet(finalData,{
            skipHeader: true
        });

        // workbook에 worksheet를 더해 "일일시재보고서"라는 새 워크시트 생성 
        XLSX.utils.book_append_sheet(workbook, worksheet, "일일시재보고서");

        // blob 생성
        const workbookBlob = workbook2blob(workbook);

        // thead index 구하기
        const theadIndexes = [];
        // 포함된 컬럼명으로 구함
        finalData.forEach((data, index)=> data["A"]==="입출식예금잔액" || data["I"] ==="잔액" ? theadIndexes.push(index):null);

        const dataInfo = {
            titleRange: 'A1:J2',
            dateRange: 'A3:J3',
            stateRange: 'A5:C5',
            inoutRange: 'D5:F5',
            loanRange: 'G5:H5',
            cashRange: 'I5:J5',
            stateBalRange: 'A6:C6',
            inoutBalRange: 'D6:F6',
            loanBalRange: 'G6:H6',
            cashBalRange: 'I6:J6',
            tbodyRange: `A4:J${finalData.length}`,
            theadRange1: theadIndexes.length >= 1 ? `A${theadIndexes[0] + 1}:J${theadIndexes[0]+1}`:null,
            theadRange2: theadIndexes.length >= 2 ? `A${theadIndexes[1] + 1}:J${theadIndexes[1]+1}`:null,
        }
        return customizeStyle(workbookBlob, dataInfo);
    };
    const customizeStyle = (workbookBlob,dataInfo) => {
        return XlsxPopulate.fromDataAsync(workbookBlob).then(workbook=>{
            workbook.sheets().forEach(sheet=>{
                // 각 컬럼 너비 지정
                sheet.column('A').width(16);
                sheet.column('B').width(22);
                sheet.column('C').width(15);
                sheet.column('D').width(15);
                sheet.column('E').width(20);
                sheet.column('F').width(15);
                sheet.column('G').width(20);
                sheet.column('H').width(20);
                sheet.column('I').width(20);
                sheet.column('J').width(20);
                
                // 각 행 높이 지정
                sheet.row(3).height(25);
                sheet.row(5).height(30);
                sheet.row(6).height(30);

                // title 스타일 지정
                sheet.range(dataInfo.titleRange).merged(true).style({
                    bold:true,
                    horizontalAlignment: "center",
                    verticalAlignment: "center",
                    fontSize:20,
                });

                // 기준일 부분 스타일
                sheet.range(dataInfo.dateRange).merged(true).style({
                    bold:true,
                    horizontalAlignment: "left",
                    verticalAlignment: "center",
                    fontSize:12,
                    fill:"d1d1d1"
                });

                // merged => boolean으로 true시 병합
                sheet.range(dataInfo.stateRange).merged(true).style({
                    horizontalAlignment:"right",
                    bold:true,
                });
                sheet.range(dataInfo.inoutRange).merged(true).style({
                    horizontalAlignment:"right"
                });
                sheet.range(dataInfo.loanRange).merged(true).style({
                    horizontalAlignment:"right"
                });
                sheet.range(dataInfo.cashRange).merged(true).style({
                    horizontalAlignment:"right"
                });
                sheet.range(dataInfo.stateBalRange).merged(true).style({
                    horizontalAlignment:"right"
                });
                sheet.range(dataInfo.inoutBalRange).merged(true).style({
                    horizontalAlignment:"right"
                });
                sheet.range(dataInfo.loanBalRange).merged(true).style({
                    horizontalAlignment:"right"
                });
                sheet.range(dataInfo.cashBalRange).merged(true).style({
                    horizontalAlignment:"right"
                });

                // tbody 스타일 지정
                sheet.range(dataInfo.tbodyRange).style({
                    verticalAlignment: "center",
                    horizontalAlignment: "center"
                 });
                sheet.range(dataInfo.theadRange1).style({
                    fill: "7A84F8",
                    bold: true,
                    fontColor: "ffffff",
                    verticalAlignment: "center"
                });
                sheet.range(dataInfo.theadRange2).style({
                    fill: "7A84F8",
                    bold: true,
                    fontColor: 'ffffff',
                    verticalAlignment: "center"
                });
            });
            // 파일 링크 생성
            return workbook.outputAsync().then(workbookBlob => URL.createObjectURL(workbookBlob));
        })
    };

    return <button onClick={()=>excelDownload()}>Excel 내보내기</button>
}
export default ExcelExportComponent;