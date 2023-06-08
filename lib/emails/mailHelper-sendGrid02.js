const {sendEmailSendGrid,mailObject} = require('./mailer_sendGrid_templated');

let mailHelper = {};
let mailObject = mailObject;

// const msg = {
//     to: 'aman.anandx3@gmail.com',
//     from: 'ama@amazon.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg).then(console.log).catch(console.log);


mailHelper.sendWelcomeBusinessMail = () => {

    sendEmailSendGrid(mailObject)
};
mailHelper.sendNewAppointmentMail = (mailO) => sendEmailSendGrid(mailO)
mailHelper.sendAppointmentUpdate = () => {
    sendEmailSendGrid(mailObject)
};

module.exports = {mailHelper,mailObject};
// mailHelper.sendNewAppointmentMail(msg);
