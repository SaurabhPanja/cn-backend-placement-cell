const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interviewSchema = new Schema({
    companyName: String,
    date: Date,
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'student' }]
});


const Interview = mongoose.model('interview', interviewSchema);

module.exports = Interview;
