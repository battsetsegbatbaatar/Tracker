const express = require("express");
const cors = require("cors");
const { sql } = require("./db");

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

app.post("/users/", async (req, res) => {
  const body = res.body;
  const { carName, modal, year } = body;
  const data = await sql`INSERT INTO cars {brand, modal, year }
    VALUES (${carName}, ${modal}, ${year});
    `;
  res.send(data);
});
app.listen(PORT, () => {
  console.log("Application running at http://localhost:" + PORT);
});
