let User = require('../Models/User');

let userService = {
    getList: async (req) => {
        let params = req.params;
        if (params.locality == 'all') {
            delete params.locality;
        }
        if (params.city == 'all') {
            delete params.locality;
        }
        if (params.treatment == 'all') {
            delete params.treatment;
        }
        // console.log('params',params);
        let filter = { visible: 1, role: req.customCallerTypeV3, status: new RegExp('verified', 'i') };


        //this is for when request is coming from treatment page route
        if (req.customCallerTypeV3 == 'DELETEME') {
            delete filter.role;
        }
        if (!!params.city) {
            params.city = decodeURI(params.city);
            filter['address.city'] = new RegExp(params.city, 'gi');
        }
        if (!!params.locality) {
            params.locality = decodeURI(params.locality);
            filter['address.locality'] = new RegExp(params.locality, 'gi');
        }
        if (!!params.treatment) {
            params.treatment = decodeURI(params.treatment);
            filter['services.name'] = new RegExp(params.treatment, 'gi');
        }
        // console.log('filters',filter);
        let doctors = await User.find(filter);
        return doctors;
    },

    //functions for corousel
    getDoctors: async function (q) {
        let op = { visible: 1, role: "DOCTOR", status: new RegExp('verified', 'i') }
        if (q.city && q.city.length > 0) {
            op["address.city"] = new RegExp(q.city, "gi")
        }
        let limit = isNaN(Number(q.limit)) ? 15 : Number(q.limit);

        let users = await User.find(op).populate({ path: 'clinics', select: 'name profile_photo address' }).limit(limit);
        return users;
    },
    getClinics: async function (q) {
        let op = { visible: 1, role: "CLINIC", status: new RegExp('verified', 'i') }
        if (q.city && q.city.length > 0) {
            op["address.city"] = new RegExp(q.city, "gi")
        }
        let limit = isNaN(Number(q.limit)) ? 15 : Number(q.limit);
        //.populate({path:'doctors',select:'name profile_photo address'})
        let users = await User.find(op).limit(limit);

        return users;
    },

    getSlugData: async function () {
        let op = { visible: 1, role: "DOCTOR", status: new RegExp('verified', 'i') }
        let op1 = { visible: 1, role: "CLINIC", status: new RegExp('verified', 'i') }

        let doctors = await User.find(op).select("name photo experience _id title specialization address fee gender");
        let clinics = await User.find(op1);
        // .select("name photo experience _id title specialization address");
        return { doctors, clinics };
    },


};

module.exports = userService;
