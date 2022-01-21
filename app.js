const express = require("express");
const ShortUrl = require("./shortUrl");
const cors = require("cors");
var mongo = require("./connection");
const shortId = require("shortid");

const app = express();
app.use(cors());
mongo.connect();
app.use(express.json());

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.send(shortUrls);
});

app.post("/shortUrls", async (req, res) => {
  const code = shortId.generate();
  await ShortUrl.create({
    key: code,
    full: req.body.fullUrl,
    short: "http://localhost:5000/" + code,
  });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ key: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
