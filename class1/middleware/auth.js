//auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth= (req, res, next)=>{
    try{
        //extract jwt token
        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        console.log("header", req.header("Authorization"));
        //pending other ways to fetch token
        const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if(!token || token=== undefined){
            return res.status(401).json({
                success:false, 
                message:"token missing",
            })
        }

        //verify the token
        try{
            const payload=jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user=payload; //this is for storing the payload
        }catch(error){
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            })
        }
        next(); //to check next middleware

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'something went wrong while verifying the token.'
        })
    }
}
//below two middleware are used for autherisation
exports.isStudent= (req, res, next)=>{
    try{
        if(req.user.role != "Student"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for student."
            })
        }

        next();
    }catch(error){
        
        return res.status(500).json({
            success:false,
            message:'user role is not matching.'
        })
    }
}

exports.isAdmin= (req, res, next)=>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for admin."
            })
        }

        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'user role is not matching.'
        })
    }
}