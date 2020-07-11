"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_1 = require("../models/course");
const course_router = express_1.default.Router();
course_router.get('/', (req, res) => {
    course_1.get_course(req.query.searchString.toUpperCase(), function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});
course_router.post('/', (req, res) => {
    console.log(req.body);
    course_1.insert_course(req.body, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
course_router.post('/build', (req, res) => {
    course_1.build_course(function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
exports.default = course_router;
