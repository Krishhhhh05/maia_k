const sgMail = require('@sendgrid/mail');
const keys = require('../../Config/keys');
let mailer = {};
//Email From which the mails would be sent
const myMail = `info@maia.care`;
// let key=keys.sendGridApiKey;
let key = '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';
sgMail.setApiKey(key);
mailer.templates = {
    "appointment_create": 'd-5534a1d9db25499d9e885ac474d968fb',
    "appointment_confirm": 'd-23313d8d40b4458ca6c8832de120319f',
    "appointment": 'd-a25dd44182e0450c9444194fc0e7448e',
    "appointment_clinic": 'd-307a35a4bfc1471c80a6ff4c5477f9ab',
    "register": 'd-8681221303ad4fceb4f5d0fa99fa54ba',
    "lead_form": "d-ff1c0f66b59c44f4a06d011b88928737"
}
const mailObject = {
    toEmailId: null,
    tempId: null,
    subject: null,
    tempData: null
};
mailer.mailObject = o => Object.assign(o, mailObject)
mailer.sendEmailSendGrid = async (data) => {
    console.log("sending mail",JSON.stringify(data));
    const msg = {
        to: data.toEmailId,
        from: {email: myMail, name: "Maia Care"},
        template_id: data.tempId,
        dynamic_template_data: data.tempData,
        subject: data.subject
    };
    // console.log(msg);
    await sgMail.send(msg)
};
mailer.sendMailPlain = async (data) => {
    console.log("sending mail");
    const msg = {
        to: data.toEmailId,
        from: {email: myMail, name: "Maia Care"},
        subject: data.subject,
        text: data.text
    };
    console.log(msg);
    await sgMail.send(msg)
};


module.exports = mailer;
