import mongoose from 'mongoose';
import program_router from '../routes/program';

export const Programs = mongoose.Schema({
    name: String,
    major_courses: [
        String
    ],
    elective_courses: [
        {
            name: String,
            count: Number,
            classes: [
                String
            ]
        }
    ]
});

export async function insert_program(program_details, callback) {
    let program_model = mongoose.model('Program', Programs);
    program_model.create(program_details, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback(err);
        }
    });
}

export async function get_program(program_name, callback) {
    let program_model = mongoose.model('Program', Programs);
    program_model.findOne({name: program_name}, function(err, data) {
        console.log(data);
        callback(data, err);
    });
}

export async function get_all_programs(callback) {
    let program_model = mongoose.model('Program', Programs);
    program_model.find({}, function(err, data) {
        console.log(data);
        callback(data, err);
    });
}

export async function build_programs(callback) {
    let program_model = mongoose.model('Program', Programs);
    let programsJson = require('../../database_info/Programs.json');
    program_model.deleteMany({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            program_model.collection.insertMany(programsJson, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    callback(err);
                }
            });
        }
    });
}