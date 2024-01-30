const express = require("express");
const cors = require("cors");
const { sql } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 8080;
const secretKey = process.env.SECRET_KEY;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.get("/neon", async (req, res) => {
  const data = await sql`SELECT * FROM playing_with_neon`;
  res.send(data);
});

app.get("/signup", async (req, res) => {
  const data = await sql`SELECT *FROM users`;
  res.send(data);
});
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    const findUsers = await sql`SELECT email FROM users WHERE email=${email}`;

    if (findUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    // validator hiih
    if (!name || !password || !email) {
      return res
        .status(400)
        .send("Invalid input. Name, password, and email are required");
    }
    // bycrigt
    const encryptedPassword = await bcrypt.hash(password, 10);

    const data =
      await sql`INSERT INTO users (name,email,password,avatarImg,createdAt,updatedAt)
    VALUES (${name}, ${email}, ${encryptedPassword},'img',${new Date()},${new Date()});
    `;
    // res.send(data);
    res.status(201).send({ message: "Successfully created" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error" + " bolkun bn");
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }
    const userData = await sql`SELECT * FROM users WHERE email = ${email}`;
    console.log(userData);

    if (!userData || !userData.length) {
      return res.status(401).send("Invalid email or password");
    }
    if (userData.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const hashedPassword = userData[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password");
    }
    // generate token
    const token = jwt.sign({ userId: userData[0].id }, secretKey, {
      expiresIn: "10h",
    });

    // Handle successful login
    // res.status(201).send("Login successful", token);
    // res.send(userData);
    res.status(201).json({ message: "success login" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("user sign in failed");
  }
});

app.listen(PORT);
console.log("Application running at http://localhost:" + PORT);
