const sql = require("mssql");

const config = {
  user: "",                 // keep empty for Windows Auth
  password: "",             // keep empty for Windows Auth
  server: "localhost",
  database: "AuthDB",
  options: {
    trustServerCertificate: true,
  },
};

// ✅ Windows Authentication (recommended)
config.options.trustedConnection = true;

// If your instance is SQLEXPRESS:
// config.server = "localhost\\SQLEXPRESS";

module.exports = { sql, config };
