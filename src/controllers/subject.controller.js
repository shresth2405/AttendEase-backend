import { ApiResponse } from "../utils/ApiResponse.js";
import pool from "../config/db.js";

export const syncSubject = async (req, res) => {
    // console.log(req.user);
    const userId = req.user[0][0].id;
    // console.log(userId);
    const subjects = req.body; // we meant it as an array of subject which is an object of {code,name, teacher}
    try {
        for (const subject of subjects) {
            const { code, name, teacher, total_classes, total_present } = subject;

            if (!code) continue;


            const [result] = await pool.query(
                `UPDATE subject 
         SET name = ?, teacher = ?, total_classes = ?, total_present = ? 
         WHERE code = ? AND  userid = ?`,
                [name, teacher, total_classes, total_present, code, userId]
            );


            if (result.affectedRows === 0) {
                await pool.query(
                    `INSERT INTO subject (userid,code, name, teacher, total_classes, total_present) 
           VALUES (?, ?, ?, ?, ?, ?)`,
                    [userId, code, name, teacher, total_classes, total_present]
                );
            }
        }

        return res.status(201).json(
            new ApiResponse(201, "Subjects synced successFully")
        );
    } catch (e) {
        console.error(e.message);
        return res.status(500).json(
            new ApiResponse(500, "Failed to sync subjects")
        )
    }
}

export const getSubjectsfromDB = async (req, res) => {
    const userId = req.user[0][0].id;
    try {

        const subjects = await pool.query("SELECT * from subject WHERE userid=?", [userId]);
        // console.log(subjects[0]);

        const filteredSubjects = subjects[0].map(({ id, userid,...rest }) => rest);

        // console.log(filteredSubjects);
        return res.status(201).json(
            new ApiResponse(201, filteredSubjects, "Subjects fetched successfully")
        )
    } catch (e) {
        console.error(e.message);
        return res.status(500).json(
            new ApiResponse(500, "Failed to fetch subjects")
        )
    }
}