const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const errorHandler = require("./middleware/errorHandler");
const marksRoutes = require("./routes/marksRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analysis", analysisRoutes);
app.use(errorHandler);
app.use("/api/marks", marksRoutes);

app.get("/", (req, res) => {
  res.send("Student Performance Analysis System API");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/health", (req, res) => {
  res.json({
    status: "API running",
    timestamp: new Date()
  });
});


