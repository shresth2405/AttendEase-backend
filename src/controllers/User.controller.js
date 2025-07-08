import sql from '../config/db.js';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { deleteAccessTokenFromDB, generateAccessToken, saveAccessTokenToDB } from '../utils/TokenGeneration.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
//   console.log(name);
  const existing = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (existing.length > 0) {
    throw new ApiError(400, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
  `;

  return res.status(201).json(new ApiResponse(201, 'User Registered Successfully'));
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Password and Email must be filled');
  }

  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (users.length === 0) {
    throw new ApiError(400, 'Invalid Credentials');
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, 'Wrong Password');
  }

  const token = generateAccessToken({ id: user.id, email: user.email });
  const option = { httpOnly: true, secure: true };

  await saveAccessTokenToDB(user.id, token);
  return res
    .status(201)
    .cookie('token', token, option)
    .json(new ApiResponse(201, 'User logged in successfully'));
};

export const logoutUser = async (req, res) => {
  const user = req.user;
//   console.log(user);
  if (user.length === 0) {
    throw new ApiError(400, 'User not logged in');
  }

  await deleteAccessTokenFromDB(user[0].id);

  const option = { httpOnly: true, secure: true };

  return res.status(201).clearCookie('token', option).json(new ApiResponse(201, 'User logged out successfully'));
};
