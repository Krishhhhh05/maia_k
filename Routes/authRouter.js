const express = require('express');
const router = express.Router();
const path = require('path');
var MobileDetect = require('mobile-detect')

var authController = require('../Controllers/authController');


router.get('/login', async (req,res)=>{
    md = new MobileDetect(req.headers['user-agent']);
    if(md.mobile()){
    res.sendFile('/Login.html', { root: path.join(__dirname, '../frontend') });
    }
    else{
        res.send({
            success:true
        })
    }
});

router.post('/verifyOtp', authController.verifyOtp);
router.post('/generateOtp', authController.generateOtp);
router.post('/resendOtp', authController.resendOtp);




module.exports=router;