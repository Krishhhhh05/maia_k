const mongoose = require('mongoose');

var mongoConn = require('../Database/mongoConn');

var doctor = mongoose.Schema({
},{
    strict : false,
});

module.exports = mongoose.model('doctor',doctor,'doctor');