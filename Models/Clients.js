const mongoose = require('mongoose');

var mongoConn = require('../Database/mongoConn');

var user = mongoose.Schema({
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
},{
    strict : false,
});


user.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
})
user.post('save', function () {
    console.log("saved doc",this);
    if (this.wasNew) {
        console.log("Sending email");
        require('../lib/notificationCotroller').onNewRegister(this);
    }

})

module.exports = mongoose.model('clients',user,'clients');
