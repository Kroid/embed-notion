require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { createAgent } = require("notionapi-agent");
const { getBlockValue } = require("./utils");
const { decrypt, encrypt } = require("./encryption");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.get("/", (req, res) => res.render("index"));

app.post("/", (req, res) => {
  let encrypted = encrypt(
    JSON.stringify({
      token: req.body.notionToken || process.env.NOTION_TOKEN,
      blockId: req.body.blockId,
    })
  );
  // console.log(encrypted);
  // let encoded = encoder.encode(encrypted);
  // let decoded = encoder.decode(encoded);
  // console.log(encoded == decoded);
  res.redirect(`/${req.body.lib}?q=${encrypted}`);
});

app.get("/:lib", async (req, res) => {
  try {
    let encrypted = req.query.q;
    // let encrypted = encoder.decode(encoded);
    console.log(encrypted);
    let decrypted = JSON.parse(decrypt(encrypted));
    console.log(decrypted);
    let notionToken = decrypted.token;
    let blockId = decrypted.blockId;

    const notionAgent = createAgent({
      token: notionToken,
    });

    let value = await getBlockValue(notionAgent, blockId);

    switch (req.params.lib) {
      case "mermaid":
        return res.render("mermaid", { value });
      default:
        return res.status(500).send("invalid lib");
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("500 Internal Server Error");
  }
});

module.exports = app;
