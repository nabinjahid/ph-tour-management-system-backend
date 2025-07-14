import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>)=>{

    const {email , password, ...rest} = payload;
    
   const isUserExist = await User.findOne({email})

   if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
   }

   const hashPasword = await bcryptjs.hash(password as string, 10)

   const authProvider : IAuthProvider = {provider: "credentials", providerId: email as string}

    const user = await User.create({
        
        email,
        password: hashPasword,
        auths:[authProvider],
        ...rest
    })
    return user
}

const updatedUser = async (userId: string, payload: Partial<IUser>, decodedToken:JwtPayload)=>{
    /**
     * emial - can not update
     * name phone password address
     * password --> rehashing
     * only admin superadmin --> role and is deleted
     * promoting to superadmin - superadmin
     */

    const ifUserExsist = await User.findById(userId);
    if (!ifUserExsist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    if(payload.role){
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");

    }
    if(payload.isActive || payload.isDeleted || payload.isVarified){
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }
    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALTROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})

    return newUpdatedUser
}

const getAllUsers = async () => {
    const users = await User.find({})
    const totalUsers = await User.countDocuments()
    return {
        date:users,
        meta:{
            total:totalUsers
        }
    }
}

export const UserServices = {
    createUser,
    getAllUsers,
    updatedUser
}