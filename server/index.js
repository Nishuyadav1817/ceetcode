const express= require("express");
const app=express();
require("dotenv").config();
const main=require('./db');
const cookiparcer=require('cookie-parser')
app.use(express.json());
app.use(cookiparcer());
const AuthRouter=require('./UserAuth')
const Validator=require('./Validator');
const Redis=require("./redis");
const ProblemRouter=require('./Questions/problemauth')
const Submitproblem=require("./Submitcode/submitAuth")
const cors = require('cors'); 


const allowedOrigins = [
  "http://localhost:1234",                  // local frontend
  "https://ceetcode-3atk.vercel.app/"    // deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

//Routing Handling
app.use("/user", AuthRouter);
app.use("/problem" ,ProblemRouter);
app.use("/submit",Submitproblem);







const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),Redis.connect()]);
        console.log("DB Connected");
        
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at given port number: ");
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();