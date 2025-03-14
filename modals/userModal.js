import mongoose from "mongoose";
const {model, Schema} = mongoose;

const userschema = Schema(

    {
        userName:{
            type:String,
            require:true
        },
        userEmail:{
            type: String,
            required: true
        },
        userPassword:{
            type: String,
            reqired: true
        },
        userRole:{
            type:String,
            default: "user",
            required:true,
            enum:["user", "admin"]
        },
        tokens:{
            accessToken:{type: String, default:" "}
        }
    }
)
const User = model("user", userschema);

export default User;


