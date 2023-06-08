const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var mongoConn = require('../Database/mongoConn');

var appointments = mongoose.Schema({
    appointmentNo : Number,
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    clinic :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    client :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clients'
    }
},{
    strict : false,
});


appointments.plugin(autoIncrement.plugin, {
    model: 'appointments',
    field: 'appointmentNo',
    startAt: 1,
});

module.exports = mongoose.model('appointments',appointments,'appointments');