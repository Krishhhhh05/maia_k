const model = require('../Models/food_dist/fd_user');
const model1 = require('../Models/food_dist/fd_food');
const {
    getResV3,getResV2
} = require('../helpers/helper');
const router = require('express').Router();
router.route('/').get(main).put(main).post(main);
router.route('/food').get(main2).put(main2).post(main2);
router.post('/login',require('../Controllers/authController').verifyOtp,login)
router.post('/verifyOtp',require('../Controllers/authController').verifyOtp,checkOtp)


async function main(req, res, next) {
    switch (req.method) {
        case 'GET': {
            try {
                let options = {}


                let items = await model._getAll(req.query.pin);
                res.json(getResV3(items))
            } catch (e) {
                next(e)
            }
            break;
        }
        case 'PUT': {
            try {

                let item = await model._edit(req.body)
                res.json(getResV3(item))


            } catch (e) {
                next(e)
            }
            break;
        }
        case 'POST': {
            try {

                let item = await new model(req.body).save();
                res.json(getResV3(item))

            } catch (e) {
                next(e)
            }
            break;
        }

        default: {
            next(new Error("method not allowed"))
        }
    }
}
async function main2(req, res, next) {
    switch (req.method) {
        case 'GET': {
            try {
                let items = await model1._getAll(req.query.pin);
                res.json(getResV3(items))
            } catch (e) {
                next(e)
            }
            break;
        }
        case 'PUT': {
            try {

                let item = await model1._edit(req.body)
                res.json(getResV3(item))


            } catch (e) {
                next(e)
            }
            break;
        }
        case 'POST': {
            try {

                let item = await new model1(req.body).save();
                res.json(getResV3(item))

            } catch (e) {
                next(e)
            }
            break;
        }

        default: {
            next(new Error("method not allowed"))
        }
    }
}
async function login(req, res, next) {
    try {
        let items = await model.find({mobile:req.body.number});
        res.json(getResV3(items))
    } catch (e) {
        next(e)
    }
}
async function checkOtp(req, res, next) {
    try {
        res.json(getResV2(true,{otp:"Success"},null,"otp verified"))
    } catch (e) {
        next(e)
    }
}

module.exports = router;
