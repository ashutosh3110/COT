const mongoose = require("mongoose");
require('dotenv').config();

const connectDb=async () =>{
    try{
         await mongoose.connect("mongodb+srv://ashutoshbankey21306_db_user:DkXxAu1ZuMLDrGDG@cluster0.0koicmf.mongodb.net/?appName=Cluster0");
         console.log("MONGODB Connected");
    }
    catch(error){
        console.log("MONGODB Connection failed",error);

    }
}

module.exports=connectDb;