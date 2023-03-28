const express = require("express");
const bodyParser=require("body-parser");
const path=require("path");
require("dotenv").config();
const crud=require("./db/crud");
// const pyrunner=require("./pyhandler");
const utils=require("./utils");

const FILE_NAME=""  //set the filename here
const app=express();
const port=process.env.PORT;

app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to PHS_API!");
})

app.get("/hlth",(req,res)=>{
    res.sendStatus(200);
})

app.get("/api/user/:id",(req,res)=>{
    res.send(`You are requesting data if user ${req.params.id}.`);
})

app.get("/api/getkey/:id",async  (req,res)=>{
    let fileId=req.params.id;
    let data={
        key:null
    };
    data.key=await crud.getKey(fileId);
    res.json(data);
});


app.get("/api/generateToken/:adminId",async (req,res)=>{
    const token=utils.generateKey(16);
    let x= await crud.generateDownloadToken(token,req.params.adminId)
    console.log("index.js:37",x);
    if(x){
        res.json({'link':`${process.env.BASE_URL}/download/${token}`});
    }else{
        res.status(403).send("You don't have any permission.");
    }
});


// utils.makeArchive("assets/phs_smtp_tool/",`assets/uploadables/phs_smtp_tool.zip`);
// utils.generateFile();
//download
app.get("/download/:token",async (req,res)=>{
    let x=await crud.checkDownload(req.params.token)
    console.log("index.js:51",x);
    if(!x){
        console.log(`invalid download attempt with token: ${req.params.token}`)
        return res.status(410).send("Download link expired");
    }
    
    const file =path.join(__dirname, '', `assets/uploadables/${FILE_NAME}.zip`);
    
    
    res.download(file,(err)=>{
        if(err){
            console.log(err);
        }else{
            crud.makeExpireDownloadToken(req.params.token);
            utils.generateFile();
        }
    });
});


app.listen(port,()=>{
    console.log(`server starting at port: ${port}`);
    console.log(process.env.BASE_URL);
});
