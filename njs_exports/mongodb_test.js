
//include mongodb modules  -> npm install -g mongoose
const mongoose = require('mongoose')

//connect to MongoDB
//mongoose.connect('mongodb://127.0.0.1:27017/test')


//define data style
/*var student = mongoose.model('student',{
	name: {
		type: String,
		default: 'paul'
	},
	age: Number
})

var newStudent = new student({
	age: 22
})

newStudent.save((err)=>{
	if(err)
		console.log(err)
	else
		console.log('insert success~')
})*/

exports.test = function(req,res) {
  res.render('new_index');
};

