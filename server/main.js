"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const connection_1 = require("./models/connection");
const passport_1 = __importDefault(require("passport"));
const passport_cas_1 = __importDefault(require("@byu-law/passport-cas"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const course_1 = __importDefault(require("./routes/course"));
const semester_1 = __importDefault(require("./routes/semester"));
const user_1 = __importDefault(require("./routes/user"));
const program_1 = __importDefault(require("./routes/program"));
const user_2 = require("./models/user");
// Passport Configuration
let casStrategy = passport_cas_1.default.Strategy;
passport_1.default.use(new casStrategy({
    ssoBaseURL: 'https://cas-auth.rpi.edu/cas',
    serverBaseURL: 'http://localhost:3000'
}, function (profile, done) {
    return done(null, profile);
}));
const app = express_1.default();
app.use(express_session_1.default({ secret: "Kuzmin" }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
app.get('/login', passport_1.default.authenticate('cas'), function (req, res) {
    user_2.fetch_create_user(req, res);
});
app.get('/logout', (req, res) => {
    res.redirect('/landing');
});
app.get('/landing', (req, res) => {
    res.sendFile('LandingPage.html', { root: './LandingPage' });
});
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use('/courses', course_1.default);
app.use('/semesters', semester_1.default);
app.use('/users', user_1.default);
app.use('/programs', program_1.default);
var path = require('path');
app.use('/', express_1.default.static(__dirname + '/public'));
app.use(express_1.default.static(__dirname + '/public'));
app.use(express_1.default.static(path.join(__dirname, '../public')));
app.use(express_1.default.static(path.join(__dirname, '../LandingPage')));
// Server Start
const port = 3000;
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: "." });
});
app.listen(port, () => {
    connection_1.get_connection().then(r => console.log(`App Running on Port ${port}`));
});
