const express = require('express')

const expressLayouts = require('express-ejs-layouts');

const flash = require('connect-flash')

const session = require('express-session')

const mongoose = require('mongoose')

const passport = require('passport')

require('./config/passport')(passport)

const app = express();

const PORT = process.env.PORT || 5000;

//DB CONFIG
const db = require('./config/keys').MongoURI

//MONGOOSE CONNECT
mongoose.connect(db, { useNewUrlParser: true })
	.then(() => console.log("Mongo DB connected"))
	.catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BODY PARSER
app.use(express.urlencoded({ extended: false }));

//EXPRESS SESSION
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// CONNECT FLASH
app.use(flash())

//GLOBAL VARS
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	next();
})

// ROUTES
app.use('/', require('./routers/index'))
app.use('/users', require('./routers/users'))

app.listen(PORT, console.log(`Server Started on Port ${PORT}`))