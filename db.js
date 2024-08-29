const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://username:password@cluster0.x4lmd.mongodb.net/sample_mflix",
  {}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = mongoose;
