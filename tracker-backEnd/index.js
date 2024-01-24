const express = require("express");
const cors = require("cors");
const { sql } = require("./db");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.get("/neon", async (req, res) => {
  const data = await sql`SELECT * FROM playing_with_neon`;
  res.send(data);
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    // validator hiih
    if (!name || !password || !email) {
      return res.status(400).send("Fields are required");
    }
    // bycrigt
    const encryptedPassword = await bcrypt.hash(password, 18);

    const data =
      await sql`INSERT INTO users (name,email,password,avatarImg,createAt,updateAt)
    VALUES (${name}, ${email}, ${encryptedPassword},"",${date},${date});
    `;
    res.send(data);
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const userData = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (!userData || !userData.length) {
      return res.status(401).send("Invalid email or password");
    }

    const hashedPassword = userData[0].password;

    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Handle successful login
    res.send("Login successful");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log("Application running at http://localhost:" + PORT);
});
