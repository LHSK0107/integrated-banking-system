const express=require('express');
const router=express.Router();
const axios = require('axios');
require('dotenv').config();

const url="https://scloudadmin.appplay.co.kr/gw/ErpGateWay";
const data={
    API_ID: "2410",
    API_KEY: "5e46561fa40f43a6b3ba",
    ORG_NO: "BUSAN",
    BIZ_NO: "1078783749",
    REQ_DATA: {
      ACCT_NO: ""
    }
};
router.get("/getAccountList",(req, res)=>{
  axios.post(url,data)
  .then((response)=>{
    res.json(response.data);
  })
});
// 계좌 조회
router.get("/getDetailAccountHistory/:acctNo",(req, res)=>{
  const acctNo = req.params;
  axios.post(url,{
    API_ID: process.env.ACCOUNT_LIST_CODE,
    API_KEY: process.env.API_KEY,
    ORG_NO: "BUSAN",
    BIZ_NO: process.env.BIZ_NO,
    REQ_DATA: {
      ACCT_NO: acctNo
    }
  })
  .then((response)=>{
    res.json(response.data);
  })
});
// 계좌 거래내역 상세 조회
router.get("/getDate/:detailNo/:strDate/:endDate",(req, res)=>{
  const {detailNo, strDate, endDate} = req.params;
  console.log(`detailNo:${detailNo}, strDate:${strDate}, endDate:${endDate}`);
  axios.post(url,{
    API_ID: process.env.ACCOUNT_TRANSACTION_CODE,
    API_KEY: process.env.API_KEY,
    ORG_NO: "BUSAN",
    BIZ_NO: process.env.BIZ_NO,
    REQ_DATA: {
      ACCT_NO: detailNo,
      INQ_STR_DT : strDate,
      INQ_END_DT : endDate,
      PAGE_CNT : "10"
    }
  })
  .then((response)=>{
    console.log(response.data);
    res.json(response.data);
  })
});
module.exports = router;