const express=require('express');
const router=express.Router();
const {Users} = require("../models");
router.post("/signup", (req,res)=>{
    const {id,password,name,dept,email,phone}=req.body;
    console.log({id,password,name,dept,email,phone});
    Users.create({
        id: id,
        password:password,
        name:name,
        dept: dept,
        email: email,
        phone:phone
    });

    res.send("success");
});
router.get("/signup",(req,res)=>{
    res.send("<h1>success</h1>");
});

module.exports=router;