const express = require("express");
const mongoose = require("mongoose");

const admin = require("./routes/admin");
const auth = require("./routes/auth");
const categories = require("./routes/categories");
const paintings = require("./routes/paintings");
const users = require("./routes/users");

const app = express();

app.use(express.json());

// connect to the mongo DB database
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/crafty-moon";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to the Database"))
  .catch(() => console.log("Error connecting to the DB"));

// register all the routes
app.use("/api/admins", admin);
app.use("/api/auth", auth);
app.use("/api/categories", categories);
app.use("/api/paintings", paintings);
app.use("/api/users", users);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
