const express=require('express');
const router=express.Router();

router.post("/signup",async (req,res)=>{
    // const {id,password,name,dept,email,phone}=req.body;
    // console.log({id,password,name,dept,email,phone});
    // Users.create({
    //     id: id,
    //     password:password,
    //     name:name,
    //     dept: dept,
    //     email: email,
    //     phone:phone
    // });
    const data = req.body;
    await Users.create(data);
    res.json({"status":"success"});
});
router.get("/signup",(req,res)=>{
    res.send("<h1>success</h1>");
});

module.exports=router;