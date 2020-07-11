// Dependencies
import express from 'express';
import bodyParser from 'body-parser';
import {get_connection} from "./models/connection";
import passport from "passport";
import node_cas from "@byu-law/passport-cas";
import session from "express-session";
import cookieParser from "cookie-parser";

import course_router from './routes/course';
import semester_router from './routes/semester';
import user_router from './routes/user';
import program_router from './routes/program';
import {fetch_create_user} from "./models/user";

// Passport Configuration
let casStrategy = node_cas.Strategy;
passport.use(new casStrategy({
    ssoBaseURL: 'https://cas-auth.rpi.edu/cas',
    serverBaseURL: 'http://localhost:3000'
}, function(profile, done) {
    return done(null, profile);
}));

const app = express();

app.use(session({secret: "Kuzmin"}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/login', passport.authenticate('cas'), function(req, res) {
    fetch_create_user(req, res);
});

app.get('/logout', (req, res) => {
    res.redirect('/landing')
});

app.get('/landing', (req, res) => {
    res.sendFile('LandingPage.html', {root: './LandingPage'})
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/courses', course_router);
app.use('/semesters', semester_router);
app.use('/users', user_router);
app.use('/programs', program_router);

var path = require('path');
app.use('/', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../LandingPage')));

// Server Start
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: "."})
});

app.listen(port, () => {
    get_connection().then(r => console.log(`App Running on Port ${port}`))
});
