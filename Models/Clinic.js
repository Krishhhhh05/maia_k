const mongoose = require('mongoose');

var mongoConn = require('../Database/mongoConn');

var clinic = mongoose.Schema({
},{
    strict : false,
});

module.exports = mongoose.model('clinic',clinic,'clinic');