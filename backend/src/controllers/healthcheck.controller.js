import {ApiResponse } from '../utils/api-Response.js';

const healthCheck = (req, res) => {
    try {
        res.status(200).json(
            new ApiResponse(200, "Service is healthy and running", null));
    } catch (error) {
        
    };
}

export { healthCheck };