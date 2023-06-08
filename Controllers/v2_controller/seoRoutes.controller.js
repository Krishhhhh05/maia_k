const User = require("../../Models/User");
const {
    getResV3
} = require("../../helpers/helper");
let wpImp = require('../../helpers/wordpress-impl/wp-impl');
const router = require("express").Router();
router.route("/").get(main).post(main);

async function main(req, res, next) {
    console.log(req.method);
    switch (req.method) {
        case "GET": {
            try {
                res.json({
                    message: "success"
                });
            } catch (e) {
                next(e);
            }
            break;
        }
        case "POST": {
            try {
                let city = req.body.location;
                let treatment = req.body.treatment;
                let slug = req.body.path;
                let role = req.body.role;
                let post_type = req.body.post_type;
                let wordpressObj = await wpImp.getSinglePostSlug(slug, post_type)
                let op2 = [],
                    op1 = [],
                    op = [];
                if (city.toLowerCase() != 'india') {
                    if (city && city !== "") {
                        op.push({
                            "address.city": new RegExp(decodeURIComponent(city), "gi"),
                        });
                    }
                } else {
                    if (city && city !== "") {
                        op2.push({
                            "address.country": new RegExp(decodeURIComponent(city), "gi"),
                        });
                    }
                }
                if (treatment && treatment !== "") {
                    op1.push({
                        "services.name": new RegExp(decodeURIComponent(treatment), "gi"),
                    });
                }
                let exp = [];
                if (Array.isArray(op) && op.length > 0) exp.push({
                    $or: op
                });
                if (Array.isArray(op1) && op1.length > 0) exp.push({
                    $or: op1
                });
                if (Array.isArray(op2) && op2.length > 0) exp.push({
                    $or: op2
                });

                console.log(role)
                var clinics = [],
                    doctors = []
                if (role == 'CLINIC') {
                    clinics = await User.find({
                            visible: 1,
                            status: 'Verified',
                            $and: exp,
                            role: 'CLINIC',
                        }).populate("clinics")
                        .populate("doctors")
                        .lean();
                } else if (role == 'DOCTOR') {
                    doctors = await User.find({
                            visible: 1,
                            status: 'Verified',
                            $and: exp,
                            role: 'DOCTOR',
                        }).populate("doctors")
                        .populate("clinics")
                        .lean();
                } else {
                    clinics = await User.find({
                            visible: 1,
                            status: 'Verified',
                            $and: exp,
                            role: 'CLINIC',
                        }).populate("clinics")
                        .populate("doctors")
                        .lean();

                    doctors = await User.find({
                            visible: 1,
                            status: 'Verified',
                            $and: exp,
                            role: 'DOCTOR',
                        }).populate("doctors")
                        .populate("clinics")
                        .lean();
                }

                let users = {
                    users: [clinics, doctors],
                    content: wordpressObj
                };
                res.json(getResV3(users));
            } catch (e) {
                next(e);
            }
            break;
        }
        default: {
            next(new Error("method not allowed"));
        }
    }
}

module.exports = router;