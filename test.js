// const express = require("express");
// const bodyParser=require("body-parser");
// const app=express();
// const port=process.env.PORT;


// app.use(bodyParser.json());

// app.get("/",(req,res)=>{
//     res.send("Welcome to PHS_API!");
// })

// app.listen(port,()=>{
//     console.log(`server starting at port: ${port}`);
//     console.log(process.env.BASE_URL)
// });
const jsonfile=require("./db/serviceAccountKey.json");
const projectid=jsonfile.project_id;
console.log(projectid);
