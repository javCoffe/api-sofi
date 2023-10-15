const mongoose = require("mongoose");

const communicationSchema = mongoose.Schema({
    id_User: {
        type: String,
        required: true
    },
    id_Resource: {
        type: String,
        required: true
    },
    stateResource: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Communication', communicationSchema);
