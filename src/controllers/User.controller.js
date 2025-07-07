import pool from '../config/db.js'
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { deleteAccessTokenFromDB, generateAccessToken, saveAccessTokenToDB } from '../utils/TokenGeneration.js';



export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name);
    const Existing = await pool.query("SELECT * from users WHERE email=?", [email]);
    // console.log(Existing)
    if (Existing[0].length > 0) {
        throw new ApiError(400, "User already exist");
    }
    // console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users(name, email, password) VALUES(?,?,?)', [name, email, hashedPassword])
    return res.status(201).json(
        new ApiResponse(201, "User Registered SuccessFully")
    );
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Password and Email must be filled")
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    // console.log(users);
    if (users.length === 0) {
        throw new ApiError(400, "Invalid Credentials");
    }
    const user = users[0];
    // console.log(user)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(400, "Wrong Password");
    }
    const token = generateAccessToken({ id: user.id, email: user.email })
    const option = {
        httpOnly: true,
        secure: true
    }
    await saveAccessTokenToDB(user.id, token);
    return res.status(201)
        .cookie("token", token, option)
        .json(
            new ApiResponse(201, "User logged in succesfully")
        )

}

export const logoutUser = async(req, res)=>{
    const user = await req.user;
    // console.log(user[0]);
    if(user[0].length===0){
        throw new ApiError(400, "User not logged in");
    }
    await deleteAccessTokenFromDB(user[0][0].id);

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(201)
    .clearCookie("token",option)
    .json(
        new ApiResponse(201, "User logged out sucessfully")
    )

}

