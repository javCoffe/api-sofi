const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referencia al modelo de usuario si es relevante
        required: true,
    },
    eventName: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Event", eventSchema);
