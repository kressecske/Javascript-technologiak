var express = require('express');
var path = require('path');
var nconf = require('nconf');
var favicon = require('serve-favicon');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');

var bcrypt   = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var Datastore = require('nedb'),
    db = new Datastore({ filename: './users.nedb', autoload: true });

var routes = require('./routes/index');
var logout = require('./routes/logout');


//PASSPORT

passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.findOne({ email :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            var password_match = bcrypt.compareSync(password, user.password);
            if (!password_match)
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

}));

passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.findOne({ email :  email }, function(err, user) {
            // if there are any errors, return the error
           	if (err){            	
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var new_email = email;
                var new_password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                var new_name = req.body.name;
                var id;
                db.insert({
                    email: new_email,
                    username: new_name,
                    password: new_password,
                    admin : false
                });

                db.findOne({ email :  email }, function(err, user) {
                    u ={
                    'email' : new_email,
                    'password': new_password,
                    '_id' : user._id
                    }
                    return done(null, u);
                });              
                
            }
        });    
        });
}));

passport.serializeUser(function(user, done) {
   done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
	db.findOne({_id: id}, function (err, user) {
		if (err) return done(err);
		
		done(null, user);
	});
});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/auth/login');
}

function isNotLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
		res.redirect('/');
    // if they aren't redirect them to the home page
    return next();
}
//APP
var app = express();
//viewengine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/auth', isNotLoggedIn, routes);
app.use('/auth',logout);





nconf.argv();
var port = nconf.get('port') || 3000;
app.listen(port, function(){
	console.log('Listening @ http://localhost:' + port + '/');
});