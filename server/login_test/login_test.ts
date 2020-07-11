import express from "express";
import passport from "passport";
import node_cas from "@byu-law/passport-cas";
import session from 'express-session';

let casStrategy = node_cas.Strategy;


passport.use(new casStrategy({
    ssoBaseURL: 'https://cas-auth.rpi.edu/cas',
    serverBaseURL: 'http://localhost:3001'
}, function(profile, done) {
    return done(null, profile);
}));


let app = express();
app.use(passport.initialize());
app.use(session({secret: "A"}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


app.get('/login', passport.authenticate('cas'), function(req, res) {
    console.log(req.user);
});


app.listen(3001, function() {
    console.log("App listening on port 3001");
});
