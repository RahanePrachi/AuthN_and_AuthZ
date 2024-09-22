const express=require("express");
const router= express.Router();
const User=require("../models/User");

//importing routes

const {login, signup}=require("../controllers/Auth");
const {auth, isStudent, isAdmin}=require("../middleware/auth");
router.post("/login", login);
router.post("/signup", signup);

//testing route
router.get("/test", auth, (req, res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route for Test."
    })
})
//protected route
router.get("/student", auth, isStudent, (req, res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route for student."
    })
})

router.get("/admin", auth, isAdmin, (req, res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route for admin."
    })
})

router.get("/getEmail", auth, async(req, res)=>{
    try{
        const id= req.user.id;
        const user= await User.findById({id});
        res.status(200).json({
            success:true,
            user:user,
            message:"welcome to the user route.",
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"fatt gya code.",
        })
    }
    
})
module.exports=router;