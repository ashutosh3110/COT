const User=require("../models/userSchema")
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");

const generateaccessToken=(userId)=>{
    return jwt.sign({userId},"abcdefgh",{
        expiresIn:"1m",
    });
};

const generateRefreshToken=(userId)=>{
    return jwt.sign({userId},"abcdef",{
        expiresIn:"7d",
    });
};

 exports.getData=async(req,res)=>{
    res.json("Hello world");
 };

 exports.registerUser=async (req,res) =>{
    try{
        const {name,email,password}=req.body;

        if(!name || !email ||  !password){
            return res.status(400).json({message:"All field are required"});
        }
          console.log(User);
        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
    
        const hashPass=await bcrypt.hash(password,10);
        const user =await User.create({
            name,
            email,
            password:hashPass,
        });
        const accessToken=generateaccessToken(user._id);
        const refreshToken=generateRefreshToken(user._id);


        user.refreshToken=refreshToken;
        await user.save();

        return res.status(201).json({
            message:"user registered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            },
            accessToken,
            refreshToken,
        });
    
    }

        catch(error){
            console.log("some error coming",error);
            return res.status(500).json({message:"Server Error"});
        }
       
    };

    exports.login=async (req,res)=>{
        try{
            const {email,password}=req.body;
            if(!email || !password){
                return res.status(400).json({message:"Email and password are required"});
            }

            const user=await User.findOne({email});

            if(!user){
                return res.status(401).json({message:"Invalid email or password"});
            };

            const isMatch=await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(401).json({message:"email and password are invalid"});
            }
            const accessToken=generateaccessToken(user._id);
            const refreshToken=generateRefreshToken(user._id);
            user.refreshToken=refreshToken;
        await user.save();

        return res.json({
            message:"user registered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            },
            accessToken,
            refreshToken,
        });
        }catch(error){
            console.log("Login error",error);
            res.status(500).json({message:"Server error"})
        }
    };


    exports.refreshToken=async (req,res)=>{
        try{
            const {refreshToken}=req.body;

            if(!refreshToken){
                return res.status(401).json({message:"refresh token is required"});
            }
            jwt.verify(
                refreshToken,
                "abcde",
                async(err,decoded)=>{
                    if(err){
                        console.log("refresh token verify error",err);
                        return res.status(401).json({message:"Invalid or expired token"});
                    }

                    const userId=decoded.userId;


                    const user=await User.findById(userId);
                  
                    if(!user || user.refreshToken !== refreshToken){
                        res.status(403).json({message:"refresh token not find"});
                    }
                    const accessToken=generateaccessToken(user._id);
                    const refreshToken=generateRefreshToken(user._id);
            
            
                    user.refreshToken=refreshToken;
                    await user.save();
            
                    return res.status(201).json({
                        message:"user registered successfully",
                        user:{
                            id:user._id,
                            name:user.name,
                            email:user.email,
                        },
                        accessToken,
                        refreshToken,
                    });
                 
                }
            )
        
        }catch(error){
            console.log("refresh token error");
        }
    }
 
