var Patient = require('../Models/Clients');
var Appointments = require('../Models/Appointments');
var User = require('../Models/User');
var Client = require('../Models/Clients');
const SendOtp = require('sendotp');
const keys = require('../Config/keys')
const sendOtp = new SendOtp(keys.msg91key);
const {getResV3, getResV2} = require('../helpers/helper')
var pat = {

    login: async function (req, res, next) {

        try {
            var number = req.body.number;

            // var role = req.body.role;

            var patient = await Client.findOne({
                role: "CLIENT",
                number: number,
            });

            if (!patient) throw new Error('Patient not Found');

            console.log('patient found ', patient);

            res.locals.patient = patient;

            res.json({
                success: true,
                patient: patient
            });

        } catch (error) {
            res.send({
                success: false,
                message: error.message
            });
        }
    },
    register: async function (req, res, next) {

        try {
            var client = await new Client(req.body).save();
            res.json(getResV2(client))
        } catch (error) {
            next(error);
        }
    },


    getAllAppointments: async function (req, res,) {

        try {
            var id = req.body.id;
            var appointments = await Appointments.find({
                _id: Object(id)
            }).lean();


            if (!appointments) throw new Error('No Appointments are Booked');

            console.log('appointments found ', patient);


            res.json({
                success: true,
                patient: patient
            });

        } catch (error) {
            res.send({
                success: false,
                message: error.message
            });
        }
    },
    checkNo: async function (req, res) {
        try {
            var number = req.body.number

            var no = await Patient.findOne({
                number: number
            }).lean();
            console.log("number:" + no)
            if (!no) {
                res.json({
                    success: true
                })

            } else {
                res.json({
                    success: false,
                    message: "Number already registered, Please Login to continue"
                })

            }
        } catch (err) {
            // res.json({
            //     success:false,
            //     message:"Number already registered, Please register with another number"
            // })
        }
    },
    checkAndSendOtp: async function (req, res, next) {

        try {
            var number = req.query.number;
            // var pass = req.body.password;
            var role = 'CLIENT';

            var patient = await Patient.findOne({
                number: number,

            });
            console.log(patient);
            if (!patient) {
                next(new Error("user does not exists."))
            } else {
                sendOtp.send("91" + number, "velaar", function (err, data) {
                    if (err) {
                        console.log("error" + err);
                        res.json(getResV2(false, null, new Error("Cannot send otp")))

                    } else {
                        console.log("message sent successfully" + JSON.stringify(data))

                        res.json(getResV2(true, data, null, 'otp sent successfully'))
                    }
                });

            }

        } catch (error) {
            next(error)
        }
    },
    sendOTP: async function (req, res, next) {

        try {
            sendOtp.send("91" + req.query.number, "velaar", function (err, data) {
                if (err) {
                    console.log("error" + err);
                    res.json(getResV2(false, null, new Error("Cannot send otp")))

                } else {
                    console.log("message sent successfully" + JSON.stringify(data))

                    res.json(getResV2(true, data, null, 'otp sent successfully'))
                }
            });

        } catch (error) {
            next(error)
        }
    },

}
module.exports = pat

// User.find({role: "CLINIC"}).then(x => {
//     console.log('got back from server::::', x.length);
//     let count = 0;
//     x.forEach(async p => {
//         console.log("first",p.fee);
//         // if (p.fee){
//         //     console.log(p.fee);
//         // }else{
//         //     console.log(p.fee);
//         //     p.fee="2";
//         //     await p.save();
//         //     console.log("saved:::",p._id,":::",p.fee);
//         // count++;
//         // // }
//         // await new User(p).save();
//         // console.log(count);
//
//
//     })
//     console.log("Done");
// }).catch(console.log)
