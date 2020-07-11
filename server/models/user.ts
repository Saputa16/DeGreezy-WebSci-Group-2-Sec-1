import mongoose from 'mongoose';
import {Programs} from "./program";
import {course} from "./course";
import {semester} from "./semester";
import {get_connection} from './connection'

export const userModel = mongoose.Schema({
    usertoken: String,
    classes_taken: [String],
    programs: [mongoose.Schema.Types.ObjectID],
    first_name: String,
    last_name: String,
    schedule: [{type: mongoose.Schema.Types.ObjectID, ref: "Semester"}],
    semesterAdmitted: String,
    expectedGraduation: String,
    semesterCount: Number
});

export function get_user(token, callback) {
    let user_model = mongoose.model('User', userModel);
    user_model.findOne({usertoken: token}, {}, function (data, err) {
        callback(data, err);
    });
}

export function insert_user(user_details, callback) {
    let user_model = mongoose.model('User', userModel);
    user_model.create(user_details, function(err) {
        if (err) {
            console.log(err);
        } else {
            callback(err);
        }
    });
}

export function fetch_create_user(req, res) {
    let token = req.user;
    const user_model = mongoose.model("User", userModel);
    const semesterModel = mongoose.model("Semester", semester);
    user_model.findOne({usertoken: token}, {})
        .populate('schedule').exec(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            if (!data) {
                // Make Semesters
                // Assuming semesters
                let newUser = new user_model({usertoken: token, first_name: "First Name", last_name: "Last Name", semesterCount: 8});
                // Send this version to the browser
                let newUserSend = JSON.parse(JSON.stringify(newUser));
                console.log(newUser);
                for (let i = 0; i < 10; i++) {
                    let newSemester = new semesterModel({name: token + "_sem" + (i + 1).toString()});
                    newUser.schedule[i] = newSemester._id;
                    // Adds semester objects instead of just ID
                    newUserSend.schedule[i] = JSON.parse(JSON.stringify(newSemester));
                    newSemester.save(function (err) {
                        if (err) console.log(err);
                    });
                }
                // New User
                newUser.save(function (err) {
                    if (err) console.log(err);
                    console.log("New User created");
                });
                data = newUserSend;
            }
            let queryUser = encodeURIComponent(JSON.stringify(data.usertoken));
            console.log("Logged in");
            res.redirect('/?result=' + queryUser);
        }
    });
}

export function push_semester(token, semester_id, callback) {
    let user_model = mongoose.model('User', userModel);
    //var semester = { semester: semester_id };
    user_model.findOneAndUpdate(token, {$push: {schedule: semester_id}}, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback(err);
        }
    });
}

export function pull_semester(token, semester_id, callback) {
    let user_model = mongoose.model('User', userModel);
    //var semester = { semester: semester_id };
    user_model.findByIdAndUpdate(token, {$pull: {schedule: semester_id}}, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback(err);
        }
    });
}

export async function get_progress(usertoken, callback) {
    let user_model = mongoose.model('User', userModel);
    let user_data = await user_model.findOne({usertoken: usertoken}, {});
    let program_model = mongoose.model('Program', Programs);
    let return_data = '{ "concentrations" : [';
    let program_data;
    let courseCount;
    let reqComplete = true;
    for (let programNum = 0; programNum < user_data.programs.length; programNum++) {
        if (user_data.programs[programNum] == null) {
            break;
        }
        program_data = await program_model.findOne({ _id : user_data.programs[programNum]}, {});
        return_data += '{"concentration" : "' + program_data.name + '",';
        return_data += '"requirements" : [';
        for (let i = 0; i < program_data.major_courses.length; i++) {
            if (!findArray(program_data.major_courses[i], user_data.classes_taken)) {
                return_data += '{ "name": "Major Requirements", "Completed": false },';
                reqComplete = false;
                break;
            }
        }
        if (reqComplete) {
            return_data += '{ "name": "Major Requirements", "Completed": true },'
        }
        for (let i = 0; i < program_data.elective_courses.length; i++) {
            courseCount = program_data.elective_courses[i].count;
            // console.log(program_data.elective_courses[i].name);
            // console.log(courseCount);
            reqComplete = true;
            let finalValue = false;
            if (i == program_data.elective_courses.length - 1) {
                finalValue = true;
            }
            for (let j = 0; j < program_data.elective_courses[i].classes.length; j++) {
                if (findArray(program_data.elective_courses[i].classes[j], user_data.classes_taken)) {
                    courseCount--;
                    // console.log(courseCount);
                    if (courseCount == 0) {
                        break;
                    }
                }
            }
            if (courseCount <= 0) {
                return_data += '{ "name": "' + program_data.elective_courses[i].name + '", "Completed": true }';
                if (!finalValue) {
                    return_data += ','
                }
                // console.log(return_data);
            } else {
                return_data += '{ "name": "' + program_data.elective_courses[i].name + '", "Completed": false }';
                if (!finalValue) {
                    return_data += ','
                }
                // console.log(return_data);
            }
        }
        return_data += ']}'
        if (user_data.programs[programNum + 1] == null) {
            break;
        }
        if (programNum != user_data.programs.length - 1) {
            return_data += ',';
        }
    }
    return_data += ']}';
    callback(return_data);
}

