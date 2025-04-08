const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.NEXT_PUBLIC_Frontend_URL,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(bodyParser.json());
const SECRET_KEY = process.env.SECRET_KEY; 
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
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

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    const newUser = result.rows[0];
    const authToken = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(201).json({ authToken });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No account found with that email." });
    }
    const user = result.rows[0];
    const resetToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "15m" });
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Please use the following link to reset your password:\n\n${process.env.NEXT_PUBLIC_Frontend_URL}/reset-password?token=${resetToken}\n\nThis link will expire in 15 minutes.`,
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
    const decoded = jwt.verify(token, SECRET_KEY);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
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
