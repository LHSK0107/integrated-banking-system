const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const url =
  "https://openapi.naver.com/v1/search/news.json?query=웹케시&display=10&start=1&sort=date";
const data = {
  "X-Naver-Client-Id": process.env.NAVER_API_CLIENT_ID,
  "X-Naver-Client-Secret": process.env.NAVER_API_CLIENT_SECRET,
};
router.get("/getNews", (req, res) => {
  axios
    .get(url, {
      headers: data
    })
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    });
});

module.exports = router;
