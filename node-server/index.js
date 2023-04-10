const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const db = require("./models");
app.use(express.static("public"));
require("dotenv").config();

const inquiryRouter = require("./routes/Inquiry");
app.use("/api", inquiryRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
// ok
app.use("/", (req,res)=>{
  res.send("<h1>success</h1>");
})

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
