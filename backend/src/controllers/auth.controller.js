import {User} from '../models/user.model.js';
import {ApiResponse} from '../utils/api-response.js';
import {ApiError} from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendEmail, emailVerificationMailgenContent } from '../utils/mail.js';
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    } catch (error) {
        console.error("TOKEN ERROR 👉", error);
        throw new ApiError(500, 'something went wrong while generating access token', []);
    }
}    

const registerUser = asyncHandler(async (req, res, next) =>{
    const {username, email, password, role} = req.body

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
       throw new ApiError(409, 'Username with email already exists',[])
    }


    const user = await User.create({username, email, password, isEmailVerified: false})

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user?.email,
        subject: 'please verify your email',
        mailgenContent: emailVerificationMailgenContent(
            user?.username, 
            `{req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`
        ),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if(!createdUser){
        throw new ApiError(500, 'something went wrong while creating user', [])
    }

    return res.status(201).json(new ApiResponse(201,{user : createdUser}, 'user registered successfully and email verification sent on your email', createdUser));
});

const login = asyncHandler(async(req,res) => {
    const {email, password, username} = req.body;

    if(!username || !email){
        throw new ApiError(400, 'please provide username or email to login', []);
    }
    const user = await User.findOne({ email})

    if(!user){
        throw new ApiError(400, 'user does not exists', []);
    }

    const isPasswordValid  = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, 'invalid credentials', []);
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(
        200,
        {
            user: loggedInUser,
            accessToken,
            refreshToken
        },"user logged in successfully"
    ))

});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export {registerUser, login, logoutUser};