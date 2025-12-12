const express=require('express');
const Redis=require("../redis");
const jwt=require("jsonwebtoken");
const User =require('../user')
require("dotenv").config();

const UserVerify = async (req,res,next) =>{
  try{
    const {Token}=req.cookies;
    if(!Token){
        throw new Error("Invalid user Token not found")
    }
     const payload=jwt.verify(Token,process.env.JWT_KEY)
     const {_id}=payload;

     if(!_id){
        throw new Error("token not founnd")
     }

     const user=await User.findById(_id);
     if(!user){
        throw new Error("User not found")
     }

     const isBlocked=await Redis.exists(`token:${Token}`);
     if(isBlocked){
        throw new Error("Token not valid");
     }

     req.user=user
     next();

  }catch(err){
   console.log(err)
    res.send("Invalid error :" + err)
  }
}

module.exports=UserVerify;