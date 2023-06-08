const route = {
    promotional: 1,
    transactional: 4
};
let smsConstants = {
    "NEW_REGISTER_DOCTOR": 1,
    "ACCOUNT_ACTIVATED": 2,
    "NEW_REGISTER_PATIENT": 3,
    "APPOINTMENT_NEW": 4,
    "APPOINTMENT_CONFIRMED": 5,
    "APPOINTMENT_CANCELLED": 6,
    "APPOINTMENT_RESCHEDULED": 7,

}
let opts = {
    "sender": "Velaar",
    "route": "4",
    "unicode": "1",
    "country": "91",
    "sms": [
        {
            "message": "",
            "to": []
        },

    ]
};
const MSG91 = require('msg91-node-v2');


const msg91 = new MSG91(require('../../Config/keys').msg91key);

// 1 - Promotional Route
// 4 - Transactional Route

// Mobile No can be a single number, list or csv string

var mobileNo = "9131388606";

function sendSMSMain(opts) {

    // promise function
    msg91.send(opts).then((data) => {
        // in success you'll get object
        // {"message":"REQUET_ID","type":"success"}
        console.log("response::", data);

    }).catch((error) => {
        console.log('error::', error);

    });
}

function makeSendSms(message, phoneNumber, countryCode) {
    console.log("makeSendSms1", message, phoneNumber, countryCode);
    phoneNumber = phoneNumber.toString().replace("+91", '')
    let o1 = {
        "sender": "Velaar",
        "route": "4",
        "unicode": "1",
        "country": "91",
        "sms": [
            {
                "message": "",
                "to": []
            },

        ]
    }
    console.log("makeSendSms1.5", JSON.stringify(o1));

    o1.sms[0].message = message
    o1.sms[0].to.push(phoneNumber)
    // if(Array.isArray(phoneNumber)) {
    //     o1.sms[0].to = phoneNumber
    // }else{
    //     o1.sms[0].to.push(phoneNumber)
    // }
    // o1.sms[0].to = phoneNumber
    o1.country = countryCode
    console.log("makeSendSms2", JSON.stringify(o1));
    sendSMSMain(o1)
}

function sendSms(type, data, phoneNumber, countryCode) {
    console.log("sendsms", type, data, phoneNumber, countryCode);
    let text = "";
    switch (type) {
        case smsConstants.NEW_REGISTER_DOCTOR: {
            text = `Hello ${data.name}, thank you for registering with Maia Care. We will soon review and verify your account.`
            break;
        }
        case smsConstants.APPOINTMENT_NEW: {
            text = `Hello ${data.name}, thank you for making an appointment with Maia Care. We will soon get back to you.`
            break;
        }
        case smsConstants.APPOINTMENT_CONFIRMED: {
            text = `Hello ${data.name}, your appointment is now confirmed.`
            break;
        }
        case smsConstants.APPOINTMENT_CANCELLED: {
            text = `Hello ${data.name}, your appointment is cancelled.`
            break;
        }
        case smsConstants.APPOINTMENT_RESCHEDULED: {
            text = `Hello ${data.name}, your appointment is rescheduled.`
            break;
        }
        case smsConstants.ACCOUNT_ACTIVATED: {
            text = `Hello ${data.name}, congratulations your account is now verified and activated.`
            break;
        }
        default: {
            console.log('wrong type selected');
            return
        }
    }

    makeSendSms(text, phoneNumber, countryCode)
}


module.exports = {makeSendSms, sendSms, smsConstants};

// makeSendSms("Hello test gghfflkwjgfiowhervnaldonka;dfh sms from letspartii sms service",'9131388606')

