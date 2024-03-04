const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const textSchema = new Schema({
    textareas: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
    { collection: 'notes' });

module.exports = model('Text', textSchema);