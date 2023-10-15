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
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('CommunicationSchema', communicationSchema);
