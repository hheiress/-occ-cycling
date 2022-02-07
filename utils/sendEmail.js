const sgMail = require("@sendgrid/mail");
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY); //poner en .env

function sendEmail  (receiver, source, subject, content) {
    try {
        const data = {
            to: receiver,
            from: source,
            subject,
            html: content,
        };
        console.log(data)
        console.log(process.env.SENDGRID_API_KEY)
        return sgMail.send(data);
    } catch (err) {
        console.error(err.stack);
        return new Error(err);
    }
};

module.exports = sendEmail;
