import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken";
import { IUser } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";


const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }

  // Json web Token
  // const jwtPayload = {
  //     userId : isUserExist._id,
  //     email : isUserExist.email,
  //     role : isUserExist.role
  // }
  // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRE)
  //   const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRE)

  const userTokens = createUserToken(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

// generate new accessToken
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

  return {
    accessToken : newAccessToken
  };
};


// Reset Password
const resetPassword = async (oldPassword:string, newPassword:string, decodedToken: JwtPayload) => {

  const user =await User.findById(decodedToken.userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
 
  console.log(user.password, "password");
  

  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string)
  console.log(isOldPasswordMatch , "oldpassword");
  

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your old password did not match")
  }

  user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALTROUND))

  user?.save()
  
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword
};
