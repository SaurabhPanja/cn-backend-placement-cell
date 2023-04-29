const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    status: String,
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'student' },
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'interview' }
});


const Result = mongoose.model('result', resultSchema);

module.exports = Result;
