const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var mongoConn = require('../../../Database/mongoConn');

var home_banner = mongoose.Schema({
        image_url: String,
        click_event: String,
        visible: String,
        upload_date: String
    },
    {
        timestamps: true,
        strict: true,
    }
    )
;
home_banner.statics = {
    async _edit(obj) {
        return this.findOneAndUpdate({_id: obj._id}, obj, {new: true,upsert:true})
    },
    async _delete(_id) {
        return this.findOneAndRemove({_id})
    },
    async _getAll(){
        return this.find({"visible": "1"})
    }
}

module.exports = mongoose.model('home_banner', home_banner, 'home_banner');
