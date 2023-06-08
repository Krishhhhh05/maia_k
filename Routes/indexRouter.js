const express = require('express');
const router = express.Router(),
    path = require('path');

const GlobalCont = require('../Controllers/GlobalController');
var patientRouter = require('./patientRouter');
const cache = require("../lib/cache/cacheManager_body");
router.use('/patient', patientRouter)


router.get('/robots.txt', async (req, res) => {
    res.sendFile('/robots.txt', {
        root: path.join(__dirname, '../Config')
    });
})


router.get('/iptest', function (req, res) {
    res.send(req.ipInfo);
});


router.get('/', async (req, res) => {
    res.sendFile('/index.html', {
        root: path.join(__dirname, '../frontend')
    });
})

router.get('/search', async (req, res) => {
    res.sendFile('/search.html', {
        root: path.join(__dirname, '../frontend')
    });
})


router.get('/doctors', async (req, res) => {
    res.sendFile('/profile-list.html', {
        root: path.join(__dirname, '../frontend')
    });
})


router.get('/clinics', async (req, res) => {
    res.sendFile('/profile-list.html', {
        root: path.join(__dirname, '../frontend')
    });
})


router.get('/mumbai/ivf-centers', async (req, res) => {
    res.sendFile('/search.html', {
        root: path.join(__dirname, '../frontend')
    });
})


//Clinic
router.get('/clinic/:name/:id', async (req, res) => {
    res.sendFile('/clinic-profile.html', {
        root: path.join(__dirname, '../frontend')
    });
})
//Clinic
router.get('/login', async (req, res) => {
    res.sendFile('/login.html', {
        root: path.join(__dirname, '../frontend')
    });
})


// Doctor & Clinic
router.post('/getAll', GlobalCont.getAllUsers);
router.get('/popularDocs', cache(1000), GlobalCont.popularDocs);
router.post('/getById', GlobalCont.getUserById);
router.post('/update', GlobalCont.update);


// Appointment
router.post('/getAppointments', GlobalCont.getAppointments);
router.post('/getAllAppointments', GlobalCont.getAllAppointments);
router.post('/updateAppointment', GlobalCont.updateAppointment);
router.post('/getAppointmentById', GlobalCont.getAppointmentById)
router.post('/showAppointment', GlobalCont.showAppointment)

// CLient
router.post('/getTrueClient', GlobalCont.getTrueClient);
router.post('/getAllClients', GlobalCont.getAllClients);
router.post('/updateClient', GlobalCont.updateClient);


router.post('/uploadFile', GlobalCont.uploadFile);
router.post('/sendSgMail', GlobalCont.sendSendGrid);

router.post('/trueCallback', GlobalCont.trueCallback);


//Search
router.post('/search', GlobalCont.search);

router.post('/mumbai/ivf-centers', GlobalCont.search);
router.post('/getFilters', cache(500), GlobalCont.getFilters);

router.get('/getLocations', GlobalCont.getLocations);
router.post('/enquiry', GlobalCont.contact_form)
router.get('/blog_posts', require('../lib/cache/cacheManager')(800), async (req, res, next) => {
    let wpImp = require('../helpers/wordpress-impl/wp-impl');
    let g = require('../helpers/helper').getResV3;
    try {
        let result = await wpImp.posts(1);
        res.json(g(result));
    } catch (e) {
        next(e)
    }

})

module.exports = router;