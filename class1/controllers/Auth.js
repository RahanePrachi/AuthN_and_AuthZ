const bcrypt= require("bcrypt");
const User=require("../models/User");
const jwt= require("jsonwebtoken");
require("dotenv").config();

//sign up route handler
exports.signup= async (req, res)=>{
    try{
        //get data
        const {name, email, passward, role}=req.body;
        //check if user already exits
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                status:false,
                message:"user already exits"
            });
        }
        let hashedPassword;
        //secure password
        try{
            hashedPassword = await bcrypt.hash(passward, 10);
        }
        catch(err){
            
            return res.status(500).json({
                success:false, 
                message:"error in hashing password",
            })
        }

        //creat entry for user
        const user= await User.create({
            name, email, passward:hashedPassword, role
        })

        return res.status(200).json({
            success:true,
            message:"user created successfully",
            data:user,
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"user cannot be register please try later",
        })
    }
}


//login

exports.login= async(req, res)=>{
    try{
        //data fetch
        const {email, passward}=req.body;

        //validation on email and passward
        if(!email || !passward){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully.",
            });
        }

        //check user is avail or not
        let user= await User.findOne({email});
        //if not a register user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered."
            });
        }

        const payload= {
            email:user.email,
            id:user._id,
            role:user.role,
        }
        //verify passward and generate  a JWT token
        if(await bcrypt.compare(passward, user.passward)){
            //if passward match ->login karvan chahate hai- create jwt token
            //crete jwt token for that require instance before that install karn padega -> npm i jsonwebtoken and import

            const token =jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            })
            console.log(user);
            // user.token=token; => token and passward not display
            // const oldUser={...user, token};
            // oldUser.passward=undefined;
            // console.log(oldUser)  => working but maza nahi aa raha

            user=user.toObject();
            user.token=token;
            console.log(user);
        
            console.log(user);


            //user to email bhi mil gaya and password bhi -> ye to bevkhupi hai -because hacker to hack kar lega => for that user ke object me se password ko undefined kar to 
            user.passward = undefined; //password is removed form user object and not from db

            console.log(user);
            //creating a cookies
            const options={
                expires: new Date(Date.now() + 3* 24*60* 60*1000), //3 day valid
                httpOnly:true,

            }

            res.cookie("prachicookie", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'user logged in successfully.',
            });

            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:'user logged in successfully.',
            // });

        }
        else{
            //passward do not match
            return res.status(403).json({
                status:false,
                message:'passward incorrect',
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure",
        })
    }
}