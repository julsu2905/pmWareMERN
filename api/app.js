var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const session = require("express-session");
const apiRouter = require("./routes/apis");
const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.enable("trust proxy");
app.use(express.static(path.join(__dirname, "../client/build")));

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(mongoSanitize());
app.use(xss());

app.use(cors());
app.options("*", cors());

//ROUTES
app.use("/api", apiRouter);
app.get("*", (req, res) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// error handler

app.use(globalErrorHandler);

module.exports = app;
