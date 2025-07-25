import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token:{
        type: String,
        default: null,
    }
},
{timestamps: true});



userSchema.pre("save",async function (next){
     if(!this.isModified('password')) return next();

     this.password=await bcrypt.hash(this.password,10);
     next() ;
})

userSchema.methods.isCorrectPassword=async function (password){
     return await bcrypt.compare(password,this.password);
}

// json web tokens
userSchema.methods.generateToken=function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.name,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    )
}

const User = mongoose.model("User", userSchema);
export default User;