const fs = require("fs");


if (fs.existsSync("./package.json")) {
  console.log("ok");
}
