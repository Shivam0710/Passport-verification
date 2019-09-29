const express = require('express')

const router = express.Router();

const User = require('../models/User')

const bcrypt = require('bcryptjs')

const passport = require('passport')

router.get('/login', (req, res) => res.render("login"))
router.get('/register', (req, res) => res.render("register"))

// Handle Post Request
router.post('/register', (req, res) => {
	const { name, email, password, password2 } = req.body;
	const err = []

	if(!name || !email || !password || !password2) {
		err.push({ msg: "Please enter all Details" })
	}

	if( password !== password2 ) {
		err.push({ msg: "Password doesn't match" })
	}

	if(password.length < 6) {
		err.push({ msg: "Password should be atleast 6 character long" })
	}

	if(err.length > 0) {
		res.render('register', {
			err,
			name,
			email,
			password,
			password2
		});
	} else {
		User.findOne({ email: email })
		  .then(user => {
			if(user) {
				err.push({ msg: "Email is already Registered" })
				res.render('register', {
					err,
					name,
					email,
					password,
					password2
				});
			} else {
				const newUser = new User({
					name,
					email,
					password
				})

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;

						newUser.password = hash
						
						newUser.save()
						.then(user => {
							req.flash('success_msg', 'You are successfully registered and You can now log in');
							res.redirect('/users/login');
						})
						.catch(err => console.log(err))
					})
				})
			}
		  })
	}
});

//Login Handle 
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true
	})(req, res, next);
})

//LOGOUT HANDLE 
router.get('/logout', (req, res) => {
	req.logOut();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login')
})

module.exports = router