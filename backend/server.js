import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config.js";

const app = express();
app.use(express.json());

connectDB();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
