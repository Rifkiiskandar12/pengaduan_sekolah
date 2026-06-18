require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");

const authRoutes = require("./routes/authRoutes");
const pengaduanRoutes = require("./routes/pengaduanRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pengaduan", pengaduanRoutes);

app.use(errorHandler);

module.exports = app;