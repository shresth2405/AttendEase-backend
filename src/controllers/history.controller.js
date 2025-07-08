import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../config/db.js";

export const syncHistory = async (req, res) => {
  const userId = req.user[0].id;
  const history = req.body;

  try {
    for (const record of history) {
      const { subject_code, date, status } = record;
      if (!subject_code) continue;

      await sql`
        INSERT INTO history (userid, subject_code, date, status)
        VALUES (${userId}, ${subject_code}, ${date}, ${status})
      `;
    }

    return res.status(201).json(new ApiResponse(201, "History synced successfully"));
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(new ApiResponse(500, "Failed to sync history"));
  }
};

export const getHistoryfromDB = async (req, res) => {
  const userId = req.user[0].id;

  try {
    const records = await sql`
      SELECT subject_code, date, status, created_at
      FROM history
      WHERE userid = ${userId}
    `;

    return res.status(201).json(new ApiResponse(201, records, "History fetched successfully"));
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(new ApiResponse(500, "Failed to fetch history"));
  }
};
