const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var mongoConn = require('../../Database/mongoConn');

var timeSlots = mongoose.Schema({

    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    days: [{
        day: {
            type: String,
            enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        },
        doctor: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        start_time: String,
        end_time: String,


    }]
}, {
    timestamps: true,
    strict: true,
});
timeSlots.statics={
    async _edit(obj){
        return this.findOneAndUpdate({_id:obj._id},obj,{new:true})
    },
    async _delete(_id){
        return this.findOneAndRemove({_id})
    }
}

module.exports = mongoose.model('timeSlot', timeSlots, 'timeSlots');
