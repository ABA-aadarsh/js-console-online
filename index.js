require("dotenv").config()
const express=require("express")
const cors=require("cors")

const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');

// const {router : codeCompilerRouter}=require("./routes/codeCompiler")
const codeCompilerRouter = require("./routes/codeCompiler")

const port=8080
const app=express()

app.use(cors())
app.use(bodyParser.json());
app.use(expressSanitizer());

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Yohoho")
})

app.use("/code",codeCompilerRouter.route)

app.listen(port,()=>{
    console.log("Server is listening on port : ",port)
})