export function findArray(value, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == value) {
            // console.log(value + ' found');
            return true;
        }
    }
    // console.log(value + ' not found');
    return false;
}

export function add_course_taken(token, course_name, callback) {
    let user_model = mongoose.model('User', userModel)
    //var course = {course: course_name}
    user_model.findOneAndUpdate(token, {$push: {classes_taken: course_name}}, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback(err);
        }
    });
}

export async function check_prereq(token, course_name, semester_num, callback) {
    var target = null;
    let user_model = mongoose.model('User', userModel);
    target = await user_model.findOne({usertoken: token});
    var target_sem = null;
    var target_course = null;
    var prereq_count = 0;
    let course_model = mongoose.model('Course', course);
    target_course = await course_model.findOne({name: course_name});
    if (target_course != null && target != null) {
        var prereqs = target_course.prerequisites;
        var target_count =  prereqs.length;
        var result = false;
        var semester_model = mongoose.model('Semester', semester);
        var index = 0;
        while (index < semester_num - 1) {
            var semester_id = target.schedule[index];
            target_sem = await semester_model.findById(semester_id);
            for (var i in prereqs) {
                var prereq = prereqs[i];
                if (target_sem.courses.includes(prereq)) { //see if semester has said pre reqs
                    prereq_count += 1;
                    prereqs.splice(i, 1);
                    break;
                }
            }
            index += 1;
        }
        if (prereq_count == target_count){
            result = true;
        }
        callback(result);
    } else {
        callback("Wrong course name or faulty user token");
    }
}

export async function check_coreq(token, course_name, semester_num, callback) { //Its mostly a copypaste of prereq with a slight edit
    var target = null;
    let user_model = mongoose.model('User', userModel);
    target = await user_model.findOne({usertoken: token});
    var target_sem = null;
    var target_course = null;
    var coreq_count = 0;
    let course_model = mongoose.model('Course', course);
    target_course = await course_model.findOne({name: course_name});
    if (target_course != null && target != null) {
        var coreqs = target_course.corequisites;
        var target_count =  coreqs.length;
        var result = false;
        var semester_model = mongoose.model('Semester', semester);
        var index = 0;
        while (index <= semester_num - 1) {
            var semester_id = target.schedule[index];
            target_sem = await semester_model.findById(semester_id);
            for (var i in coreqs) {
                var coreq = coreqs[i];
                if (target_sem.courses.includes(coreq)) { //see if semester has said pre reqs
                    coreq_count += 1;
                    coreqs.splice(i, 1);
                    break;
                }
            }
            index += 1;
        }
        if (coreq_count == target_count){
            result = true;
        }
        callback(result);
    } else {
        callback("Wrong course name or faulty user token");
    }
}

export async function buildCSV(token, callback) {
    const user_model = mongoose.model('User', userModel);
    const semester_model = mongoose.model("Semester", semester);
    let user = await user_model.findOne({usertoken: token});
    let csv = 'Semester, Class 1, Class 2, Class 3, Class 4, Class 5, Class 6<br>';
    // console.log('hello');
    // if (user.schedule == null) {
    //     console.log('lamo');
    //     callback(csv);
    //     return;
    // }
    // console.log('ey');
    for (let i = 0; i < user.semesterCount; i++) {
        console.log(user.schedule[i]);
        let semester = await semester_model.findOne({_id: user.schedule[i]});
        csv += (i+1) + ', ';
        console.log(semester);
        if (semester.courses.length == 0) {
            for (let j = 0; j < 5; j++) {
                csv += ' , ';
            }
        } else {
            for (let j = 0; j < 5; j++) {
                if (semester.courses[j] == null) {
                    csv += ' , ';
                } else {
                    csv += semester.courses[j] + ', ';
                }
            }
        }
        if (semester.courses[5] == null) {
            csv += '<br>';
        } else {
            csv += semester.courses[5] + '<br>';
        }
    }
    callback(csv);
}

export async function update_user (rcsId, user_change_data, callback) {
    let user_model = mongoose.model('User', userModel);
    user_model.findOneAndUpdate({usertoken: rcsId.toUpperCase()}, user_change_data, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    })
}

export const user_test = {
    "usertoken": "1234",
    "year": 2020,
    "classes_taken" : [],
    "programs" : [],
    "concentration" : "",
    "name" : "",
    "schedule" : []
};
