const express=require("express")
const route=express.Router()
const {runCode}=require("../controller/codeCompiler")
route
.post("/run",runCode)

exports.route=route