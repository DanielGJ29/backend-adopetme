const express = require("express");
const cors = require("cors");
const morga = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

//Controllers
const { globalErrorHandler } = require("./apiServices/error/error.controller");

//Routers
const { routes } = require("./routes/index");

const app = express();

//Midlewares
app.use(express.json());

//Enable multipart/form-data incoming data (to receive files)
app.use(express.urlencoded({ extended: true }));

//Enable cors
app.use("*", cors());

//Limit the time
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    message: "Too many requests from your IP, Try after an hour",
  })
);

//  Compress response on the brouser
app.use(compression());

//Set more security headers
app.use(helmet());

//Log incoming request to the server
app.use(morga("dev"));

app.use("/api/v1", require("./routes/index"));

app.use(globalErrorHandler);

module.exports = { app };
