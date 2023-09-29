const mongoose = require("mongoose");

const resourceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Resource", resourceSchema);
