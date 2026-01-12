import {ApiResponse } from '../utils/api-Response.js';
import { asyncHandler } from '../utils/async-handler.js';

// const healthCheck = async (req, res, next) => {
//     try {
//         const user = await getUserFromDB()
//         res.status(200)
//         .json(new ApiResponse(200, {message : "Service is healthy and running"}));
//     } catch (error) {
//         next(err);
//     };
// }

const healthCheck = asyncHandler(async (req, res, next) => {
    res.status(200)
    .json(new ApiResponse(200, {message : "Service is healthy and running"}));
});


export { healthCheck };