const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = async function () {
  const db = config.db;
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    winston.info(`Connected to ${db}...`);
  } catch (error) {
    winston.error("Error connecting to the database:", error);
  }
};
