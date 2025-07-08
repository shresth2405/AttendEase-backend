import { ApiError } from "../utils/ApiError.js";
import sql from "../config/db.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await sql`
      SELECT * FROM users WHERE id = ${decodedToken.id}
    `;

    if (user.length === 0) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;  // Keep structure same as before
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};
