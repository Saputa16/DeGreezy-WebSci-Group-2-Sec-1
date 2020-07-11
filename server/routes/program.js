"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const program_1 = require("../models/program");
const program_router = express_1.default.Router();
program_router.post('/', (req, res) => {
    console.log(req.body);
    program_1.insert_program(req.body, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
program_router.get('/', (req, res) => {
    console.log(req.query.name);
    program_1.get_program(req.query.name, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});
program_router.get('/all', (req, res) => {
    program_1.get_all_programs(function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
});
program_router.post('/build', (req, res) => {
    program_1.build_programs(function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Data added successfully");
        }
    });
});
exports.default = program_router;
