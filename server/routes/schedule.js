"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedule_1 = require("../models/schedule");
const schedule_router = express_1.default.Router();
schedule_router.get('/', (req, res) => {
    schedule_1.get_schedule(req.query.semester, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});
schedule_router.post('/', (req, res) => {
    console.log(req.body);
    schedule_1.insert_schedule(req.body, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
exports.default = schedule_router;
