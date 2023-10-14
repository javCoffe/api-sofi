const mongoose = require("mongoose");

const entitySchema = mongoose.Schema({
    id_Entity: {
        type: String,
        required: true,
    },
    nameEntity: {
        type: String,
        required: true,
    },
    imgEntity: {
        type: String,
        required: true,
    },
    stateEntity: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Entity", entitySchema);
