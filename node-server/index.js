const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const db = require("./models");
app.use(express.static("public"));
require("dotenv").config();
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
app.use("/inquiry",()=>{
  axios.post(url, JSON.stringify(data), {
  headers:{
      "Content-Type": "applcation/json",
      Cookie:
        "JSESSIONID=Epy5I61ifvDSx0rmXMKULOm2QNADpUIW4Wgj2N84.scloudadmin; SCOUTER=x5ogf14l73uv5k",
  }},
 ).then((res)=>{console.log(res.data.RESP_DATA.REC);return res.data.RESP_DATA.REC});
});
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("running on server 3301");
    });
  })
  .catch((error) => {
    console.log(error);
  });
