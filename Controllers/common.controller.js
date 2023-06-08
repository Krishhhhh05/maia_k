let user = require('../Models/User');
let {getResV3, getResV2} = require('../helpers/helper');
let us = require('../services/user.service');

const path = require('path');

let control = {};
control.getDataJson = async function (req, res, next) {
    try {
        console.log(req.params);
        if (req.params) {
            let doctors = await us.getList(req);
            res.json(getResV3(doctors));
        } else {
            next(new Error("no params"))
        }
    } catch (e) {
        next(e)
    }
}
control.sendPage = async function (req, res, next) {
    console.log(req.params);
    try {
        res.sendFile('/search.html', {
            root: path.join(__dirname, '../frontend')});
    }catch (e) {
        next(e)
    }
}
control.getCarouselData = async function (req, res, next) {
    try {
        console.log(req.query);
        if (req.params) {
            // console.log('filters',filter);
            let doctors = await us.getDoctors(req.query);
            let clinics = await us.getClinics(req.query);

            res.json(getResV3({doctors, clinics}));

        } else {
            next(new Error("no params"))
        }
    } catch (e) {
        next(e)
    }
}
module.exports = control;
// console.log('calling all users');
// user.find({visible:1,role:"DOCTOR",'address.city':new RegExp('MUMBAI','gi')}).then(console.log).catch(console.log)
