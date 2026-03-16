import express from "express";
import db from "../database.js";

const router = express.Router();

router.post("/complaints", (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = db
      .prepare(
        `INSERT INTO complaints (title, description, category, location, status)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(title, description, category, location, "Submitted");

    res.json({
      id: result.lastInsertRowid
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;