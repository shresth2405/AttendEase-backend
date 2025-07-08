import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../config/db.js";

export const syncSubject = async (req, res) => {
  const userId = req.user[0][0].id;
  const subjects = req.body;

  try {
    for (const subject of subjects) {
      const { code, name, teacher, total_classes, total_present } = subject;
      if (!code) continue;

      const result = await sql`
        UPDATE subject
        SET name = ${name},
            teacher = ${teacher},
            total_classes = ${total_classes},
            total_present = ${total_present}
        WHERE code = ${code} AND userid = ${userId}
        RETURNING *
      `;

      if (result.length === 0) {
        await sql`
          INSERT INTO subject (userid, code, name, teacher, total_classes, total_present)
          VALUES (${userId}, ${code}, ${name}, ${teacher}, ${total_classes}, ${total_present})
        `;
      }
    }

    return res.status(201).json(
      new ApiResponse(201, "Subjects synced successfully")
    );
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(
      new ApiResponse(500, "Failed to sync subjects")
    );
  }
};

export const getSubjectsfromDB = async (req, res) => {
  const userId = req.user[0][0].id;

  try {
    const records = await sql`
      SELECT code, name, teacher, total_classes, total_present, created_at
      FROM subject
      WHERE userid = ${userId}
    `;

    return res.status(201).json(
      new ApiResponse(201, records, "Subjects fetched successfully")
    );
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(
      new ApiResponse(500, "Failed to fetch subjects")
    );
  }
};
