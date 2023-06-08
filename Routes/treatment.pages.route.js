const express = require('express');
const router = express.Router();
const path = require('path');

var controller = require('../Controllers/common.controller');

//doctors
router.get('/',controller.sendPage);
router.get('/:treatment',controller.sendPage);
// router.get('/:city/:treatment',controller.getDocs);
router.get('/:treatment/:city',controller.sendPage);
router.get('/:treatment/:city/:locality',controller.sendPage);

router.post('/',controller.getDataJson);
router.post('/:treatment',controller.getDataJson);
// router.get('/:city/:treatment',controller.getDocs);
router.post('/:treatment/:city',controller.getDataJson);
router.post('/:treatment/:city/:locality',controller.getDataJson);


// //clinics
// router.get('clinics/:city',controller.sendPage);
// // router.get('/:city/:treatment',controller.getDocs);
// router.get('clinics/:city/:locality',controller.sendPage);
// router.get('clinics/:city/:locality/:treatment',controller.sendPage);
//
// router.post('clinics/:city',controller.getDocs);
// // router.get('/:city/:treatment',controller.getDocs);
// router.post('clinics/:city/:locality',controller.getDocs);
// router.post('clinics/:city/:locality/:treatment',controller.getDocs);


// app.use('/doctors/:city/:locality/:treatments', require('./Controllers/common.controller').getPages);

module.exports=router;
