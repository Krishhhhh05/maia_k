let {getResV2}=require('./helper')
module.exports = function (err, req, res, next) {
    console.error(err.stack)
    res.send(getResV2(false,null,err))
};
