"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semester_1 = require("./semester");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.schedule = new Schema({
    semesters: [
        {
            semester: semester_1.semester
        }
    ]
});
function get_schedule(semester, callback) {
    let schedule_model = mongoose_1.default.model('Schedule', exports.schedule);
    schedule_model.findOne({ schedule_semester: semester }, {}, function (data, err) {
        callback(data, err);
    });
}
exports.get_schedule = get_schedule;
function insert_schedule(schedule_details, callback) {
    let schedule_model = mongoose_1.default.model('Schedule', exports.schedule);
    schedule_model.create(schedule_details, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            callback(err);
        }
    });
}
exports.insert_schedule = insert_schedule;
