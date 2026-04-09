const app = require("../src/app");
const { connect } = require("../src/config/db");

// Connect to MongoDB for the serverless function
connect();

module.exports = app;
