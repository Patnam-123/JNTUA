import mongoose from "mongoose";

const testSchema=new mongoose.Schema({
    name:{
        unique:true,
        required:true,
        type:String,
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:60
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:5,
        max:30
    }
})

const Test=mongoose.model("Test", testSchema);
export default Test;