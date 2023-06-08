var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var cors = require("cors");
var path = require("path");
const expressip = require("express-ip");
const dotenv = require("dotenv");

let envPath = '.env.dev';

if(process.env.NODE_ENV) envPath = `.env.${process.env.NODE_ENV}`

console.log(envPath);

dotenv.config({
  path: envPath,
}); 


var indexRouter = require("./Routes/indexRouter");
var authRouter = require("./Routes/authRouter");
var patientRouter = require("./Routes/patientRouter");
var doctorRouter = require("./Routes/doctorRouter");

var app = express();
app.use(morgan("dev"));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/assets", express.static(path.join(__dirname, "frontend/assets")));

var db = require("./Database/mongoConn");

// console.log(db.user.getIndexes());

app.use(expressip().getIpInfoMiddleware);

// app.get('/',async function(req,res){
//     res.redirect('/patient/home')
// })

app.use(
  "/doctors",
  function (req, res, next) {
    req.customCallerTypeV3 = "DOCTOR";
    next();
  },
  require("./Routes/pages.route")
);
app.use(
  "/clinics",
  function (req, res, next) {
    req.customCallerTypeV3 = "CLINIC";
    next();
  },
  require("./Routes/pages.route")
);
app.use(
  "/treatments",
  function (req, res, next) {
    req.customCallerTypeV3 = "DELETEME";
    next();
  },
  require("./Routes/treatment.pages.route")
);
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/patient", patientRouter);
app.use("/doctor", doctorRouter);

app.use("/apis/v1/search", require("./Controllers/user.controller"));
app.use("/apis/v1/timeSlots", require("./Controllers/timeSlot.controller"));
app.use(
  "/apis/v1/appointments",
  require("./Controllers/appointment.controller")
);
app.use("/apis/v1/common", require("./Routes/common.route"));

//food distribution
app.use("/karona", require("./Controllers/fd.controller"));

//v2 apis
app.use("/apis/v2/website", require("./Routes/v2_routes/index.router"));
//error handler need to be the last one
app.use(require("./helpers/errorHandler"));

let port = process.env.PORT;
// if(process.env.NODE_ENV==='prod'){
//     port=8002
// }else{
//     port=8003
// }
app.listen(port, function () {
  console.log("App started in environment::" + process.env.NODE_ENV);
  console.log("Express server listening on port " + port);
});

// require('./seederNchanges/user.mana')
