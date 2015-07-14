var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

/* POST contact send */
router.post('/send', function(req, res, next) {
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: '********',
			pass: '********'
		}
	});

	var mailOptions = {
		from: 'Jeff Node <jeff@node.com',
		to: 'jhoelter@gmail.com',
		subject: 'Express Website Email',
		text: 'Hello Jeff'
		//text: 'You have a new submission with the following details...Name: ' + req.body.name + ' Email: ' + req.body.email + ' Message: ' + req.body.message,
		//text: 'You have a new submission with the following details...Name: ' + req.body.name + ' Email: ' + req.body.email + ' Message: ' + req.body.message
		//html: '<p>You have a new submission with the following details...Name: '+req.body.name+ ' Email: '+req.body.email+ ' Message: '+req.body.message+
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Message Send: ' + info.response);
		}
		res.redirect('/');
	});
});


module.exports = router;
