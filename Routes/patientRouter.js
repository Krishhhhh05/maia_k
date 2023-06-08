const express = require('express');
const router = express.Router(),
    path = require('path');
const app = express()
var MobileDetect = require('mobile-detect');
const Global = require('../Controllers/GlobalController');
var Auth = require('../Controllers/authController');
var patient = require('../Controllers/client.controller');




router.get('/home', async (req, res) => {
    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/home.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});

router.get('/login', async (req, res) => {

    res.sendFile('/Login.html', {
        root: path.join(__dirname, '../frontend')
    });

});

router.get('/mobileNo', async (req, res) => {

    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/Mobile.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});

router.get('/patientForm', async (req, res) => {

    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/PatientForm.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});

router.get('/otp', async (req, res) => {
    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/Otp.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});

router.get('/docProfile', async (req, res) => {
    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/DocInfo.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});

router.get('/list', async (req, res) => {
    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/allList.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});

router.get('/blogList', async (req, res) => {
    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/blogList.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});

router.get('/appointments', async (req, res) => {
    res.sendFile('/patient-dashboard.html', {
        root: path.join(__dirname, '../frontend')
    });

});

router.get('/profile', async (req, res) => {
    res.sendFile('/profile-settings.html', {
        root: path.join(__dirname, '../frontend')
    });
});


router.get('/confirmApt', async (req, res) => {
    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/ConfirmBook.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});

router.get('/bookApt', async (req, res) => {
    md = new MobileDetect(req.headers['user-agent']);
    if (md.mobile()) {
        res.sendFile('/selectApptTime.html', {
            root: path.join(__dirname, '../frontend')
        });
    } else {
        res.send("<h2>Open on mobile device</h2>")
    }
});


router.post('/login', Auth.verifyOtp,patient.login);
router.post('/register', patient.register);
router.post('/loginOtp', Auth.verifyOtp, Global.SignInPatient);
router.post('/updatePatient', Global.updateClient);
router.post('/getAppointments', patient.getAllAppointments);
router.get('/getOTP', patient.checkAndSendOtp);
router.post('/checkNo', patient.checkNo);
router.get('/sendOTP', patient.sendOTP);



module.exports = router;
