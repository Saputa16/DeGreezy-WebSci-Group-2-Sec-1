import express from 'express';
import { push_semester, pull_semester, insert_user, get_user, add_course_taken, check_prereq, check_coreq, get_progress, buildCSV, update_user} from '../models/user';

const user_router = express.Router();

user_router.get('/', (req, res) => {
    get_user(req.query.token, function(err, data){
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

user_router.post('/', (req, res) => {
    console.log("Post: / " + req.body);
    insert_user(req.body, function(err){
        if (err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    });
});

user_router.put('/push', (req, res) => {
    console.log("/Push " + req.body);
    push_semester(req.body.token, req.body.semester_id, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    });
});

user_router.post('/pull', (req, res) => {
    console.log("/pull " + req.body);
    pull_semester(req.body.token, req.body.semester_id, function(err){
        if (err) {
            res.send(err);
        } else {
            res.send("Data removed successfully");
        }
    });
});

user_router.put('/courses/push', (req, res) => {
    add_course_taken(req.body.token, req.body.course_name, function(err){
        if(err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    })
})

user_router.get('/courses/prereq', (req, res) =>{
    check_prereq(req.query.token, req.query.course_name, req.query.semester_num, function(result){
        if(result == true) {
            console.log("success");
            res.send(true);
            //res.send("The user has met the prerequisites for the course");
        } else if(result == false) {
            console.log("failure");
            res.send(false);
            //res.send("The user has not met the prerequisites for the course");
        } else {
            //res.send("There has been an error with the function");
            res.send(result);
        }
    })
})

user_router.get('/courses/coreq', (req, res) =>{
    check_coreq(req.query.token, req.query.course_name, req.query.semester_num, function(result){
        if(result == true) {
            console.log("success");
            res.send(true);
            //res.send("The user has met the corequisites for the course");
        } else if(result == false){
            console.log("failure");
            res.send(false);
            //res.send("The user has not met the corequisites for the course");
        } else {
            //res.send("There has been an error with the function");
            res.send(result);
        }
    })
})

user_router.get('/getprogress', (req, res) => {
  get_progress(req.query.token, function(result, err) {
        if (err) {
            res.send(err);
        } else {
            console.log('get progress ' + result);
            res.send(result);
        }
    })
})

user_router.get('/exportCSV', (req, res) => {
    buildCSV(req.query.token, function(result, err) {
        if (err) {
            res.send(err);
        } else {
            console.log(result);
            res.send(result);
        }
    })
})

user_router.post('/update', (req, res) => {
    update_user(req.query.token, req.body, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("User Information Updated");
        }
    });
});
export default user_router;