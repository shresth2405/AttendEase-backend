import jwt from "jsonwebtoken";
import sql from '../config/db.js'; 

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

export const saveAccessTokenToDB = async (userId, token) => {
  await sql`
    UPDATE users
    SET access_token = ${token}
    WHERE id = ${userId}
  `;
};

export const deleteAccessTokenFromDB = async (userId) => {
  console.log(userId);
  await sql`
    UPDATE users
    SET access_token = NULL
    WHERE id = ${userId}
  `;
};
