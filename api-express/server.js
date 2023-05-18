const express = require("express");
const Redis = require("ioredis");

const client = new Redis({
  host: "redis",
  port: 6379,
});

client.on("connect", () => {
  console.log("Połączono z serwerem Redis");
});

client.on("error", (err) => {
  console.error("Błąd połączenia z Redis:", err);
});

const app = express();
app.use(express.json());

app.post("/messages", async (req, res) => {
  const { message } = req.body;
  await client.rpush("messages", message);
  res.status(201).send("ok");
});

app.get("/messages", async (req, res) => {
  const messages = await client.lrange("messages", 0, -1);
  res.status(200).send(messages);
});

// Uruchomienie serwera na porcie 3000
app.listen(3000, () => {
  console.log("Serwer nasłuchuje na porcie 3000");
});
