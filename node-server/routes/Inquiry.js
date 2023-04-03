const express=require('express');
const router=express.Router();
const axios = require('axios');

const url="https://scloudadmin.appplay.co.kr/gw/ErpGateWay";
const data={
    API_ID: "2410",
    API_KEY: process.env.API_KEY,
    ORG_NO: "BUSAN",
    BIZ_NO: process.env.BIZ_NO,
    REQ_DATA: {
      ACCT_NO: ""
    }
};

module.exports = router;