"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const semester_1 = require("../models/semester");
const semester_router = express_1.default.Router();
semester_router.get('/', (req, res) => {
    semester_1.get_semester(req.query._id, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});
semester_router.post('/', (req, res) => {
    console.log(req.body);
    semester_1.insert_semester(req.body, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
semester_router.put('/push', (req, res) => {
    console.log(req.body);
    semester_1.push_course(req.body._id, req.body.course, req.body.token, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
semester_router.post('/pull', (req, res) => {
    console.log(req.body);
    semester_1.pull_course(req.body._id, req.body.course, req.body.token, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data removed successfully");
        }
    });
});
exports.default = semester_router;
