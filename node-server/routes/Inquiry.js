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
  axios.post(url,{
    API_ID: "2410",
    API_KEY: "5e46561fa40f43a6b3ba",
    ORG_NO: "BUSAN",
    BIZ_NO: "1078783749",
    REQ_DATA: {
      ACCT_NO: ""
    }
  })
  .then((response)=>{
    console.log(response.data);
    res.json(response.data);
  })
});

module.exports = router;