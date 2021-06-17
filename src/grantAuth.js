require("dotenv").config();
const { spawnSync } = require("child_process");

const token = process.env.ACCESS_TOKEN;

if (!token || token === "accesstoken" || token === "<accesstoken>" || token === "&lt;accesstoken&gt;") {
  console.error("Please enter your access token in your .env file");
  return;
}

spawnSync(`graph auth https://api.thegraph.com/deploy/ ${process.env.ACCESS_TOKEN}`);
