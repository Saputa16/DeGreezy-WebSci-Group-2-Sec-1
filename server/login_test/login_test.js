"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_cas_1 = __importDefault(require("@byu-law/passport-cas"));
const express_session_1 = __importDefault(require("express-session"));
let casStrategy = passport_cas_1.default.Strategy;
passport_1.default.use(new casStrategy({
    ssoBaseURL: 'https://cas-auth.rpi.edu/cas',
    serverBaseURL: 'http://localhost:3001'
}, function (profile, done) {
    return done(null, profile);
}));
let app = express_1.default();
app.use(passport_1.default.initialize());
app.use(express_session_1.default({ secret: "A" }));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
app.get('/login', passport_1.default.authenticate('cas'), function (req, res) {
    console.log(req.user);
});
app.listen(3001, function () {
    console.log("App listening on port 3001");
});
