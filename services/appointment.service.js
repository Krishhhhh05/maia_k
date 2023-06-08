const model = require('../Models/appointmentsv2/v2_appointments');

let userService = {
    getList: async (req) => {
        let options = {}
        if (req.query.appointmentNo) {
            options.appointmentNo = req.query.appointmentNo
        }
        if (req.query.clinic) {
            options.clinic = req.query.clinic
        }
        if (req.query.status) {
            options.status = req.query.status
        }
        if (req.query.client) {
            options.client = req.query.client
        }
        if (req.query.doctor) {
            options.doctor = req.query.doctor
        }
        if (req.query.bookingDate) {
            options.bookingDate = req.query.bookingDate
        }

        let items = await model.find(options).populate({
            path: 'client',
            select: 'name profile_photo'
        }).populate({
            path: 'doctor',
            select: 'name photo'
        }).populate({
            path: 'clinic',
            select: 'name photo profile_photo'
        });
        return items;
    }
};

module.exports=userService;
