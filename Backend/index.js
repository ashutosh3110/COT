require('dotenv').config();
const express=require("express");
const app=express();

const PORT=4000;
const db=require("./config/db.js");

app.use(express.json());

db();

const appRoutes=require("./routes/route.js");


app.use("/app",appRoutes);

app.get("/",(req,res)=>{
    res.json("backend running");
})

app.listen(PORT,()=>{
    console.log(`Your server is running on ${PORT} number`);
});




