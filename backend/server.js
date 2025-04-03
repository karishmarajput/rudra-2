const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(bodyParser.json());


const SECRET_KEY = "your_super_secret_key"; // Replace with a strong secret key

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token with user info
    const authToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name }, 
      SECRET_KEY,                                          
      { expiresIn: "1h" }                                  
    );

    res.status(200).json({ authToken });
  } catch (error) {
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user in the database
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Generate a JWT token
    const authToken = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Respond with the token
    res.status(201).json({ authToken });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No account found with that email." });
    }

    const user = result.rows[0];

    // Generate a reset token (valid for 15 minutes)
    const resetToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "15m" });

    // Send the token to the user's email
    const transporter = nodemailer.createTransport({
      service: "Outlook", // Replace with your email provider
      auth: {
        user: "rudra12312341@outlook.com",
        pass: "fxtfagzwhkpgubqn",
      },
    });

    const mailOptions = {
      from: "rudra12312341@outlook.com",
      to: email,
      subject: "Password Reset Request",
      text: `Please use the following link to reset your password:\n\nhttp://localhost:3000/reset-password?token=${resetToken}\n\nThis link will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, decoded.id]);

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
