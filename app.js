require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const controller = require("./controller");
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW);
  next();
});

app.get("/:name", controller.searchComp);

//Global handler

app.all("*", (req, res, next) => {
  return next(new Error("root not exists"));
});

app.use(controller.handelGlobalError);

app.listen(process.env.PORT, () => console.log("server Starts"));
