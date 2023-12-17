const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({ extended: false }));

// CORS
app.use(cors());

// ROUTES
app.use("/api/users", require("./routes/user.route"));
app.use("/api/timelogs", require("./routes/timelog.route"));
app.use("/api/goals", require("./routes/goal.route"));

app.get("/", (req, res) => {
  console.log("Hello world");
  return res.status(200).json({ message: "This is TimeOut! API" });
});

app.listen(PORT, () => console.log("This is listening on PORT: " + PORT));