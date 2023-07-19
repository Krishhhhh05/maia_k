var User = require("../Models/User");
var Client = require("../Models/Clients");
var Clinic = require("../Models/Clinic");

const request = require("request-promise");
var _ = require("underscore");
var Appointments = require("../Models/Appointments");
var multer = require("multer");
var keys = require("../Config/keys");
var tinified = require("tinify");
tinified.key = keys.tinifyKey;

const nodemailer = require("nodemailer");
var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: keys.cloudinaryCloudName,
  api_key: keys.cloudinaryApiKey,
  api_secret: keys.cloudinaryApiSecret,
});

var msg91Key = keys.msg91key;
var imageMimeType = ["image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).array("profileImage", 5);

var {
  DoctorStatus,
  DocCategories
} = require("../Config/statuses");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(require("../Config/keys").sendGridApiKey);

var cont = {
  getAllUsers: async function (req, res) {
    var body = req.body;
    try {
      var findString = {};
      findString["visible"] = 1;
      findString["status"] = new RegExp("verified", "i");

      if (body.role) findString["role"] = body.role;
      if (body.status) findString["status"] = body.status;
      if (body.query) findString["name"] = new RegExp(body.query, "i");

      console.log("findstring", JSON.stringify(findString, null, 3));
      if (!findString["role"]) {
        findString["role"] = "DOCTOR";
        var doctors = await User.find(findString)
          .populate("doctors")
          .populate("clinics")
          .lean();

        findString["role"] = "CLINIC";
        var clinics = await User.find(findString)
          .populate("clinics")
          .populate("doctors")
          .lean();

        var result = {
          doctors: doctors,
          clinics: clinics,
        };
      } else if (body.role == "DOCTOR") {
        var result = await User.find(findString)
          .populate("doctors")
          .populate("clinics")
          .lean();
      } else if (body.role == "CLINIC") {
        var result = await User.find(findString)
          .populate("clinics")
          .populate("doctors")
          .lean();
      }
      // console.log('res', result);

      res.send({
        success: true,
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

  popularDocs: async function (req, res) {
    var body = req.body;
    try {
      var findString = {};
      findString["visible"] = 1;
      findString["status"] = new RegExp("verified", "i");
      findString["popularity"] = 1;

      console.log("findstring", JSON.stringify(findString, null, 3));
      findString["role"] = "DOCTOR";
      var result = await User.aggregate([{
        $match: {
          visible: 1,
          status: new RegExp("verified", "i"),
          role: "DOCTOR",
        },
      },
      {
        $sample: {
          size: 5
        }
      },
      ]);

      // var result = await User.find(findString).populate('doctors').populate('clinics').limit(5).lean();
      res.send({
        success: true,
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

  getFilters: async function (req, res) {
    try {
      //   var services = await User.distinct("services.name", {
      //     visible: 1,
      //     status: new RegExp("verified", "i"),
      //   });
      var services = ["Adhesiolysis",
        "Blastocyst Transfer",
        "Consultation With Follicular Analysis/Monitoring",
        "Consultation With Pelvic Ultrasound",
        "Consultation With USG",
        "Diagnostic Hysteroscopy",
        "Diagnostic Laparoscopy",
        "DNA Fragmentation",
        "Donor Egg And TESA ICSI",
        "Donor Egg ICSI",
        "Donor Sperm ICSI",
        "Egg Donation",
        "Egg evaluation ",
        "Egg freezing - 1 Year",
        "Egg freezing -3 Months",
        "Egg freezing -6 Months",
        "Embryo Donation (ED) - Without IVF",
        "Embryo freezing- 1 Year",
        "Embryo freezing- 3 Months",
        "Embryo freezing- 6 Months",
        "Endometrial Receptivity Array",
        "Fimbrioplasty",
        "Frozen Embryo Transfer",
        "Hysteroscopic Synechiolysis",
        "ICSI",
        "IUI",
        "IUI Donor With Oral Stimulation Medicines",
        "IUI Donor With Overian Stimulation Injection",
        "IUI Husband With Oral Stimulation Medicines",
        "IUI Husband With Overian Stimulation Injection",
        "IUI Single Cycle With Injections",
        "IUI Single Cycle Without Injections",
        "IUI Three Cycles With Injections",
        "IUI Three Cycles Without Injections",
        "IVF",
        "IVF + ICSI",
        "IVF + PESA",
        "IVF + TESA",
        "IVF Single Cycle with Donor Egg",

        "IVF Single Cycle with Donor Embryo",

        "IVF Single Cycle with Donor Sperm",

        "IVF Single Cycle With Injections",
        "IVF Single Cycles With Injections And Donor Egg Or Donor Sperm Or Both",
        "IVF Three Cycles with Donor Egg",

        "IVF Three Cycles with Donor Embryo",

        "IVF Three Cycles with Donor Sperm",

        "IVF Three Cycles With Injection And Donor Egg",
        "IVF Three Cycles With Injections",
        "IVF Unlimited Cycles",
        "Metroplasty",
        "Myomectomy",
        "Operative Hysteroscopy",
        "Operative Laparoscopy",
        "Ovarian Drilling",
        "PESA",
        "PGD",
        "PGS",
        "Polypectomy",
        "Pre Genetic Testing",
        "Self IVF",
        "Semen evaluation",
        "Sperm Donation",
        "Sperm evaluation",
        "Sperm Freezing- 1 Year",
        "Sperm Freezing- 3 Months",
        "Sperm Freezing- 6 Months",
        "Surrogacy",
        "Surrogacy (1 Cycle IVF With Donor Egg And Own Sperm)",
        "Surrogacy (1 Cycle IVF With Own Egg And Own Sperm)",
        "Surrogacy (3 Cycle IVF With Donor Egg And Own Sperm)",
        "Surrogacy (3 Cycle IVF With Own Egg And Own Sperm)",
        "TESE",
        "Testicular Biopsy (Andrologist)"
      ];
      console.log("services:", services);

      // var specialists = await User.distinct('specialization', {
      //     'visible': 1, status:new RegExp('verified','i')
      // });

      var amenities = await User.distinct("amenities", {
        visible: 1,
        status: new RegExp("verified", "i"),
      });

      // console.log('amenities',amenities);
      var response = {
        new_services: [],
        // new_specialists: [],
        new_amenities: [],
      };
      for (let i = 0; i < services.length; i++) {
        var string = titleCase(services[i].trim());
        if (string != null) response.new_services.push(string);
      }

      // for (let i = 0; i < specialists.length; i++) {
      //     var string = titleCase(specialists[i].trim());
      //     if (string != null)
      //         response.new_specialists.push(string);
      // }
      for (let i = 0; i < amenities.length; i++) {
        var string = titleCase(amenities[i].trim());
        if (string != null) response.new_amenities.push(string);
      }

      function titleCase(string) {
        if (string != "") {
          var sentence = string.toLowerCase().split(" ");
          for (var i = 0; i < sentence.length; i++) {
            if (
              sentence[i].toUpperCase() != "IVF" ||
              sentence[i].toUpperCase() != "IUI"
            )
              sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
          }
          return sentence.join(" ");
        }
      }

      res.json({
        success: true,
        services: [...new Set(response.new_services)],
        // specialists: [...new Set(response.new_specialists)],
        amenities: [...new Set(response.new_amenities)],
      });
    } catch (error) {
      res.json({
        success: false,
        messgage: error,
      });
    }
  },

  getUserById: async function (req, res) {
    try {
      var result = await User.findOne({
        _id: Object(req.body.id),
      }).lean();
      console.log("res", result);

      res.send({
        success: true,
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

  update: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body.id;

      if (id) {
        //update document

        updateString = body;
        delete updateString["id"];
        // if (body.name) updateString['name'] = body.name;
        // if (body.number) updateString['number'] = body.number;
        // if (body.status) updateString['status'] = body.status;

        // if (body.clinicName) updateString['clinic.clinicName'] = body.clinicName;
        // if (body.clinicAddress) updateString['clinic.clinicAddress'] = body.clinicAddress;

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await User.updateMany({
          _id: Object(id),
        }, {
          $set: updateString,
        });
      } else {
        // create new document
        console.log("inside create new document");

        var result = await User.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
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

  uploadFile: async function (req, res) {
    try {
      allFiles = [];
      url2 = req.protocol + "://" + req.get("host");

      // var i = productImage
      // console.log("i:"+i)
      // await upload.single('productImage')
      // console.log("u:"+u)
      console.log(req);

      upload(req, res, async function (err) {
        try {
          console.log("pathOfFile", JSON.stringify(req.file));
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

  getAllAppointments: async function (req, res) {
    var pageSize = 25;
    var body = req.body;
    var pageNo = body.pageNo;
    var k = 0;

    try {
      var findString = {};
      // var finalResult = {}

      if (body.role) findString["role"] = body.role;
      if (body.status) findString["status"] = body.status;

      console.log("findstring", JSON.stringify(findString, null, 3));

      var result = await Appointments.find(findString)
        .skip(pageNo * pageSize)
        .limit(pageSize)
        .populate("doctor", ["name", "availability"])
        .populate("clinic", "clinic.clinicName")
        .lean();
      console.log("res", JSON.stringify(result, undefined, 3));
      console.log("len:" + result.length);

      res.send({
        success: true,
        length: result.length,
        nextPage: result.length === pageSize ? true : false,
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

  getAppointmentById: async function (req, res) {
    try {
      var result = await Appointments.findOne({
        _id: Object(req.body.id),
      }).lean();
      console.log("res", result);

      res.send({
        success: true,
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

  getAppointments: async function (req, res) {
    var pageSize = 25;
    var pageNo = req.body.pageNo;
    var status = req.body.status;
    var type = req.body.type;

    var findString = {};

    if (status) findString["status"] = status;

    try {
      if (type === "TODAY") {
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999);

        findString["registeredOn"] = {
          $gte: start.getTime(),
          $lte: end.getTime(),
        };
      } else if (type === "WEEK") {
        let today = new Date();

        var first = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = new Date(today.setDate(first));
        firstday.setHours(0, 0, 0, 0);
        var lastday = new Date(today.setDate(last));
        lastday.setHours(23, 59, 59, 999);

        findString["registeredOn"] = {
          $gte: firstday.getTime(),
          $lte: lastday.getTime(),
        };
      } else if (type === "FOLLOW_UP") {
        let day = new Date();

        findString["$or"] = [{
          registeredOn: {
            $lte: day.getTime(),
          },
          status: "SCHEDULED",
        },
        {
          status: "RESCHEDULED",
        },
        ];
        // findString['registeredOn']={'$lte': today.getTime()};
        // findString['status'] = {'$in':['RESCHEDULED','SCHEDULED']};
      }

      console.log(
        "findstring appointment",
        JSON.stringify(findString, null, 3)
      );

      var result = await Appointments.find(findString)
        .skip(pageNo * pageSize)
        .limit(pageSize)
        .populate("doctor", "name availability")
        .populate("clinic", "clinic.clinicName")
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

  updateAppointment: async function (req, res) {
    var body = req.body;
    console.log("body", body);
    var client = body.client;
    try {
      var updateString = {};
      var id = body.id;

      if (id) {
        //update document

        updateString = body;
        delete updateString["id"];
        updateString.client = client._id;
        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await Appointments.updateMany({
          _id: Object(id),
        }, {
          $set: updateString,
        });
      } else {
        // create new document
        console.log("inside create new document");

        var result = await Appointments.create(body);
      }
      console.log("res", result);
      sendAppointmentSms(body);
      res.send({
        success: true,
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

  addNewDoctorUsingCrm: async function (req, res) {
    try {
      var body = req.body;
      var clinic = req.body.clinics ? req.body.clinics : [];
      delete body["clinics"];
      var doctor = body;
      var result = await User.create(doctor);
      var len = clinic.length;
      var resu = {};
      for (i = 0; i < len; i++) {
        // var newClinic = {
        //     status: statuses.DoctorStatus.Registered,
        //     number: clinic[0].number,
        //     clinic: clinic[0]
        // }
        // delete newClinic.clinic['number']

        if (clinic[0]._id) {
          resu._id = clinic[0]._id;
        } else {
          resu = await User.create(clinic[0]);
        }
        console.log("res", resu);
        clinic.splice(0, 1);

        if (doctor.clinics) {
          console.log("Outside");

          doctor.clinics.push(resu._id);
        } else {
          console.log("Inside");

          var c = [resu._id];
          doctor.clinics = c;
        }
        console.log("_id", result._id);

        console.log("doctor", doctor);
        if (result._id) {
          var resul = await User.updateMany({
            _id: result._id,
          }, {
            $set: doctor,
          });
        } else { }
        console.log("Result", result);

        var updateId = await User.update({
          _id: resu._id,
        }, {
          $addToSet: {
            doctors: result._id,
          },
        });
        console.log("final", updateId);
      }
      res.send({
        success: true,
        result: [result, doctor.clinics],
      });
    } catch (err) {
      res.send({
        success: false,
        message: err,
      });
    }
  },

  addNewClinicUsingCrm: async function (req, res) {
    try {
      var body = req.body;
      var doctor = req.body.doctors ? req.body.doctors : [];
      delete body["doctors"];
      var clinic = body;
      var result = await User.create(clinic);
      var resu = {};
      var len = doctor.length;
      for (i = 0; i < len; i++) {
        if (doctor[0]._id) {
          resu._id = doctor[0]._id;
        } else {
          resu = await User.create(doctor[0]);
        }
        console.log("res", resu);
        doctor.splice(0, 1);

        if (clinic.doctors) {
          console.log("Outside");

          clinic.doctors.push(resu._id);
        } else {
          console.log("Inside");

          var c = [resu._id];
          clinic.doctors = c;
        }

        console.log("_id", result._id);

        console.log("clinic", clinic);
        if (result._id) {
          var resul = await User.updateMany({
            _id: result._id,
          }, {
            $set: clinic,
          });
        } else { }
        console.log("Result", result);

        var updateId = await User.update({
          _id: resu._id,
        }, {
          $addToSet: {
            clinics: result._id,
          },
        });
        console.log("final", updateId);
      }
      res.send({
        success: true,
        result: [result, clinic.doctors],
      });
    } catch (err) {
      res.send({
        success: false,
        message: err,
      });
    }
  },

  getAllClients: async function (req, res) {
    var pageSize = 25;
    var body = req.body;
    var pageNo = body.pageNo;

    try {
      var findString = {};

      if (body.doctor) findString["doctor"] = body.doctor;
      if (body.status) findString["status"] = body.status;
      if (body.query) findString["name"] = new RegExp(body.query, "i");

      console.log("findstring", JSON.stringify(findString, null, 3));

      var result = await Client.find(findString)
        .skip(pageNo * pageSize)
        .limit(pageSize)
        .populate("doctor")
        .lean();
      console.log("res", result.length);

      res.send({
        success: true,
        length: result.length,
        nextPage: result.length === pageSize ? true : false,
        data: result,
        status: findString["status"],
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },

  getTrueClient: async function (req, res, next) {
    try {
      console.log("req ", req.body);

      if (req.body.id) {
        var result = await Client.findOne({
          _id: Object(req.body.id),
        }).lean();
      } else {
        var result = await Client.findOne(req.body).lean();
      }

      console.log("Client res ", result);

      if (!result) throw new Error("Not Found");

      res.locals.data = result;
      next();
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },

  updateClient: async function (req, res) {
    var body = req.body;

    try {
      var updateString = {};
      var id = body._id;

      if (id) {
        //update document

        updateString = body;
        delete updateString["_id"];

        console.log("updateString", JSON.stringify(updateString, null, 3));

        var result = await Client.update({
          _id: Object(id),
        }, {
          $set: updateString,
        });
      } else {
        // create new document
        console.log("inside create new document");

        var result = await Client.create(body);
      }
      console.log("res", result);

      res.send({
        success: true,
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

  search: async function (req, res) {
    var body = req.body;
    console.log(req.body);

    try {
      var result = await User.find(body);

      console.log(result);
      res.json({
        success: true,
        length: result.length,
        data: result,
      });
    } catch (error) {
      res.json({
        success: false,
        errorMessage: error,
      });
    }
  },

  sendSendGrid: async function (req, res) {
    try {
      let {
        to,
        from,
        subject,
        text,
        html
      } = req.body;

      const msg = {
        to,
        from,
        subject,
        text,
        html,
        // personalizations:[{
        //     dynamic_template_data:{
        //         name:'aman'
        //     },
        // }],
        template_id: "d-5ef7bd018d184bcc9a5b82c9795ffb54",
      };

      let sent = await sgMail.send(msg);

      res.send({
        success: true,
        data: sent,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },

  contact_form: async function (req, res) {
    var body = req.body;
    var html = `Hey You have a new enquiry from ${body.name}. 
                    Contact Number : ${body.number}. Email ID : ${body.email}`;
    var from_email = "info@maia.care";
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: "465",
      secure: true,
      auth: {
        type: "OAuth2",
        user: from_email,
        serviceClient: keys.gsuite_client,
        privateKey: keys.gsuite_private_key,
      },
    });

    console.log("In Send Mail");

    var mailOptions = {
      from: from_email,
      to: "enquiry@maia.care",
      subject: "Welcome to Maia Care",
      text: html,
      html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.json({
          success: false,
          message: error,
        });
      } else {
        console.log("Email sent: " + info.response);
        res.json({
          success: true,
          message: info,
        });
      }
    });
  },

  trueCallback: async function (req, res) {
    try {
      // sample body
      // {"requestId":"RL8YZ41FQMt5Jiak2sc_Ys0OgQA=","accessToken":"a1asX--8_yw-OF--E6Gj_DPyKelJIGUUeYB9U9MJhyeu4hOCbrl","endpoint":"https://profile4-noneu.truecaller.com/v1/default"}

      console.log("true callback", req.body);

      var options = {
        url: req.body.endpoint,
        headers: {
          Authorization: `Bearer ${req.body.accessToken}`,
          "Cache-Control": "no-cache",
        },
      };

      var response = await request.get(options);

      response = JSON.parse(response);
      console.log("truecaller response ", response);

      // let array = response['phoneNumbers'];
      console.log("array ...", response.phoneNumbers[0]);

      // if(!Array.isArray(array)) throw new Error('not a array');

      var result = await Client.findOne({
        number: {
          $in: response.phoneNumbers,
        },
      }).lean();
      console.log("result", result);

      if (!result) {
        // not registered
        console.log("not resgistered ");

        let newClient = {
          name: response.name.first + " " + response.name.last,
          number: response.phoneNumbers[0],
          gender: response.gender,
          city: response.addresses.city,
          pincode: response.addresses.zipcode,
          profile_photo: response.avatarUrl,
          status: "VERIFIED",
          role: "CLIENT",
          trueRequestId: req.body.requestId,
        };

        result = await Client.create(newClient);

        console.log("create res ", result);
      } else {
        //registered

        let update = await Client.updateOne({
          _id: Object(result._id),
        }, {
          $set: {
            trueRequestId: req.body.requestId,
          },
        });

        console.log("updated val", update);
      }

      // {
      //     "phoneNumbers": [919999999999],
      //     "addresses": [
      //       {
      //          "countryCode": "in",
      //          "city": "city_field_value",
      //          "street": "street_field_value",
      //          "zipcode": "1234567"
      //       }
      //     ],
      //     "avatarUrl": "https://s3-eu-west-1.amazonaws.com/images1.truecaller.com/myview/1/15a999e9806gh73834c87aaa0498020d/3",
      //     "aboutMe":"About me",
      //     "jobTitle": "CEO",
      //     "companyName": "ABC",
      //     "history": {
      //       "name":
      //       {
      //         "updateTime": "1508089888000"
      //       }
      //     },
      //     "isActive": "True",
      //     "gender": "Male",
      //     "createdTime": "1379314068000",
      //     "onlineIdentities": {
      //       "url": "https://www.truecaller.com",
      //       "email": "y.s@truecaller.com",
      //       "facebookId":"105056625245",
      //     },
      //     "type": "Personal",
      //     "id": "655574719",
      //     "userId":"1319413476",
      //     "badges": ["verified", "premium"],
      //     "name": {
      //       "last": "Kapoor",
      //       "first": "Rajat"
      //     }
      //   }
    } catch (error) {
      console.log("err", error);
    }
  },

  SignInPatient: async function (req, res, next) {
    try {
      delete res.locals.body.otp;
      res.locals.body.role = "CLIENT";
      var patient = await Client.findOne({
        number: res.locals.body.number,
      });
      if (!patient) patient = await Client.create(res.locals.body);

      res.json({
        message: "otp verified",
        success: true,
        patient: patient,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: error.message,
      });
    }
  },

  showAppointment: async function (req, res) {
    try {
      var id = res.locals.id;
      var status = req.body.status;
      console.log("id", id);

      var app = await Appointments.find({
        client: Object(id),
        status: status,
      })
        .populate("doctor")
        .lean();

      console.log("app", app);
      res.send({
        success: true,
        data: app,
      });
    } catch (error) {
      console.log("err", error);
      res.send({
        success: false,
        msg: "No Appointments",
      });
    }
  },

  getLocations: async function (req, res) {
    var locations = await User.find({ visible: 1, address: { $exists: true } }, {
      "address.city": 1,
      "address.locality": 1,
      _id: 0,
    }).lean();

    var city_object = [],
      locality_object = {};
    locations.forEach((address_obj) => {
      // console.log(address_obj);

      if (
        Object.keys(address_obj).length !== 0 &&
        address_obj.constructor === Object
      ) {
        var obj = {};
        obj.city = address_obj.address.city;
        obj.locality = address_obj.address.locality;
        if (obj.city && obj.locality) {
          obj.city = obj.city.toUpperCase().trim();
          obj.locality = obj.locality.toUpperCase().trim();

          if (locality_object.hasOwnProperty(obj.city)) {
            // console.log(locality_object);
            if (!locality_object[obj.city].includes(obj.locality)) {
              locality_object[obj.city].push(obj.locality);
              city_object.push(obj);
            }
          } else {
            locality_object[obj.city] = [];
            locality_object[obj.city].push(obj.locality);
            city_object.push(obj);
          }
        }
      }
    });

    res.json({
      success: true,
      cities: city_object,
      locatilies: locality_object,
    });
  },
};

function cloudinaryUpload(file) {
  return new Promise((resolve, reject) => {
    console.log("hey inside", JSON.stringify(file));
    cloudinary.uploader.upload(file.path, function (result) {
      // if(error){
      //     console.log("Error");

      //     reject(error)
      // }
      if (result.secure_url) {
        var coverImageURL = result.secure_url;

        // var cloud_version = 'v'+result.version;
        console.log("Result : " + JSON.stringify(result));
        resolve(coverImageURL);
      } else {
        reject("Error");
      }
    });
  });
}

async function sendAppointmentSms(appointment) {
  try {
    console.log(appointment);

    var patient = appointment.client;
    var message = `Hi ${patient.name}, your appointment with ${appointment.doctorName} on ${appointment.date} is requested`;
    var number = patient.number;
    var options = {
      url: "https://api.msg91.com/api/v2/sendsms?country=91",
      body: {
        sender: "velaar",
        route: "4",
        country: "91",
        sms: [{
          message: message,
          to: [number],
        },],
      },
      json: true,
      headers: {
        authkey: msg91Key,
        "content-type": "application/json",
      },
    };

    var response = await request.post(options);

    console.log("res ", response);
  } catch (error) {
    console.log(error);
  }
}
module.exports = cont;