import express from 'express';
import {insert_program, get_program, build_programs, get_all_programs} from "../models/program"

const program_router = express.Router();

program_router.post('/', (req, res) => {
    console.log(req.body);
    insert_program(req.body, function(err){
        if (err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    });
});

program_router.get('/', (req, res) => {
    console.log(req.query.name);
    get_program(req.query.name, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
    
});

program_router.get('/all', (req, res) => {
    get_all_programs(function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

program_router.post('/build', (req, res) => {
    build_programs(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Data added successfully");
        }
    })
})

export default program_router;