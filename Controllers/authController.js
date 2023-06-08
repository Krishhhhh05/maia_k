const Docter = require('../Models/Doctor');
const jwt = require('jsonwebtoken');
const config = require('../Config/keys');
const User = require('../Models/User');
const Client = require('../Models/Clients');

var keys = require('../Config/keys');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp(keys.msg91key);

const nodemailer = require('nodemailer');
var _ = require('underscore');

var unsecureRoutes = ['/', , '/getAll', '/getById', '/auth/login', '/getClient', '/trueCallback', '/auth/verifyOtp', '/auth/generateOtp', '/patient', '/mobileNo', '/otp', '/docProfile', '/patient/mobileNo', '/patient/otp', '/iptest', '/patient/docProfile', '/patient/list', '/list', '/patient/loginOtp', '/loginOtp', '/patient/login', '/login', '/patient/home', '/home', '/patient/blogList', '/blogList'];

var Auth = {


    generateOtp: async function (req, res) {
        var number = req.body.mobile
        console.log('generate otp', number);

        sendOtp.send("91"+number, "velaar", function (err, data) {
            if (err) {
                console.log("error" + err);
                res.json({
                    message: "Error generating Otp, Please try again later",
                    success: false
                })
            } else {
                console.log("message sent successfully" + JSON.stringify(data))
                res.json({
                    message: "Otp sent successfully",
                    success: true,
                    // docFound: (res.locals.doctor) ? (res.locals.doctor) : (false),
                })
            }
        });


    },

    verifyOtp: async function (req, res, next) {
        console.log('verify otp', req.body);

        let otp = Number(req.body.otp);
        let number = Number(req.body.number);

        console.log(otp, number);
        sendOtp.verify("91"+number, otp, async function (error, data) {
            try {

                if (error) throw error;

                console.log(data); // data object with keys 'message' and 'type'

                if (data.type == 'success') {


                    res.locals.body = req.body;
                    res.locals.body.number = req.body.number;
                    res.locals.body.status = "Verified";
                    next();
                }
                // if (data.type === 'error' && data.message === 'already_verified') {
                //     res.locals.body = req.body;
                //     res.locals.body.number = req.body.number;
                //     res.locals.body.status = "Verified";
                //     next();
                // }
                else {


                    if (data.type == 'error') {
                        res.json({
                            data: data,
                            message: "Error",
                            success: false,
                        });

                    }
                }

            } catch (error) {
                //change this later
                res.json({
                    error: error.message,
                    message: "otp not verified",
                    success: false
                });
            }
        });


    },

    resendOtp: async function (req, res) {
        var number = req.body.mobile
        sendOtp.retry("91"+number, false, function (error, data) {
            console.log(data)
            res.json({
                data
            })
        });
    },

    login: async function (req, res, next) {

        try {
            var number = req.body.number;
            // var pass = req.body.password;
            // var role = req.body.role;

            var patient = await Client.findOne({

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
}

module.exports = Auth;
