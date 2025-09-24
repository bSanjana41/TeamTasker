import jwt from "jsonwebtoken"

export const generateJwtToken=(payload,expiresIn="1h")=>{
    return jwt.sign(payload,process.env.JWT_SECRET)
}

export const verifyJwtToken=(token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}