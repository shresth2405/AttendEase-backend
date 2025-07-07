import jwt  from "jsonwebtoken";
import pool from '../config/db.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};


export const saveAccessTokenToDB = async (userId, token) => {
  await pool.query('UPDATE users SET access_token = ? WHERE id = ?', [token, userId]);
};

export const deleteAccessTokenFromDB = async (userId) => {
  console.log(userId);
  await pool.query('UPDATE users SET access_token = NULL WHERE id = ?', [userId]);
};