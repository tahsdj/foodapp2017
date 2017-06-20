//include mongodb modules  -> npm install -g mongoose
const mongoose = require('mongoose')

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test')

//define data style
var member = mongoose.model('members',{
	id: String,
	name: String,
	img_url: String,
	app_friends: Array,
	my_post: Array,
})


const save = function(req,res) {
	let newMember = new member(req)
	member.findOne({id: req.id},function(err,members) {
		if (err) {
			console.log(err)
		}
		else {
			if(members){
				res.redirect('/')
			}else{
				newMember.save((err,_member)=>{
					if(err) {
						console.log(err)
						res.send(err)
					}
					else{
						console.log('member insert success')
						res.redirect('/')
					}
				})
			}
		}
	})
}

exports.save = save