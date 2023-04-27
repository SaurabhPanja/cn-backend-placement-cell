const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: String,
  college: String,
  placementStatus:String,
  dsaFinalScore:String,
  webdFinalScore:String,
  reactFinalScore:String,
});


const Student = mongoose.model('student', studentSchema);

module.exports = Student;
