
//include mongodb modules  -> npm install -g mongoose
const mongoose = require('mongoose')

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test')

//define data style
var post = mongoose.model('articles',{
	title: String,
	poster: String,
	time: String,
	place: String,
	intro: String,
	imgURL: String,
	list: Array,
	members:{
		type: Number,
		default: 1
	},
	id: String,
	joinList: Array,
	likes: {
		type: Number,
		default: 0
	},
	like_list: Array,
	item: Array
})

const build = function(req,resId) {
	//console.log(req.body)
	let newPost = new post(req)
	newPost.save((err,posts)=>{
		if(err) {
			console.log(err)
			res.send(err)
		}
		else{
			console.log('insert success')
			let newID = JSON.stringify(posts._id).slice(1,15) //slice to first 1 to 8 string
			post.update({_id: posts._id},{id: newID},function(err,_post) {
				if (err) 
					console.log(err)
				else {
					console.log(newID)
					resId(newID)
					console.log('update success')
				}
			})
		}
	})
}

const updateImg = function(reqId,url,res) {
	post.update({id: reqId},{imgURL: url},{upsert:true},function(_err,_post) {
					if(_err)
						console.log(_err)
					else{
						console.log('imgurl update success')
						res.redirect('/')
					}
				})
}

//get all post
const getAllPost = function(req,res) {
	let posts = []
	post.find((err,post) => {
		posts = post
		res.render('new_index',{
			post: posts
		})
	})
} 

// find post
const enter = function(req,res) {
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

const clickLikes = function(req,res) {
	let likes = 0
	let liked = false
	post.findOne({id: req.body.id},(err,thisPost)=>{
			likes = thisPost.likes
			if(thisPost.like_list.indexOf(req.body.user) != -1 ){
				liked = true
				likes--
				//remove user from like list
				post.update({id: req.body.id},{likes: likes,$pull: {like_list: req.body.user} },{upsert:true},function(_err,_post) {
					if(_err)
						console.log(_err)
					else{
						res.send(false)
					}
				})
			}else{
				liked = false
				likes++
				//add use to like list
				post.update({id: req.body.id},{likes: likes,$push: {like_list: req.body.user} },{upsert:true},function(_err,_post) {
					if(_err)
						console.log(_err)
					else{
						res.send(true)
					}
				})
			}
		})
}

const join = function(req,res) {
	let reqId = req.params.id
	let memberList = []
	post.findOne({id: reqId},function(err,posts) {
		if (err) {
			console.log(err)
		}
		else {
			if(posts){
				let numberOfMember = posts.members + 1
				let content = {}
				content = JSON.stringify(req.body)
				content = JSON.parse(content)
				console.log(content)
				//$push: {arrayName: "content you wanna add in" }
				post.update({id: reqId},{$push: {joinList: content},members: numberOfMember},{upsert:true},function(_err,_post) {
					if(_err)
						console.log(_err)
					else{
						console.log('join data insert')
						res.send('join success')
					}
				})
			}else{
				res.redirect('/')
			}
		}
	})
}

exports.build = build
exports.enter = enter
exports.join = join
exports.updateImg = updateImg
exports.getAllPost = getAllPost
exports.clickLikes = clickLikes