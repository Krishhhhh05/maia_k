const User = require('../Models/User');
const router = require('express').Router();
const {getResV2} = require('../helpers/helper')
const cache=require('../lib/cache/cacheManager')

router.route('/',cache(4000)).get(searchV1)
router.route('/all',cache(4000)).get(searchV2)

async function searchV1(req, res, next) {
    try {
        let results = await User.searchPartial(req.query.city,req.query.name,req.query.locality,req.query.sname)
        // let locality = await User.searchPartialLocality(req.query.s)
        res.json(getResV2(true,results ))
    } catch (e) {
        next(e)
    }
}
async function searchV2(req, res, next) {
    try {
        let results = await User.searchAll(req.query.s,req.query.s,req.query.s,req.query.s)
        // let locality = await User.searchPartialLocality(req.query.s)
        res.json(getResV2(true,results ))
    } catch (e) {
        next(e)
    }
}
async function getCarouselData(req, res, next) {
    try {
        let results = await User.searchPartial(req.query.city,req.query.name,req.query.locality,req.query.sname)
        // let locality = await User.searchPartialLocality(req.query.s)
        res.json(getResV2(true,results ))
    } catch (e) {
        next(e)
    }
}



module.exports = router;
