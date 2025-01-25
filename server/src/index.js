import express from "express";

const app = express();
const PORT = 5000;

// Importing the Routes
import authRoutes from "./routes/auth.route";

// Routing the requests
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at: ${PORT}`);
});
