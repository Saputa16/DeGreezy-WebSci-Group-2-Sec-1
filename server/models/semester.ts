import {course} from './course';
import mongoose, {Schema} from 'mongoose';
import {userModel} from './user';

const Schema = mongoose.Schema;

export const semester: Schema = new Schema({
    courses: [String],
    name: String,
    season: String,
    year: Number
});

semester.index({'$**': 'text'});

export function get_semester(_id, callback) {
    let semester_model = mongoose.model('Semester', semester);
    semester_model.findOne({name: _id}, function (data, err) {
        callback(data, err);
    });
}

export function insert_semester(semester_details, callback) {
    let semester_model = mongoose.model('Semester', semester);
    semester_model.create(semester_details, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback(err);
        }
    });
}

export function push_course(_id, course_name, token, callback) {
    let semester_model = mongoose.model('Semester', semester);
    let conditions = {
        name: _id,
        'courses': { $ne: course_name}
    }
    semester_model.findOneAndUpdate(conditions, {$push: {courses: course_name}}, function (err) {
        if (err) {
            console.log(err);
        } else {
            let user_model = mongoose.model('User', userModel);
            console.log(token);
            user_model.findOneAndUpdate({usertoken : token}, {$push: {classes_taken: course_name}}, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    callback(err);
                }
            });
        }
    });

}

export function pull_course(_id, course_name, token, callback) {
    let semester_model = mongoose.model('Semester', semester);
    //var course = {course: course_name};
    semester_model.findOneAndUpdate({name: _id}, {$pull: {courses: course_name}}, function (err) {
        if (err) {
            console.log(err);
        } else {
            let user_model = mongoose.model('User', userModel);
            console.log(token);
            user_model.findOneAndUpdate({usertoken : token}, {$pull: {classes_taken: course_name}}, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    callback(err);
                }
            });
        }
    });
}
