"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.course = mongoose_1.default.Schema({
    course_code: String,
    course_number: Number,
    prerequisites: [String],
    corequisites: [String],
    name: String,
    majorRestricted: Boolean,
    semester: String,
    description: String
});
exports.course.index({ '$**': 'text' });
function get_course(searchString, callback) {
    let course_model = mongoose_1.default.model('Course', exports.course);
    // course_model.findOne({course_code: code, course_number: number}, {}, function (data, err) {
    course_model.find({ name: { $regex: '.*' + searchString + '.*' } }, function (data, err) {
        callback(data, err);
    });
}
exports.get_course = get_course;
function insert_course(course_details, callback) {
    let course_model = mongoose_1.default.model('Course', exports.course);
    course_model.create(course_details, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            callback(err);
        }
    });
}
exports.insert_course = insert_course;
function build_course(callback) {
    let course_model = mongoose_1.default.model('Course', exports.course);
    let coursesJson = require('../../database_info/SpringCourses.json');
    course_model.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            course_model.collection.insertMany(coursesJson, function (err) {
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
exports.build_course = build_course;
exports.course_test = {
    "course_code": "CSCI",
    "course_number": 1100,
    "name": "COMPUTER SCIENCE I",
    "semester": "Spring",
    "description": "An introduction to computer programming algorithm design and analysis. Additional topics include basic computer organization; internal representation of scalar and array data; use of top-down design and subprograms to tackle complex problems; abstract data types. Enrichment material as time allows. Interdisciplinary case studies, numerical and nonnumerical applications. Students who have passed CSCI 1200 cannot register for this course.",
    "prerequisites": [],
    "corequisites": [],
    "majorRestricted": true
};
