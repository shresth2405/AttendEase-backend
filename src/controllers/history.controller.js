import { ApiResponse } from "../utils/ApiResponse.js";
import pool from "../config/db.js";

export const syncHistory = async (req, res) => {
    const userId = req.user[0][0].id;

    const history = req.body; // we meant it as an array of subject which is an object of {code,name, teacher}
    try {
        for (const record of history) {
            const { subject_code, date, status } = record;

            if (!subject_code) continue;


            await pool.query(
                `INSERT INTO history (userid ,subject_code, date, status) 
           VALUES (?, ?, ?, ? )`,
                [userId, subject_code, date, status]
            );
    
        }

        return res.status(201).json(
            new ApiResponse(201, "History synced successFully")
        );
    } catch (e) {
        console.error(e.message);
        return res.status(500).json(
            new ApiResponse(500, "Failed to sync History")
        )
    }
}

export const getHistoryfromDB = async (req, res) => {
    const userId = req.user[0][0].id;
    try {

        const records = await pool.query("SELECT * from history WHERE userid=?", [userId]);
      

        const filteredrecords = records[0].map(({ id, userid,...rest }) => rest);

        return res.status(201).json(
            new ApiResponse(201, filteredrecords, "History fetched successfully")
        )
    } catch (e) {
        console.error(e.message);
        return res.status(500).json(
            new ApiResponse(500, "Failed to fetch history")
        )
    }
}