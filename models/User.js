const { Schema, model } = require("mongoose");

const User = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    textData: { type: Schema.Types.ObjectId, ref: 'Text', default: null },
},
    { collection: 'users' });

module.exports = model('User', User);