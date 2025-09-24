import { generateJwtToken } from "../utils/jwt.js";
import User from "../models/userSchema.js"

export const signup=async({name,email,password})=>{
const existingUser= await User.findOne({email})
if (existingUser) throw new Error("Email already registered")

    const user= await User.create({name,email,password})
    return user
}

export const login= async({email,password})=>{
    const user=await User.findOne({email})
    if (!user) throw new Error("Invalid Credentials")

        const isMatch=await user.verifyPassword(password)
        if(!isMatch) throw new Error ("Invalid credentials")
const jwtToken = generateJwtToken({ id: user._id, name: user.name, email: user.email });

            return {user,jwtToken}
}