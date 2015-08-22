'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	res.render('register', {
		title: 'Register'
	});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		title: 'Log In'
	});
});

router.post('/register', function(req, res, next) {
	// Get the form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var confirmedPassword = req.body.confirmedPassword;
	var profileImage = null; // req.files.profileImage;

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
		console.log('hi' + name);
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
				console.log('error');
				throw err;
			}
			console.log('user');
			console.log(user);
		});

		// Success Message
		req.flash('success', 'You are now registered and may log in');
		res.location('/');
		res.redirect('/');

	}

});


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) {
				throw err;
			}
			if (!user) {
				console.log('Unknown user');
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch) {
				if (err) {
					throw err;
				}

				if (isMatch) {
					console.log('Valid password');
					return done(null, user);
				} else {
					console.log('Invalid password');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/users/login',
	failureFlash: 'Invalid username or password'
}), function(req, res) {
	console.log('Authentication successful');
	req.flash('success', 'You are logged in');
	res.redirect('/');
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/users/login');
});

module.exports = router;