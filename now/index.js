#!/usr/bin/env node
"use strict";

const fs = require("fs");
var toml = require("toml");
var data = toml.parse(fs.readFileSync("./socialgouv.toml", "utf-8"));
console.dir(data);

console.log("lol");
