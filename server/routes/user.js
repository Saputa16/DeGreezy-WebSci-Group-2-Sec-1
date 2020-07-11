"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const user_router = express_1.default.Router();
user_router.get('/', (req, res) => {
    user_1.get_user(req.query.token, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});
user_router.post('/', (req, res) => {
    console.log("Post: / " + req.body);
    user_1.insert_user(req.body, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
user_router.put('/push', (req, res) => {
    console.log("/Push " + req.body);
    user_1.push_semester(req.body.token, req.body.semester_id, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
user_router.post('/pull', (req, res) => {
    console.log("/pull " + req.body);
    user_1.pull_semester(req.body.token, req.body.semester_id, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data removed successfully");
        }
    });
});
user_router.put('/courses/push', (req, res) => {
    user_1.add_course_taken(req.body.token, req.body.course_name, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
user_router.get('/courses/prereq', (req, res) => {
    user_1.check_prereq(req.query.token, req.query.course_name, req.query.semester_num, function (result) {
        if (result == true) {
            console.log("success");
            res.send(true);
            //res.send("The user has met the prerequisites for the course");
        }
        else if (result == false) {
            console.log("failure");
            res.send(false);
            //res.send("The user has not met the prerequisites for the course");
        }
        else {
            //res.send("There has been an error with the function");
            res.send(result);
        }
    });
});
user_router.get('/courses/coreq', (req, res) => {
    user_1.check_coreq(req.query.token, req.query.course_name, req.query.semester_num, function (result) {
        if (result == true) {
            console.log("success");
            res.send(true);
            //res.send("The user has met the corequisites for the course");
        }
        else if (result == false) {
            console.log("failure");
            res.send(false);
            //res.send("The user has not met the corequisites for the course");
        }
        else {
            //res.send("There has been an error with the function");
            res.send(result);
        }
    });
});
user_router.get('/getprogress', (req, res) => {
    user_1.get_progress(req.query.token, function (result, err) {
        if (err) {
            res.send(err);
        }
        else {
            console.log('get progress ' + result);
            res.send(result);
        }
    });
});
user_router.get('/exportCSV', (req, res) => {
    user_1.buildCSV(req.query.token, function (result, err) {
        if (err) {
            res.send(err);
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});
user_router.post('/update', (req, res) => {
    user_1.update_user(req.query.token, req.body, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("User Information Updated");
        }
    });
});
exports.default = user_router;
