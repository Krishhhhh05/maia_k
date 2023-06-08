//notificationController
var moment = require('moment');

let nc = {};
const {
    sendEmailSendGrid,
    mailObject,
    templates,
    sendMailPlain
} = require('./emails/mailer_sendGrid_templated');

var crmEmail = 'enquiry@domain.com';
const {
    sendSms,
    smsConstants
} = require('./smsManager/smsManager')
const {
    makeWhatsAppMessage
} = require('./whatsapp/ghupshup-whatsapp')
const v2_appoint = require('../Models/appointmentsv2/v2_appointments')
const {
    getAddressString
} = require('../helpers/helper')
const debug = require('debug')('nC')
let templateData = {
    "pName": "aman",
    "dName": "ola ola",
    "clinic": "",
    "cName": "Bola rebola",
    "cNumber": "+kjdflakjdflksjdljsdlfjasd",
    "cAddress": "afjlsdjflaskflasjflkajsljasdlf",
    "date": "sdfkhafljlkjsflasdfas",
    "message": "asdfjlaksjdlkfjalfjlasjdflajsdlfjalsdf"
}

nc.onNewAppointment = async function (obj) {
    let emailObj = {}
    emailObj = mailObject(emailObj);
    console.log(obj);
    let data = await getAppointmentData(obj._id);
    console.log(JSON.stringify(data));
    console.log("data", data);
    if (Array.isArray(data)) {
        data = JSON.parse(JSON.stringify(data[0]));
    }
    let t = getClinicDetails(data)

    // console.log("data",data.clinic.address);
    emailObj.tempData = getTemplateData(data.client.name, t.docName, t.cName, t.clinicDetails, t.cD, `Your appointment for ${t.date} is registered.`, t.date, 'Thank you for booking an appointment with Maia Care')

    emailObj.toEmailId = [data.client.email, crmEmail];
    emailObj.tempId = getTemplateId(data);
    emailObj.subject = `Your appointment for ${t.date} is registered.`;

    sendSms(smsConstants.APPOINTMENT_NEW, {
        name: data.client.name
    }, data.client.number, '+91')
    sendEmailSendGrid(emailObj)
    // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, thank you for making an appointment with Maia Care Health. We will soon get back to you. \n https://domain.com`)


};
nc.onNewAppointmentApproved = async function (obj) {
    let emailObj = {}
    emailObj = mailObject(emailObj);
    let data = await getAppointmentData(obj._id);
    if (Array.isArray(data)) {
        data = JSON.parse(JSON.stringify(data[0]));
    }


    let t = getClinicDetails(data)
    emailObj.tempData = getTemplateData(data.client.name, t.docName, t.cName, t.clinicDetails, t.cD, `Your appointment for ${t.date} is confirmed.`, t.date, 'Congratulations your appointment is confirmed')
    emailObj.toEmailId = [data.client.email, crmEmail];
    emailObj.tempId = getTemplateId(data);
    emailObj.subject = `Your appointment for ${t.date} is confirmed.`;
    sendSms(smsConstants.APPOINTMENT_CONFIRMED, {
        name: data.client.name
    }, data.client.number, '+91')
    sendEmailSendGrid(emailObj)
    // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, your appointment is now confirmed`)
};
nc.onNewAppointmentCancelled = async function (obj) {
    let emailObj = {}
    emailObj = mailObject(emailObj);
    // console.log(obj);
    let data = await getAppointmentData(obj._id);
    if (Array.isArray(data)) {
        data = JSON.parse(JSON.stringify(data[0]));
    }



    let t = getClinicDetails(data)
    emailObj.tempData = getTemplateData(data.client.name, t.docName, t.cName, t.clinicDetails, t.cD, `Your appointment for ${t.date} has been cancelled.`, t.date, 'Your appointment has been cancelled')
    emailObj.toEmailId = [data.client.email, crmEmail];
    emailObj.tempId = getTemplateId(data);
    emailObj.subject = `Your appointment for ${t.date} has been cancelled.`;

    sendSms(smsConstants.APPOINTMENT_CANCELLED, {
        name: data.client.name
    }, data.client.number, '+91')
    sendEmailSendGrid(emailObj)
    // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, your appointment is now confirmed`)
};

function getTemplateId(data) {
    if (!data.doctor) {
        console.log("mailTemp", "CLINIC");
        return templates.appointment_clinic
    } else {
        console.log("mailTemp", "NORMAL");

        return templates.appointment
    }
}

