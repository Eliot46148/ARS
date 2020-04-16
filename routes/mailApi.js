var express = require('express');
var router = express.Router();
var fs = require('fs');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

var credentials = require('./credentials');

const oauth2Client = new OAuth2(
    credentials.clientID, // ClientID
    credentials.clientSecret, // Client Secret
    credentials.redirectUrl // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: credentials.refreshToken
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: credentials.user,
         clientId: credentials.clientID,
         clientSecret: credentials.clientSecret,
         refreshToken: credentials.refreshToken,
         accessToken: accessToken
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

router.post('/send', function (req, res) {
    const mailOptions = {
        from: '85stixwebsite@gmail.com',
        to: req.body.to,
        subject: req.body.subject,
        generateTextFromHTML: true,
        html: req.body.html
    };
    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
        res.send(response);
   });
});

router.get('/template', function (req, res) {
    fs.readFile('./public/static/email.html', function (err, html) {
        if (err) {
            throw err; 
        }
        res.send(html);
    });
});
router.get('/template_img', function (req, res) {
    res.set('Content-Type', 'image/jpeg');
    res.sendfile('./public/img/Invite_Illustration.png', function (err, data) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        };
    });
});

module.exports = router;