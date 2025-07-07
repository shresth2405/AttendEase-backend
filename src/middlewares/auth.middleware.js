import { ApiError } from "../utils/ApiError.js";
import pool from "../config/db.js";
import jwt from "jsonwebtoken"


export const verifyJWT = async(req, _, next) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await pool.query("SELECT * FROM users where id = ?",[decodedToken.id])

        // console.log(user);
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
}