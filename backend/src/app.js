const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api.routes");

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api", apiRoutes);

module.exports = app;