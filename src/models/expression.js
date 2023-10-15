const mongoose = require("mongoose");

const expressionSchema = mongoose.Schema({
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

module.exports = mongoose.model('ExpressionSchema', expressionSchema);
