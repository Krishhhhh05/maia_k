const mongoose = require('mongoose');

// var mongoConn = require('../Database/mongoConn');

var user = mongoose.Schema({

},{
    strict : false,
    timestamp:true
});

user.statics={
    async _getAll (pin){
        let fs={}
        if(!!pin && pin.length>0){
            fs.pincode=pin;
        }
        return this.find(fs)
    },
    async _edit(obj){
        return this.findOneAndUpdate({_id:obj._id},obj,{new:true})
    },
}
module.exports = mongoose.model('fd_user',user,'fd_user');
