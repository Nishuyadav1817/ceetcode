const express=require('express');
const Redis=require("../redis");
const jwt=require("jsonwebtoken");
const User =require('../user')
require("dotenv").config();



const UserVerify = async (req, res, next) => {
  try {
    // Read token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Invalid user Token not found" });
    }

    const Token = authHeader.split(' ')[1];

    const payload = jwt.verify(Token, process.env.JWT_KEY);
    const { _id } = payload;

    if (!_id) {
      return res.status(401).json({ message: "Token not valid" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBlocked = await Redis.exists(`token:${Token}`);
    if (isBlocked) {
      return res.status(401).json({ message: "Token is blocked" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid user Token" });
  }
};


module.exports=UserVerify;