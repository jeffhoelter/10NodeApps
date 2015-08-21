var express = require('express');

var router = express.Router();

var User = require('../models/user');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

/* GET users listing. */
router.get('/register', function(req, res, next) {
	res.render('register', {
		title: 'Register'
	});
});


/* GET users listing. */
router.get('/login', function(req, res, next) {
	res.render('login', {
		title: 'Log In'
	});
});



/* POST users listing. */
router.post('/register', function(req, res, next) {
	// Get the form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var confirmedPassword = req.body.confirmedPassword;
	var profileImage = null; //req.files.profileImage;

	// Check for image field
	if (profileImage) {
		console.log('Uploading file...');

		// file information
		var profileImageOriginalName = req.files.profileImage.originalName;
		var profileImageName = req.files.profileImage.name;
		var profileImageMimeType = req.files.profileImage.mimetype;
		var profileImagePath = req.files.profileImage.path;
		var profileImageExtension = req.files.profileImage.extension;
		var profileImageSize = req.files.profileImage.size;

	} else {
		console.log('No image uploaded');

		// set default image
		var profileImageName = 'noimage.jpg';
	}

	// Form validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'A valid email address is required').isEmail();
	req.checkBody('username', 'A User Name is required').notEmpty();
	req.checkBody('password', 'A password is required').notEmpty();
	req.checkBody('confirmedPassword', 'Confirmed password is required').notEmpty();
	req.checkBody('confirmedPassword', 'Passwords must match').equals(password);

	var errors = req.validationErrors();

	if (errors) {
		console.log("hi" + name);
		res.render('register', {
			errors: errors,
			name: name,
			user1: name,
			email: email,
			username: username
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileImage: profileImageName
		});

		// Create User
		User.createUser(newUser, function(err, user) {
			if (err) {
				console.log("error");
				throw err;
			}
			console.log("user");
			console.log(user);
		});

		// Success Message
		req.flash('success', 'You are now registered and may log in');
		res.location('/');
		res.redirect('/');

	}

});

passport.use(new localStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) {
				throw err;
			}
			if (!user) {
				console.log("Unknown user");
				return done(null, false, {message: 'Unknown User'});
			}
		});
	}
));

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/users/login',
	failureFlash: 'Invalid username or password'
}), function(request, response) {
	console.log("Authentication successful");
	req.flash('success', 'You are logged in');
	res.redirect('/');
});

module.exports = router;