const express = require('express');
const Redis = require("../redis");
const jwt = require("jsonwebtoken");
const User = require('../user');

const AdminVerify = async (req, res, next) => {
   

    try {
        const Token = req.cookies?.Token;
        if (!Token) {
            return res.status(401).json({ error: "Token not found" });
        }

        const payload = jwt.verify(Token, process.env.JWT_KEY);
        const { _id, role } = payload;
    console.log(payload)
        if (!_id) {
            return res.status(400).json({ error: "User ID missing in token" });
        }
console.log("kjhu")
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
console.log("here 1")
        if (role!='admin') {
            return res.status(403).json({ error: "Access denied: Admins only" });
        }
console.log("con")
        const isBlocked = await Redis.exists(`token:${Token}`);
        if (isBlocked) {
            return res.status(401).json({ error: "Token is blocked or expired" });
        }

        req.user = user;
      console.log("hii here")
        next();

    } catch (err) {
        console.error("AdminVerify Error:", err.message);
        return res.status(401).json({ error: "Invalid or expired token", details: err.message });
    }
};

module.exports = AdminVerify;
