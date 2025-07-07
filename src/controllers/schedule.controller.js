import { ApiResponse } from "../utils/ApiResponse.js";
import pool from "../config/db.js";

export const syncSchedule = async (req, res) => {
    const userId = req.user[0][0].id;

    const schedules = req.body; // we meant it as an array of subject which is an object of {code,name, teacher}
    await pool.query("DELETE FROM schedule WHERE userid = ?",[userId])
    try {
        for (const schedule of schedules) {
            const { day, subject_code, start_time, end_time } = schedule;

            if (!subject_code) continue;


            await pool.query(
                `INSERT INTO schedule (userid ,subject_code, day, start_time, end_time) 
           VALUES (?, ?, ?, ?, ? )`,
                [userId, subject_code, day, start_time, end_time]
            );
    
        }

        return res.status(201).json(
            new ApiResponse(201, "Schedule synced successFully")
        );
    } catch (e) {
        console.error(e.message);
        return res.status(500).json(
            new ApiResponse(500, "Failed to sync schedule")
        )
    }
}

export const getSchedulefromDB = async (req, res) => {
    const userId = req.user[0][0].id;
    try {

        const schedules = await pool.query("SELECT * from schedule WHERE userid=?", [userId]);
      

        const filteredSchedule = schedules[0].map(({ id, userid,...rest }) => rest);

        return res.status(201).json(
            new ApiResponse(201, filteredSchedule, "Schedule fetched successfully")
        )
    } catch (e) {
        console.error(e.message);
        return res.status(500).json(
            new ApiResponse(500, "Failed to fetch schedule")
        )
    }
}