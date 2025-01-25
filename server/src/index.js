import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Importing the Routes
import authRoutes from "./routes/auth.route.js";

// Routing the requests
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at: ${PORT}`);
  connectDB();
});