nc.onAppointmentRescheduled = async function (obj) {
    let emailObj = {}
    emailObj = mailObject(emailObj);
    let data = await getAppointmentData(obj._id);
    if (Array.isArray(data)) {
        data = JSON.parse(JSON.stringify(data[0]));
    }
    emailObj.toEmailId = [data.client.email, crmEmail];
    emailObj.tempId = getTemplateId(data);
    emailObj.subject = `Your appointment has been rescheduled.`

    let t = getClinicDetails(data)
    emailObj.tempData = getTemplateData(data.client.name, t.docName, t.cName, t.clinicDetails, t.cD, `Your appointment has been rescheduled`, t.date, 'Your appointment has been rescheduled')
    sendSms(smsConstants.APPOINTMENT_RESCHEDULED, {
        name: data.client.name
    }, data.client.number, '+91')
    sendEmailSendGrid(emailObj)
    // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, your appointment is now confirmed`)
};
nc.onNewRegister = async function (data) {
    let emailObj = {}
    emailObj = mailObject(emailObj);
    debug('received new profile')


    // let data = await getAppointmentData(obj._id);
    // console.log(JSON.stringify(data));
    // console.log("data", data);
    // if (Array.isArray(data)) {
    //     data = JSON.parse(JSON.stringify(data[0]));
    // }
    // let t = getClinicDetails(data)

    // console.log("data",data.clinic.address);
    emailObj.tempData = {
        pName: data.name
    }

    emailObj.toEmailId = data.email;
    emailObj.tempId = templates.register;
    emailObj.subject = `Maia Care - Welcome to our family.`;

    // sendSms(smsConstants.APPOINTMENT_NEW, {name: data.client.name}, data.client.number, '+91')
    sendEmailSendGrid(emailObj)
    debug('emailSent')
};
// nc.appointment = async (obj) => {
//     let emailObj = {}
//     emailObj = mailObject(emailObj);
//     let data = await getAppointmentData(obj._id);
//     if (Array.isArray(data)) {
//         data = JSON.parse(JSON.stringify(data[0]));
//     }
//     emailObj.toEmailId = data.client.email;
//     emailObj.tempId = templates.appointment;
//     emailObj.subject = `Your appointment has been rescheduled.`
//
//     let t = getClinicDetails(data)
//     emailObj.tempData = getTemplateData(data.client.name, t.docName, t.cName, t.clinicDetails, t.cD, `Your appointment has been rescheduled`, t.date, 'Your appointment has been rescheduled')
//     sendSms(smsConstants.APPOINTMENT_RESCHEDULED, {name: data.client.name}, data.client.number, '+91')
//     sendEmailSendGrid(emailObj)
//     // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, your appointment is now confirmed`)
// }
nc.onNewEnquiry = (obj) => {
    let emailObj = {}
    emailObj = mailObject(obj);
    emailObj.tempData = obj;
    emailObj.toEmailId = 'enquiry@domain.com';
    emailObj.tempId = templates.lead_form;
    emailObj.subject = `New Lead`;

    console.log(emailObj)
    sendEmailSendGrid(emailObj)
    // makeWhatsAppMessage(data.client.number, `Hello ${data.client.name}, thank you for making an appointment with Maia Care. We will soon get back to you. \n https://domain.com`)

}

module.exports = nc;

async function getAppointmentData(id) {
    let kk = await v2_appoint.find({
            _id: id
        }).populate({
            path: 'client',
        })
        .populate({
            path: 'clinic',
            select: 'number name email address contact_no'
        })
        .populate({
            path: 'doctor',
            select: 'number name email address'
        })
    return kk
}

// getAppointmentData('5e81ec2f8c5f985006baa276').then(console.log).catch(console.log)
// let emailObj={}
// // Object.assign(emailObj['tempData'],templateData)
// emailObj.tempData=Object.assign(templateData)
// console.log(emailObj);
function getTemplateData(pName, docName, cName, cAddress, cNumber, subject, date, message) {
    let k = Object.assign(templateData)
    k.pName = pName.charAt(0).toUpperCase() + pName.slice(1)
    k.dName = docName
    k.cName = cName
    k.subject = subject
    k.date = date
    k.message = message
    k.cAddress = cAddress
    k.cNumber = cNumber

    return k;
}

function getClinicDetails(data) {
    let docName = '';
    let clinicDetails = '';
    let cD = '',
        cName = '',
        date = '';

    try {
        docName = data.doctor.name ? data.doctor.name : "";
    } catch (e) {}
    try {
        cName = data.clinic.name ? data.clinic.name : "";
    } catch (e) {}
    // console.log('data.clinic.address',data.clinic.address);
    try {
        clinicDetails = getAddressString(data.clinic.address)
    } catch (e) {}
    try {
        cD = ""
    } catch (e) {}
    // cD = `${docName} \\n ${clinicDetails} \\n ${data.clinic.contact_no}`
    try {
        date = new Date(data.bookingDate).toDateString()
        // date = moment(data.bookingDate,"DD-MM-YYYY").format("ddd, Do MMMM YYYY ")
    } catch (e) {

    }
    let t = {
        docName,
        clinicDetails,
        cD,
        cName,
        date
    }
    // console.log(JSON.stringify(t));
    return t;
}


//specialization
// console.log('ll', new Date('2020-04-04T22:04:30.614Z').toDateString());
// console.log('ll',Date.parse('23-11-2020'));
// nc.onNewAppointment({_id:'5e850600edc2b72a80f4ff0d'})

// getClinicDetails(null)
// let day=moment("30-04-2020","DD-MM-YYYY").format("ddd, Do MMMM YYYY ")
// console.log(day);