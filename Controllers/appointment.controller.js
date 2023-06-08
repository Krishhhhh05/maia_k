const model = require("../Models/appointmentsv2/v2_appointments");
const nc = require("../lib/notificationCotroller");
const { getResV3 } = require("../helpers/helper");
const router = require("express").Router();
router.route("/").get(main).put(main).post(main).delete(main);

var moment = require('moment');

async function main(req, res, next) {
  switch (req.method) {
    case "GET": {
      try {
        let options = {};
        if (req.query.appointmentNo) {
          options.appointmentNo = req.query.appointmentNo;
        }
        if (req.query.clinic) {
          options.clinic = req.query.clinic;
        }
        if (req.query.status) {
          options.status = req.query.status;
        }
        if (req.query.client) {
          options.client = req.query.client;
        }
        if (req.query.doctor) {
          options.doctor = req.query.doctor;
        }
        if (req.query.bookingDate) {
          options.bookingDate = req.query.bookingDate;
        }

        let items = await model
          .find(options)
          .populate({
            path: "client",
            select: "name profile_photo number email",
          })
          .populate({
            path: "doctor",
            select: "name photo title address",
          })
          .populate({
            path: "clinic",
            select: "name photo profile_photo address",
          });
        res.json(getResV3(items));
      } catch (e) {
        next(e);
      }
      break;
    }
    case "PUT": {
      try {
        let item = await model._edit(req.body);
        res.json(getResV3(item));
        if (item.status == 1) {
          nc.onNewAppointmentApproved(item);
        }
        if (item.status == 2) {
          nc.onNewAppointmentCancelled(item);
        }
        if (item.status == 3) {
          nc.onAppointmentRescheduled(item);
        }
      } catch (e) {
        next(e);
      }
      break;
    }
    case "POST": {
      try {
        let date = moment(new Date())._i;
        if (req.body.doctor == "") delete req.body.doctor;
        if (req.body.clinic == "") delete req.body.clinic;
        req.body.booked_on = date;
        let item = await new model(req.body).save();
        res.json(getResV3(item));
        nc.onNewAppointment(item);
      } catch (e) {
        next(e);
      }
      break;
    }
    case "DELETE": {
      try {
        let item = await model._delete(req.query._id);
        res.json(getResV3(item));
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
