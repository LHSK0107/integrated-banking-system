const express=require('express');
const router=express.Router();

router.post("/signup",(req,res)=>{
    const {id,password,name,dept,email,phone}=req.body;
    Users.create({
        id: id,
        password:password,
        name:name,
        dept: dept,
        email: email,
        phone:phone
    });
    res.json("success");
});
router.get("/signup",(req,res)=>{
    res.send("<h1>success</h1>");
});

module.exports=router;