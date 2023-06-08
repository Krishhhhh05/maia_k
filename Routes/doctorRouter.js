const express = require('express');
const router = express.Router();
const path = require('path');
const cache=require('../lib/cache/cacheManager_body')

var docController = require('../Controllers/doctorController');



// router.get('/', async (req, res) => {
//     res.sendFile('/profile-list.html', {
//         root: path.join(__dirname, '../frontend')
//     });
// })

router.get('/register',async (req,res)=>{
    res.sendFile('/doctor-register.html', { root: path.join(__dirname, '../frontend') });
});

router.get('/:name/:id',async (req,res)=>{
    res.sendFile('/doctor-profile.html', { root: path.join(__dirname, '../frontend') });
});


router.get('/:gender',async (req,res)=>{
    res.sendFile('/profile-list.html', { root: path.join(__dirname, '../frontend') });
});

router.post('/generateOtp',docController.generateOtp);
router.post('/verifyOtp',docController.verifyOtp,docController.register,docController.sendSms);
router.post('/checkNo',docController.checkNo);
router.post('/getDoctor',cache(3600),docController.getDoctor);
router.post('/getClinic',cache(3600),docController.getClinic);

router.post('/resendOtp',docController.resendOtp);

router.post('/login',docController.login, docController.generateOtp);
router.post('/verifyOtpLogin',docController.verifyOtp);

router.post('/updateDoctor',docController.updateDoctor);
router.post('/updateClinic',docController.updateClinic);
router.post('/uploadFile',docController.uploadFile);
router.post('/myAppointments',docController.myAppointments);
module.exports=router;
