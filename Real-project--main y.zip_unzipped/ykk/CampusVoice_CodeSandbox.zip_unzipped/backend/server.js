import express from "express";
import cors from "cors";
import db from "./database.js";
import complaintsRoute from "./routes/complaints.js";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/api", complaintsRoute);
// get all complaints
app.get("/api/complaints", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM complaints").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get complaint by id
app.get("/api/complaints/:id", (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare("SELECT * FROM complaints WHERE id = ?").get(id);

    if (!row) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// rate limit memory
const rateLimit = {};

const checkRate = (ip) => {
  const now = Date.now();
  if (rateLimit[ip] && now - rateLimit[ip] < 30000) return false;
  rateLimit[ip] = now;
  return true;
};

// Admin update status
app.patch("/api/admin/complaints/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    db.prepare("UPDATE complaints SET status = ? WHERE id = ?")
      .run(status, id);

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/logout", (_, res) => {
  res.json({ message: "Logged out" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
