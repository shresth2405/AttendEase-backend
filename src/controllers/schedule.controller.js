import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../config/db.js";

export const syncSchedule = async (req, res) => {
  const userId = req.user[0][0].id;
  const schedules = req.body;

  try {
    // Delete previous schedules
    await sql`DELETE FROM schedule WHERE userid = ${userId}`;

    for (const schedule of schedules) {
      const { day, subject_code, start_time, end_time } = schedule;
      if (!subject_code) continue;

      await sql`
        INSERT INTO schedule (userid, subject_code, day, start_time, end_time)
        VALUES (${userId}, ${subject_code}, ${day}, ${start_time}, ${end_time})
      `;
    }

    return res.status(201).json(
      new ApiResponse(201, "Schedule synced successfully")
    );
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(
      new ApiResponse(500, "Failed to sync schedule")
    );
  }
};

export const getSchedulefromDB = async (req, res) => {
  const userId = req.user[0][0].id;

  try {
    const records = await sql`
      SELECT day, subject_code, start_time, end_time, created_at
      FROM schedule
      WHERE userid = ${userId}
    `;

    return res.status(201).json(
      new ApiResponse(201, records, "Schedule fetched successfully")
    );
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(
      new ApiResponse(500, "Failed to fetch schedule")
    );
  }
};
