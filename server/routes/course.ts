import express from 'express';
import {get_course, insert_course, build_course} from "../models/course";


const course_router = express.Router();

course_router.get('/', (req, res) => {
    get_course(req.query.searchString.toUpperCase(), function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

course_router.post('/', (req, res) => {
    console.log(req.body);
    insert_course(req.body, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    });
});

course_router.post('/build', (req, res) => {
    build_course(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    })
});

export default course_router;
