/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// import AppError from "../../errorHelpers/AppError";



// Create User
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("fake error")
//     // throw new AppError(httpStatus.BAD_REQUEST, "fake error")

//     const user = await UserServices.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User created successfully",
//       user,
//     });
//   } catch (error: any) {
//     // console.log(error);
//     next(error);
//   }
// };
const createUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  
  const user = await UserServices.createUser(req.body)

  // res.status(httpStatus.CREATED).json({
  //   message:"User created successfully",
  //   user
  // })
  sendResponse(res, {
    statusCode:httpStatus.CREATED,
    message:"user created successfully",
    data:user,
    success:true
    
  })
})

// get all users
// const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await UserServices.getAllUsers();
//     res.status(httpStatus.OK).json({
//       message: "All users recive",
//       users
//     })
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
const getAllUsers = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  const result = await UserServices.getAllUsers()

  // res.status(httpStatus.OK).json({
  //   Success:true,
  //   message:"All user recive success",
  //   data : users
  // })
  sendResponse(res, {
    success:true,
    statusCode:httpStatus.OK,
    message:"All users retrived succesfully",
    data:result.date,
    meta:result.meta

  })
})

// update user
const updateUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  const userId = req.params.id
  // const token = req.headers.authorization
  // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

  const verifiedToken = req.user;

  const payload = req.body
  const user = await UserServices.updatedUser(userId, payload, verifiedToken)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User updated successfully",
    data: user
  })
})

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser
};
