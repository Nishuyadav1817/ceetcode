// server/index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import AuthRouter from "./UserAuth.js";
import ProblemRouter from "./Questions/problemauth.js";
import Submitproblem from "./Submitcode/submitAuth.js";
import main from "./db.js";
import Redis from "./redis.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS setup for Vercel + local dev
const allowedOrigins = [
  "http://localhost:1234",                 // local frontend
  "https://ceetcode-3atk.vercel.app"      // deployed frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

// Handle preflight OPTIONS requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// Routes
app.use("/user", AuthRouter);
app.use("/problem", ProblemRouter);
app.use("/submit", Submitproblem);

// Serverless export for Vercel
export default async function handler(req, res) {
  try {
    await Promise.all([main(), Redis.connect()]);
    app(req, res);
  } catch(err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}
