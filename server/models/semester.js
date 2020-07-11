"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./user");
const Schema = mongoose_1.default.Schema;
exports.semester = new Schema({
    courses: [String],
    name: String,
    season: String,
    year: Number
});
exports.semester.index({ '$**': 'text' });
function get_semester(_id, callback) {
    let semester_model = mongoose_1.default.model('Semester', exports.semester);
    semester_model.findOne({ name: _id }, function (data, err) {
        callback(data, err);
    });
}
exports.get_semester = get_semester;
function insert_semester(semester_details, callback) {
    let semester_model = mongoose_1.default.model('Semester', exports.semester);
    semester_model.create(semester_details, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            callback(err);
        }
    });
}
exports.insert_semester = insert_semester;
function push_course(_id, course_name, token, callback) {
    let semester_model = mongoose_1.default.model('Semester', exports.semester);
    let conditions = {
        name: _id,
        'courses': { $ne: course_name }
    };
    semester_model.findOneAndUpdate(conditions, { $push: { courses: course_name } }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            let user_model = mongoose_1.default.model('User', user_1.userModel);
            console.log(token);
            user_model.findOneAndUpdate({ usertoken: token }, { $push: { classes_taken: course_name } }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(err);
                }
            });
        }
    });
}
exports.push_course = push_course;
function pull_course(_id, course_name, token, callback) {
    let semester_model = mongoose_1.default.model('Semester', exports.semester);
    //var course = {course: course_name};
    semester_model.findOneAndUpdate({ name: _id }, { $pull: { courses: course_name } }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            let user_model = mongoose_1.default.model('User', user_1.userModel);
            console.log(token);
            user_model.findOneAndUpdate({ usertoken: token }, { $pull: { classes_taken: course_name } }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(err);
                }
            });
        }
    });
}
exports.pull_course = pull_course;
