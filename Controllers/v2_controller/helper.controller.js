let user = require('../../Models/User');
let hb = require('../../Models/v2/home_banner/home_banner');//home banner-website api
let ht = require('../../Models/v2/home_treatment/home_treatment');//home treatment-website api
let { getResV3, getResV2 } = require('../../helpers/helper');
let us = require('../../services/user.service');
let doctor = require('../../Models/Doctor')
let client = require('../../Models/Clients')

const path = require('path');

let control = {};

control.getHomeData = async function (req, res, next) {
    try {
        console.log(req.query);
        if (req.params) {
            // console.log('filters',filter);
            let pp = []
            // doctors = await us.getDoctors(req.query);
            // clinics = await us.getClinics(req.query);
            // mobile_banners = await hb._getAll();
            // mobile_treatments = await ht._getAll();
            //
            pp.push(us.getDoctors(req.query))
            pp.push(us.getClinics(req.query))
            pp.push(hb._getAll())
            pp.push(ht._getAll())
            let k = await Promise.all(pp)
            console.log("k",k);
            // clinics = await
            // mobile_banners = await hb._getAll();
            // mobile_treatments = await ht._getAll();

            // = await ;
            //  = await
            // let {doctors, clinics} =await Promise.all([us.getDoctors(req.query), us.getClinics(req.query)])
            let result = {
                doctors: k[0], 
                clinics: k[1],
                mobile: {
                    // "mobile_banners": [
                    //     {
                    //         "image_url": "https://via.placeholder.com/150",
                    //         "click_event": "2",
                    //         "visible": "1",
                    //         "upload_date": new Date().toISOString()
                    //     }
                    // ],
                    // "mobile_treatments": [
                    //     {
                    //         "image_url": "https://via.placeholder.com/150",
                    //         "name": "asdasd",
                    //         "click_event": "2",
                    //         "visible": "1",
                    //         "upload_date": new Date().toISOString()
                    //     }
                    // ]


                    mobile_banners: k[2],
                    mobile_treatments: k[3]
                },
                desktop: {}
            }
            res.json(getResV3(result));

        } else {
            next(new Error("no params"))
        }
    } catch (e) {
        next(e)
    }
}
control.getSlugData = async function (req, res, next) {
    try {
        // console.log('filters',filter);


        let doctors = await us.getSlugData();
        console.log(doctors.length);
        // console.log(doctors, clinics);
        // let result = {
        //     doctors, clinics,
        //
        // }
        res.json(getResV3(doctors));

    } catch (e) {
        next(e)
    }
}
control.getUser = async (req, res, next) => {
    try {
        let id = req.query.id;
        let mobile = req.query.mobile;
        let k = { visible: 1, status: "Verified" }
        let op = {};
        if (id) {
            k._id = id
        }
        if (mobile) {
            k.number = mobile
        }
        console.log(k);
        switch (req.query.type) {
            case "doctor": {
                k.role = "DOCTOR"
                op = await user.find(k)
                break;
            }
            case "clinic": {
                op = await user.find(k)
                break;
            }
            case "client": {
                op = await client.find(k)
                break;
            }
            case "delete": {
                switch (req.query.type2) {
                    case "doctor": {
                        op = await doctor.findOneAndRemove({ _id: id })
                        break;
                    }
                    case "clinic": {
                        op = await user.findOneAndRemove({ _id: id })
                        break;
                    }
                    case "client": {
                        op = await client.findOneAndRemove({ _id: id })
                        break;
                    }
                    default: {
                        next(new Error("wrong option2"))
                    }
                }
                break;
            }
            default: {
                next(new Error("wrong option"))
            }
        }
        res.json(getResV3(op))

    } catch (e) {
        next(e);
    }
}
module.exports = control;
// console.log('calling all users');
// user.find({visible:1,role:"DOCTOR",'address.city':new RegExp('MUMBAI','gi')}).then(console.log).catch(console.log)
// client.findOneAndRemove({_id:'5e4a92f80c9d9000178f8760'}).then(console.log).catch(console.log)
