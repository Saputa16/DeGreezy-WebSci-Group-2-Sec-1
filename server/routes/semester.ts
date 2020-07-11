import express from 'express';
import {insert_semester, semester, get_semester, push_course, pull_course} from "../models/semester"

const semester_router = express.Router();

semester_router.get('/', (req, res) => {
    get_semester(req.query._id, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

semester_router.post('/', (req, res) => {
    console.log(req.body);
    insert_semester(req.body, function(err){
        if (err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    });
});

semester_router.put('/push', (req, res) => {
    console.log(req.body);
    push_course(req.body._id, req.body.course, req.body.token, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    });
});

semester_router.post('/pull', (req, res) => {
    console.log(req.body);
    pull_course(req.body._id, req.body.course, req.body.token, function(err){
        if (err) {
            res.send(err);
        } else {
            res.send("Data removed successfully");
        }
    });
});

export default semester_router;
