const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    passward:{
        type:String,
        required:true,
        
    },
    role:{
        type:String,
        enum:["Admin", "Student", "visiter"],
    }
})

module.exports= mongoose.model("user", userSchema);