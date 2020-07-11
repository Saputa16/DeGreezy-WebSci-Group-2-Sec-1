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
const program_1 = require("./program");
const course_1 = require("./course");
const semester_1 = require("./semester");
exports.userModel = mongoose_1.default.Schema({
    usertoken: String,
    classes_taken: [String],
    programs: [mongoose_1.default.Schema.Types.ObjectID],
    first_name: String,
    last_name: String,
    schedule: [{ type: mongoose_1.default.Schema.Types.ObjectID, ref: "Semester" }],
    semesterAdmitted: String,
    expectedGraduation: String,
    semesterCount: Number
});
function get_user(token, callback) {
    let user_model = mongoose_1.default.model('User', exports.userModel);
    user_model.findOne({ usertoken: token }, {}, function (data, err) {
        callback(data, err);
    });
}
exports.get_user = get_user;
function insert_user(user_details, callback) {
    let user_model = mongoose_1.default.model('User', exports.userModel);
    user_model.create(user_details, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            callback(err);
        }
    });
}
exports.insert_user = insert_user;
function fetch_create_user(req, res) {
    let token = req.user;
    const user_model = mongoose_1.default.model("User", exports.userModel);
    const semesterModel = mongoose_1.default.model("Semester", semester_1.semester);
    user_model.findOne({ usertoken: token }, {})
        .populate('schedule').exec(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            if (!data) {
                // Make Semesters
                // Assuming semesters
                let newUser = new user_model({ usertoken: token, first_name: "First Name", last_name: "Last Name", semesterCount: 8 });
                // Send this version to the browser
                let newUserSend = JSON.parse(JSON.stringify(newUser));
                console.log(newUser);
                for (let i = 0; i < 10; i++) {
                    let newSemester = new semesterModel({ name: token + "_sem" + (i + 1).toString() });
                    newUser.schedule[i] = newSemester._id;
                    // Adds semester objects instead of just ID
                    newUserSend.schedule[i] = JSON.parse(JSON.stringify(newSemester));
                    newSemester.save(function (err) {
                        if (err)
                            console.log(err);
                    });
                }
                // New User
                newUser.save(function (err) {
                    if (err)
                        console.log(err);
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
exports.fetch_create_user = fetch_create_user;
function push_semester(token, semester_id, callback) {
    let user_model = mongoose_1.default.model('User', exports.userModel);
    //var semester = { semester: semester_id };
    user_model.findOneAndUpdate(token, { $push: { schedule: semester_id } }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            callback(err);
        }
    });
}
exports.push_semester = push_semester;
function pull_semester(token, semester_id, callback) {
    let user_model = mongoose_1.default.model('User', exports.userModel);
    //var semester = { semester: semester_id };
    user_model.findByIdAndUpdate(token, { $pull: { schedule: semester_id } }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            callback(err);
        }
    });
}
exports.pull_semester = pull_semester;
function get_progress(usertoken, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let user_model = mongoose_1.default.model('User', exports.userModel);
        let user_data = yield user_model.findOne({ usertoken: usertoken }, {});
        let program_model = mongoose_1.default.model('Program', program_1.Programs);
        let return_data = '{ "concentrations" : [';
        let program_data;
        let courseCount;
        let reqComplete = true;
        for (let programNum = 0; programNum < user_data.programs.length; programNum++) {
            if (user_data.programs[programNum] == null) {
                break;
            }
            program_data = yield program_model.findOne({ _id: user_data.programs[programNum] }, {});
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
                return_data += '{ "name": "Major Requirements", "Completed": true },';
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
                        return_data += ',';
                    }
                    // console.log(return_data);
                }
                else {
                    return_data += '{ "name": "' + program_data.elective_courses[i].name + '", "Completed": false }';
                    if (!finalValue) {
                        return_data += ',';
                    }
                    // console.log(return_data);
                }
            }
            return_data += ']}';
            if (user_data.programs[programNum + 1] == null) {
                break;
            }
            if (programNum != user_data.programs.length - 1) {
                return_data += ',';
            }
        }
        return_data += ']}';
        callback(return_data);
    });
}
exports.get_progress = get_progress;
function findArray(value, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == value) {
            // console.log(value + ' found');
            return true;
        }
    }
    // console.log(value + ' not found');
    return false;
}
exports.findArray = findArray;
function add_course_taken(token, course_name, callback) {
    let user_model = mongoose_1.default.model('User', exports.userModel);
    //var course = {course: course_name}
    user_model.findOneAndUpdate(token, { $push: { classes_taken: course_name } }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            callback(err);
        }
    });
}
exports.add_course_taken = add_course_taken;
function check_prereq(token, course_name, semester_num, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        var target = null;
        let user_model = mongoose_1.default.model('User', exports.userModel);
        target = yield user_model.findOne({ usertoken: token });
        var target_sem = null;
        var target_course = null;
        var prereq_count = 0;
        let course_model = mongoose_1.default.model('Course', course_1.course);
        target_course = yield course_model.findOne({ name: course_name });
        if (target_course != null && target != null) {
            var prereqs = target_course.prerequisites;
            var target_count = prereqs.length;
            var result = false;
            var semester_model = mongoose_1.default.model('Semester', semester_1.semester);
            var index = 0;
            while (index < semester_num - 1) {
                var semester_id = target.schedule[index];
                target_sem = yield semester_model.findById(semester_id);
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
            if (prereq_count == target_count) {
                result = true;
            }
            callback(result);
        }
        else {
            callback("Wrong course name or faulty user token");
        }
    });
}
exports.check_prereq = check_prereq;
function check_coreq(token, course_name, semester_num, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        var target = null;
        let user_model = mongoose_1.default.model('User', exports.userModel);
        target = yield user_model.findOne({ usertoken: token });
        var target_sem = null;
        var target_course = null;
        var coreq_count = 0;
        let course_model = mongoose_1.default.model('Course', course_1.course);
        target_course = yield course_model.findOne({ name: course_name });
        if (target_course != null && target != null) {
            var coreqs = target_course.corequisites;
            var target_count = coreqs.length;
            var result = false;
            var semester_model = mongoose_1.default.model('Semester', semester_1.semester);
            var index = 0;
            while (index <= semester_num - 1) {
                var semester_id = target.schedule[index];
                target_sem = yield semester_model.findById(semester_id);
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
            if (coreq_count == target_count) {
                result = true;
            }
            callback(result);
        }
        else {
            callback("Wrong course name or faulty user token");
        }
    });
}
exports.check_coreq = check_coreq;
function buildCSV(token, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_model = mongoose_1.default.model('User', exports.userModel);
        const semester_model = mongoose_1.default.model("Semester", semester_1.semester);
        let user = yield user_model.findOne({ usertoken: token });
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
            let semester = yield semester_model.findOne({ _id: user.schedule[i] });
            csv += (i + 1) + ', ';
            console.log(semester);
            if (semester.courses.length == 0) {
                for (let j = 0; j < 5; j++) {
                    csv += ' , ';
                }
            }
            else {
                for (let j = 0; j < 5; j++) {
                    if (semester.courses[j] == null) {
                        csv += ' , ';
                    }
                    else {
                        csv += semester.courses[j] + ', ';
                    }
                }
            }
            if (semester.courses[5] == null) {
                csv += '<br>';
            }
            else {
                csv += semester.courses[5] + '<br>';
            }
        }
        callback(csv);
    });
}
exports.buildCSV = buildCSV;
function update_user(rcsId, user_change_data, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let user_model = mongoose_1.default.model('User', exports.userModel);
        user_model.findOneAndUpdate({ usertoken: rcsId.toUpperCase() }, user_change_data, function (err) {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    });
}
exports.update_user = update_user;
exports.user_test = {
    "usertoken": "1234",
    "year": 2020,
    "classes_taken": [],
    "programs": [],
    "concentration": "",
    "name": "",
    "schedule": []
};
