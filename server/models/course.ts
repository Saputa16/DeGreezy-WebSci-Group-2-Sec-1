import mongoose from 'mongoose';


export const course = mongoose.Schema({
    course_code: String,
    course_number: Number,
    prerequisites: [String],
    corequisites: [String],
    name: String,
    majorRestricted: Boolean,
    semester: String,
    description: String
});

course.index({'$**': 'text'});


export function get_course(searchString, callback) {
    let course_model = mongoose.model('Course', course);
    // course_model.findOne({course_code: code, course_number: number}, {}, function (data, err) {
    course_model.find({name: { $regex: '.*' + searchString + '.*'}}, function (data, err) {
        callback(data, err);
    });
}

export function insert_course(course_details, callback) {
    let course_model = mongoose.model('Course', course);
    course_model.create(course_details, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback(err);
        }
    });
}

export function build_course(callback) {
    let course_model = mongoose.model('Course', course);
    let coursesJson = require('../../database_info/SpringCourses.json');
    course_model.deleteMany({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            course_model.collection.insertMany(coursesJson, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    callback(err);
                }
            });
        }
    });
}

export const course_test = {
    "course_code": "CSCI",
    "course_number": 1100,
    "name": "COMPUTER SCIENCE I",
    "semester": "Spring",
    "description": "An introduction to computer programming algorithm design and analysis. Additional topics include basic computer organization; internal representation of scalar and array data; use of top-down design and subprograms to tackle complex problems; abstract data types. Enrichment material as time allows. Interdisciplinary case studies, numerical and nonnumerical applications. Students who have passed CSCI 1200 cannot register for this course.",
    "prerequisites": [],
    "corequisites": [],
    "majorRestricted": true
};

