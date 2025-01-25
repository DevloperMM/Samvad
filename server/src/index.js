import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

// Importing the Routes
import authRoutes from "./routes/auth.route.js";

// Routing the requests
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at: ${PORT}`);
  connectDB();
});
