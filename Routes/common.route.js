const express = require('express');
const router = express.Router();
const path = require('path');

var controller = require('../Controllers/common.controller');

//doctors
router.get('/carousel',controller.getCarouselData);


module.exports=router;
