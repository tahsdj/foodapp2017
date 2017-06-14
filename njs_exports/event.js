
//include mongodb modules  -> npm install -g mongoose
const mongoose = require('mongoose')

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test')

//define data style
var post = mongoose.model('posts',{
	title: String,
	name: String,
	time: String,
	price: String,
	game_time: String,
	rules: String,
	members:{
		type: Number,
		default: 1
	},
	id: String,
	joinList: []
})

const build = function(req,res) {
	console.log(req.body)
	let newPost = new post(req.body)
	newPost.save((err,posts)=>{
		if(err) {
			console.log(err)
			res.send(err)
		}
		else{
			console.log('insert success')
			let newID = JSON.stringify(posts._id).slice(1,8) //slice to first 1 to 8 string
			post.update({_id: posts._id},{id: newID},function(err,_post) {
				if (err) 
					console.log(err)
				else {
					console.log(newID)
					res.send(newID)
					console.log('update success')
				}
			})
		}
	})
}

// find post
const enter = function(req,res) {
	let reqId = req.body["id"]
	post.findOne({id: reqId},function(err,posts) {
		if (err) {
			console.log(err)
		}
		else {
			if(posts){
				res.render('new_post_index',{
					post: posts,
					id: posts.id
				})
			}else{
				res.redirect('/')
			}
		}
	})
}

const join = function(req,res) {
	let newPost = new post(req.body)
	let reqId = req.params.id
	post.findOne({id: reqId},function(err,posts) {
		if (err) {
			console.log(err)
		}
		else {
			if(posts){
				res.render('new_post_index',{
					post: posts,
					id: posts.id
				})
			}else{
				res.redirect('/')
			}
		}
	})
}

exports.build = build
exports.enter = enter