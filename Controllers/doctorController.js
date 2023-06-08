const path = require("path");
var multer = require("multer");
var tinified = require("tinify");
const request = require("request-promise");
var cloudinary = require("cloudinary");
var _ = require("underscore");

var keys = require("../Config/keys");
var User = require("../Models/User");
const Appointments = require("../Models/Appointments");

cloudinary.config({
  cloud_name: keys.cloudinaryCloudName,
  api_key: keys.cloudinaryApiKey,
  api_secret: keys.cloudinaryApiSecret,
});
var msg91Key = keys.msg91key;
tinified.key = keys.tinifyKey;

var imageMimeType = ["image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).array("profileImage", 5);

var { DoctorStatus, DocCategories } = require("../Config/statuses");

var http = require("https");
const SendOtp = require("sendotp");
const sendOtp = new SendOtp(msg91Key);

var Doc = {
  // https://control.msg91.com/api/sendotp.php?otp=$otp&sender=$senderid&message=Your\tverification\tcode\tis\t##OTP##&mobile=9082129961&authkey=297047A6xLaSwM25d9614b0
  generateOtp: async function (req, res) {
    var number = req.body.number;

    sendOtp.send("91" + number, "velaar", function (err, data) {
      if (err) {
        console.log("error" + err);
        res.json({
          message: "Error generating Otp, Please try again later",
          success: false,
        });
      } else {
        console.log("message sent successfully" + JSON.stringify(data));
        res.json({
          message: "Otp sent successfully",
          success: true,
        });
      }
    });
  },

  verifyOtp: async function (req, res, next) {
    var otp = req.body.otp;
    var number = req.body.number;
    var docFound = req.body.docFound ? req.body.docFound : null;

    console.log("docFound ", JSON.stringify(docFound));

    sendOtp.verify("91" + number, otp, async function (error, data) {
      console.log(data); // data object with keys 'message' and 'type'
      if (data.type == "success") {
        try {
          res.locals.doctor = docFound;
          res.JSON({
            success: true,
            message: "otp verified",
            // user : ,
          });
        } catch (error) {
          //change this later
          res.json({
            message: "otp not verified",
            success: false,
          });
        }
      }
      if (data.type == "error")
        res.json({
          message: "Error",
          success: false,
        });
    });
  },

  register: async function (req, res, next) {
    try {
      console.log("register body  ", req.body);

      var doc = req.body.doctor;
      var now = new Date();
      doc.status = DoctorStatus.Registered;

      doc.registeredOn = now.getTime();
      var clinics = [];

      if (req.body.category === DocCategories.CLINIC) {
        doc.role = DocCategories.CLINIC;
        var clres = await User.create(req.body.clinic);
        doc.clinic = req.body.clinic;

        res.locals.clinic = req.body.clinic;
        clinics.push(clres._id);
      } else {
        doc.role = DocCategories.DOCTOR;
      }
      doc.clinics = clinics;

      var result = await User.create(doc);

      console.log("doc registered ", result);

      res.locals.doctor = result;

      next();
    } catch (error) {
      console.log("err", error);

      res.send({
        success: false,
        msg: error,
      });
    }
  },

  sendSms: async function (req, res, next) {
    try {
      var id = res.locals.doctor._id;
      console.log(id);

      var message = `Click on the link to confirm your register http://www.profile.domain.com/on_boarding.html?id=${id}`;
      var number = res.locals.doctor.number;
      var options = {
        url: "https://api.msg91.com/api/v2/sendsms?country=91",
        body: {
          sender: "SOCKET",
          route: "4",
          country: "91",
          sms: [
            {
              message: message,
              to: [number],
            },
          ],
        },
        json: true,
        headers: {
          authkey: msg91Key,
          "content-type": "application/json",
        },
      };

      var response = await request.post(options);

      console.log("res ", response);
      res.json({
        doctor: res.locals.doctor,
        success: true,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  },

  resendOtp: async function (req, res) {
    var number = req.body.number;
    sendOtp.retry("91" + number, false, function (error, data) {
      console.log(data);
      res.json({
        data,
      });
    });
  },

  login: async function (req, res, next) {
    try {
      var number = req.body.number;

      var doc = await User.findOne({
        number: number,
      });

      if (!doc) throw new Error("Doctor not Found");

      console.log("doc found ", doc);

      res.locals.doctor = doc;

      next();
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  },
  updateDoctor: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body._id;

      if (id) {
        //update document

        updateString = body;
        delete updateString["id"];

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await User.updateMany(
          {
            _id: Object(id),
          },
          {
            $set: updateString,
          }
        );
      } else {
        // create new document
        console.log("inside create new document");

        var result = await User.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
        data: result,
        doc: body,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },

  updateClinic: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body._id;

      if (id) {
        //update document

        updateString = body;
        delete updateString["id"];

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await User.updateMany(
          {
            _id: Object(id),
          },
          {
            $set: updateString,
          }
        );
      } else {
        // create new document
        console.log("inside create new document");

        var result = await User.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
        data: result,
        clinic: body,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
  uploadFile: async function (req, res) {
    try {
      allFiles = [];
      url2 = req.protocol + "://" + req.get("host");

      // var i = productImage
      // console.log("i:"+i)
      // await upload.single('productImage')
      // console.log("u:"+u)

      console.log(req.files);
      await upload(req, res, async function (err) {
        try {
          console.log("pathOfFile1:", JSON.stringify(req.file));
          console.log("pathOfFile", JSON.stringify(req.files));

          if (err) {
            console.log("upload err ", err);
            throw err;
          } else {
            for (i = 0; i < req.files.length; i++) {
              if (_.contains(imageMimeType, req.files[i].mimetype)) {
                var source = tinified.fromFile(req.files[i].path);
                source.toFile(req.files[i].path);
              }

              allFiles[i] = await cloudinaryUpload(req.files[i]);
            }
            res.json({
              success: true,
              message: "File Uploaded",
              link: allFiles,
            });
          }
        } catch (err) {
          res.json({
            success: false,
            message: err.message,
          });
        }
      });

      // console.log("file:"+req.file);`
    } catch (err) {
      res.json({
        success: false,
        message: err.message,
      });
    }
  },
  checkNo: async function (req, res) {
    try {
      var number = req.body.number;

      var no = await User.findOne({
        number: number,
      }).lean();
      console.log("number:" + no);
      if (!no) {
        res.json({
          success: true,
        });
      } else {
        res.json({
          success: false,
          message: "Number already registered, Please Login to continue",
        });
      }
    } catch (err) {
      // res.json({
      //     success:false,
      //     message:"Number already registered, Please register with another number"
      // })
    }
  },
  getDoctor: async function (req, res) {
    console.log(req.body);

    try {
      var result = await User.findOne({
        _id: Object(req.body.id),
      }).lean();

      if (result.clinics)
        if (result.clinics.length > 0) {
          let clinics = await User.find({
            _id: {
              $in: [...new Set(result.clinics)],
            },
            visible: 1,
          });
          res.clinics_found = clinics;
          result.clinics = clinics;

          // result.Clinics = [...new Set(result.Clinics)]
          // await asyncForEach(result.doctors, async (id) => {

          //     var user = await User.findOne({
          //         _id: Object(id)
          //     }).lean();
          //     if (user.visible != 0) {
          //         if (!inserted.includes(user._id)) {
          //             inserted.push(user._id)
          //             allDoctors.push(user);
          //         }
          //     }
          // });
          // result.doctors = inserted;
          // console.log('res', allDoctors);
        }

      // var allClinics = [];
      // if (result.clinics.length > 0) {
      //     await asyncForEach(result.clinics, async (id) => {
      //
      //         var clinic = await User.findOne({
      //             _id: Object(id)
      //         }).lean();
      //
      //         allClinics.push(clinic);
      //     });
      //     console.log('res', allClinics);
      // }
      if (Array.isArray(result.title) && result.title.length > 0) {
        let similar = await User.find(
          User.find({
            _id: {
              $ne: req.body.id,
            },
            title: {
              $in: result.title,
            },
            status: "Verified",
            visible: 1,
            role: "DOCTOR",
          })
        )
          .select(
            "name status fee photo gender title specialization clinics experience_years address"
          )
          .limit(15);
        result.similarDocs = similar;
      }
      res.send({
        success: true,
        data: result,
        clinics: [],
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },

  getClinic: async function (req, res) {
    console.log(req.body);

    try {
      var result = await User.findOne({
        _id: Object(req.body.id),
      });
      console.log("res", result);
      // var allDoctors = [];
      // if (result.doctors.length > 0) {
      //     await asyncForEach(result.doctors, async (id) => {

      //         var clinic = await User.findOne({
      //             _id: Object(id)
      //         }).lean();

      //         allDoctors.push(clinic);
      //     });
      //     console.log('res', allDoctors);
      // }
      if (result.doctors)
        if (result.doctors.length > 0) {
          let doctors = await User.find({
            _id: {
              $in: [...new Set(result.doctors)],
            },
            visible: 1,
          });
          // res.doctors_found = doctors;
          result.doctors = doctors;
          // result.doctors = [...new Set(result.doctors)]
          // await asyncForEach(result.doctors, async (id) => {

          //     var user = await User.findOne({
          //         _id: Object(id)
          //     }).lean();
          //     if (user.visible != 0) {
          //         if (!inserted.includes(user._id)) {
          //             inserted.push(user._id)
          //             allDoctors.push(user);
          //         }
          //     }
          // });
          // result.doctors = inserted;
          // console.log('res', allDoctors);
        }
      if (Array.isArray(result.services) && result.services.length > 0) {
        let nameArr = result.services.map((c) => c.name);
        console.log(nameArr);
        let similar = await User.find(
          User.find({
            _id: {
              $ne: req.body.id,
            },
            "services.name": {
              $in: nameArr,
            },
            status: "Verified",
            visible: 1,
            role: "CLINIC",
          })
        )
          .select(
            "name status services fee photo profile_photo doctors gender title specialization clinics experience_years address"
          )
          .limit(15);
        result.similarClinics = similar;
      }
      res.send({
        success: true,
        data: result,
        doctors: [],
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },

  myAppointments: async function (req, res) {
    var pageSize = 25;
    var pageNo = req.body.pageNo;
    var status = req.body.status;
    var type = req.body.type;

    if (!res.locals.id) throw new Error("Something went wrong");

    var findString = {};

    findString["doctor"] = res.locals.id;
    findString["docId"] = res.locals.id;

    if (status) findString["status"] = status;

    try {
      if (type === "NEW") {
        //only todays and future appointments

        var start = new Date();
        start.setHours(0, 0, 0, 0);

        findString["registeredOn"] = {
          $gte: start.getTime(),
        };
      } else if (type === "UPCOMING") {
        // only future appointments

        var end = new Date();
        end.setHours(23, 59, 59, 999);

        findString["registeredOn"] = {
          $gte: end.getTime(),
        };
      } else if (type === "PAST") {
        //only past appointments
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        findString["registeredOn"] = {
          $lte: start.getTime(),
        };
      }

      console.log(
        "findstring appointment",
        JSON.stringify(findString, null, 3)
      );

      var result = await Appointments.find(findString)
        .skip(pageNo * pageSize)
        .limit(pageSize)
        // populate('doctor', 'name availability').
        // populate(
        //     'clinic', 'User.clinicName'
        // ).
        .populate("client")
        .lean();

      res.send({
        success: true,
        length: result.length,
        nextPage: result.length === pageSize ? true : false,
        type: type ? type : "ALL",
        data: result,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },
};

function cloudinaryUpload(file) {
  return new Promise((resolve, reject) => {
    console.log("hey inside", JSON.stringify(file));
    cloudinary.uploader.upload(file.path, function (result) {
      console.log("\n");
      console.log(result);
      if (result.secure_url) {
        var coverImageURL = result.secure_url;

        // var cloud_version = 'v'+result.version;
        console.log("Result : " + JSON.stringify(result));
        resolve(coverImageURL);
      } else {
        console.log("Inside Error");

        reject("Error");
      }
    });
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = Doc;
// User.find({
//     title: {
//         $in: [
//             "MBBS",
//             "MDS",
//             "EAR",
//             "NOSE"
//         ]
//     }
// }).then(console.log).catch(console.log)
