var express = require('express');
var router = express.Router();
var fs = require('fs');
const nodemailer = require("nodemailer");
const previewEmail = require('preview-email');

const smtpTransport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

// Set up different environment and replace them.
if (process.env.NODE_ENV != 'production'){
    smtpTransport.sendMail = function(options, callback){
        previewEmail(options).then(console.log).catch(console.error);
        callback(undefined, {status: 200, data: options});
    };
    smtpTransport.close = function(){;}
}

// Send mail
router.post('/', function (req, res) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: req.body.to,
        subject: req.body.subject,
        generateTextFromHTML: true,
        html: req.body.html
    };
    smtpTransport.sendMail(mailOptions, function (error, response) {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
        res.send(response);
    });
});

// Get mail template(送審)
router.get('/template', function (req, res) {
    fs.readFile('./public/static/email.html', function (err, html) {
        if (err) {
            throw err;
        }
        res.send(html);
    });
});

// Get mail template(教師表單存檔)
router.get('/template/saveInfo', function (req, res) {
    fs.readFile('./public/static/formInfoMail.html', function (err, html) {
        if (err) {
            throw err;
        }
        res.send(html);
    });
});

// Get mail template(審查完成)
router.get('/template/examination_completed', function (req, res) {
    fs.readFile('./public/static/examination_completed.html', function (err, html) {
        if (err) {
            throw err;
        }
        res.send(html);
    });
});

// Get mail template image
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