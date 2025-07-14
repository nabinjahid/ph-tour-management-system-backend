import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken"

export const generateToken = (paylaad: JwtPayload, secret: string, expiresIn:string)=>{

    const token = jwt.sign(paylaad, secret, {expiresIn} as SignOptions)

    return token
}

export const verifyToken = (token:string, secret:string)=>{
    
    const verifiedToken = jwt.verify(token, secret)

    return verifiedToken
}