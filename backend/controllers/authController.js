import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/database.js";

export function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;

  db.run(query, [name, email, hashedPassword], function (error) {
    if (error) {
      return res.status(400).json({
        message: "User already exists or invalid details"
      });
    }

    return res.status(201).json({
      message: "User registered successfully",
      userId: this.lastID
    });
  });
}

export function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], (error, user) => {
    if (error || !user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
}

export function getProfile(req, res) {
  return res.json({
    message: "Profile fetched successfully",
    user: req.user
  });
}