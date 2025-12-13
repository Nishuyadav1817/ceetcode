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
  "http://localhost:1234",                 
  "https://ceetcode-3atk.vercel.app",      // frontend
  "https://ceetcode-cyan.vercel.app",      // backend itself (optional)
  "https://ceetcode-omega.vercel.app"      // if you use this backend
];

app.use(cors({
  origin: allowedOrigins,
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
