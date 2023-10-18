const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    id_School: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    studentCode: {
        type: String,
        required: true
    },
    firstQuestion: {
        type: String,
        required: true
    },
    secondQuestion: {
        type: String,
        required: true
    },
    thirdQuestion: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
