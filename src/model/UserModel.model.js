import pool from '../config/db.js';

export const saveUser = async (name, email, hashedPassword, accessToken) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, access_token) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, accessToken]
  );
  return result;
};
