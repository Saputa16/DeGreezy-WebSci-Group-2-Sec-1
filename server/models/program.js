"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.Programs = mongoose_1.default.Schema({
    name: String,
    major_courses: [
        String
    ],
    elective_courses: [
        {
            name: String,
            count: Number,
            classes: [
                String
            ]
        }
    ]
});
function insert_program(program_details, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let program_model = mongoose_1.default.model('Program', exports.Programs);
        program_model.create(program_details, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                callback(err);
            }
        });
    });
}
exports.insert_program = insert_program;
function get_program(program_name, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let program_model = mongoose_1.default.model('Program', exports.Programs);
        program_model.findOne({ name: program_name }, function (err, data) {
            console.log(data);
            callback(data, err);
        });
    });
}
exports.get_program = get_program;
function get_all_programs(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let program_model = mongoose_1.default.model('Program', exports.Programs);
        program_model.find({}, function (err, data) {
            console.log(data);
            callback(data, err);
        });
    });
}
exports.get_all_programs = get_all_programs;
function build_programs(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let program_model = mongoose_1.default.model('Program', exports.Programs);
        let programsJson = require('../../database_info/Programs.json');
        program_model.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                program_model.collection.insertMany(programsJson, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(err);
                    }
                });
            }
        });
    });
}
exports.build_programs = build_programs;
