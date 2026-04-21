const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { sql, config } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ (Optional) Create a test user once
app.get("/api/create-test-user", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const email = "test@gmail.com";
    const password = "Test@123";

    const hash = await bcrypt.hash(password, 10);

    await pool.request()
      .input("Email", sql.NVarChar, email)
      .input("PasswordHash", sql.NVarChar, hash)
      .query("INSERT INTO Users (Email, PasswordHash) VALUES (@Email, @PasswordHash)");

    res.json({ message: "Test user created", email, password });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT TOP 1 * FROM Users WHERE Email = @Email");

    if (result.recordset.length === 0)
      return res.status(401).json({ error: "Invalid email or password." });

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });

    return res.json({ message: "Login successful ✅", userID: user.UserID });
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
