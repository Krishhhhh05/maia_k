const model = require('../../Models/v2/home_banner/home_banner');
const {getResV3}=require('../../helpers/helper')
const router=require('express').Router();
router.route('/').get(main).put(main).post(main).delete(main);

async function main(req, res, next) {
    switch (req.method) {
        case 'GET': {
            try {
                // let options={}
                let items=await model._getAll();
                res.json(getResV3(items))

            } catch (e) {
                next(e)
            }
            break;
        }
        case 'PUT': {
            try {
                let item=await model._edit(req.body)
                res.json(getResV3(item))

            } catch (e) {
                next(e)
            }
            break;
        }
        case 'POST': {
            try {
                let item= await new model(req.body);
                item=await model._edit(item)
                res.json(getResV3(item))
            } catch (e) {
                next(e)
            }
            break;
        }
        case 'DELETE': {
            try {
                let item= await  model._delete(req.query._id);
                res.json(getResV3(item))
            } catch (e) {
                next(e)
            }
            break;
        }
        default:{
            next(new Error("method not allowed"))
        }
    }
}

module.exports = router;
