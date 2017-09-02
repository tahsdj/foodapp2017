
//include mongodb modules  -> npm install -g mongoose
const mongoose = require('mongoose')

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/postit2')

//define data style
var project = mongoose.model('projects',{
	title: String,
	id: {
		type: String,
		default: ''
	},
	postits: [{
		text: String,
		color: String,
		outline: String,
		pos: {
			x: Number,
			y: Number,
			marginLeft: Number,
			marginTop: Number
		},
		locked: Boolean
	}]
})

var member = mongoose.model('members',{
	id: String,
	name: String,
	img_url: {
		type: String,
		default: ''
	},
	app_friends: Array,
	my_post: [{
		id: String,
		post_title: String,
		link: String
	}],
	attend_list: [{
		id: String,
		post_title: String,
		link: String
	}]
})

//member login & save
const login = function(req,res) {
	let newMember = new member(req)
	member.findOne({id: req.body.id},function(err,members) {
		if (err) {
			console.log(err)
		}
		else {
			if(members){
				res.cookie('userid',req.body.id,{path: '/',signed: true})
				res.cookie('username',req.body.name,{path: '/',signed: true})
				res.cookie('userimg',req.body.img_url,{path: '/',signed: true})
				res.redirect('/')
			}else{
				newMember.save((err,_member)=>{
					if(err) {
						console.log(err)
						res.send(err)
					}
					else{
						console.log('member insert success')
						res.cookie('userid',req.body.id,{path: '/',signed: true})
						res.cookie('username',req.body.name,{path: '/',signed: true})
						res.redirect('/')
					}
				})
			}
		}
	})
}

const build = function(req,res) {
	console.log(req.body)
	let newProject = new project(req.body)
	newProject.save((err,p)=>{
		if(err) {

		}else{
			console.log(p)
			console.log('insert success')
			let newID = JSON.stringify(p._id).slice(1,15)
			project.update({
				_id: p._id
			},{
				id: newID
			},(err,postit)=>{
				if(err)
					console.log(err)
				else{
					console.log(postit)
					console.log('update id success')
					res.send(newID)
				}
			})
		}
	})
}

const getPos = function(req,res) {
	const id = req.params.id
	let posts = []
	//console.log(user)
	project.findOne({id: id},(err,p) => {
		posts = p.postits
		res.send(posts)
	})
}

const getPro = function(req,res) {
	let posts = []
	//console.log(user)
	project.find((err,p) => {
		posts = p
		res.send(posts)
	})
}

const addPostit = function(req,res) {
	console.log(req.params.id)
	let reqId = req.params.id
	let content = req.body
	project.update({id: reqId},{$push: {postits: content}},{strict: false},(err,p)=>{
		if (err) {
			console.log(err)
		}else {
			console.log('add new postits')
			res.send('update postits success')
		}	
	})
}

const changeColor = function(req,res) {
	let projectId = req.params.id
	let content = req.body
	let updateContent = {}
    //use object dictionary way to add variable index
	updateContent['postits.'+content.index+'.color'] = content.color
	project.update({id: projectId},{$set:updateContent},{strict: false},(err,p)=>{
		if (err) {
			console.log(err)
		}else {
			res.send('update color')
		}
	})

}

const changePos = function(req,res) {
	let projectId = req.params.id
	let content = req.body
	let updateContent = {}
	updateContent['postits.'+content.index+'.pos.x'] = content.x
	updateContent['postits.'+content.index+'.pos.y'] = content.y
	project.update({id: projectId},{$set:updateContent},{strict: false},(err,p)=>{
		if (err) {
			console.log(err)
		}else {
			res.send('update color')
		}
	})
}

const updateImg = function(reqId,url,res) {
	post.update({id: reqId},{imgURL: url},{upsert:true},function(_err,_post) {
					if(_err)
						console.log(_err)
					else{
						//console.log('imgurl update success')
						res.redirect('/')
					}
				})
}

//get all post
function checkLoginStatus(req,res){
	let user = {}
	 user.id = req.cookies?req.signedCookies.userid:'undefined'
	 user.name = req.cookies?req.signedCookies.username:'undefined'
	 user.img = req.cookies?req.signedCookies.userimg:'undefined'
	 if(user.id) 
	 	user.isLogin = true
	 else
	 	user.isLogin = false
	/*if( req.signedCookies.userid && req.signedCookies.password ){
		user.name = req.signedCookie.userid
		isLogin = true
	}*/
	return user
}
const getAllPost = function(req,res) {
	let user = checkLoginStatus(req,res)
	let posts = []
	//console.log(user)
	post.find((err,post) => {
		posts = post
		res.render('new_index',{
			post: posts,
			user: user,
			loginStatus: user.isLogin
		})
	})
} 

// find post
const enter = function(req,res) {
	let reqId = req.params.id
	let user = checkLoginStatus(req,res)
	post.findOne({id: reqId},function(err,posts) {
		if (err) {
			console.log(err)
		}
		else {
			if(posts){
				res.render('new_post_index',{
					post: posts,
					id: posts.id,
					user: user,
					loginStatus: user.isLogin
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
	//**********REMEMBER CHANGE LOCALHOSY******************//
	let link = 'http://localhost:3333/food/'+reqId
	//****************************************************//
	let memberList = []
	let attend = {}
	post.findOne({id: reqId},function(err,posts) {
		if (err) {
			console.log(err)
		}
		else {
			if(posts){
				console.log(posts)
				let numberOfMember = posts.members + 1
				let content = {}
				content.id = req.body.id
				content.name = req.body.name
				content.offer = req.body.offer
				attend.id = reqId
				attend.post_title = posts.title
				attend.link = link
				//content = JSON.stringify(req.body)
				//content = JSON.parse(content)
				//$push: {arrayName: "content you wanna add in" }
				post.update({id: reqId},{members: numberOfMember,$push: {join_list: req.body}},{strict: false},function(_err,_post) {
					if(_err)
						console.log(_err)
					else{
						console.log('join data insert')
						member.update({id: req.body.id},{$push: {attend_list: attend}},{strict: false},function(err,member){
							console.log('insert to attend list')
							res.send('join success')
						})
					}
				})
			}else{
				res.redirect('/')
			}
		}
	})
}

//serch for post
const search = function(req,res) {
	let content = req.body.content
	post.find((err,posts)=>{
		if(err){
			console.log(err)
		}else{
			let data = []
			for(let i = 0 ; i < posts.length ; i++ ){
				if(posts[i].item_list.indexOf(content) != -1){
					data.push(posts[i])
				}
			}
			console.log(data)
			res.send(data)
		}
	})
}

const checkEvent = function(req,res){
	member.findOne({id: req.body.id},function(err,data){
		if(err){
			console.log(err)
		}else{
			let myNote = {}
			myNote.my_post = data.my_post
			myNote.attend_list = data.attend_list
			res.send(myNote)
		}
	})
}

exports.build = build
exports.addPostit = addPostit
exports.getPos = getPos
exports.getPro = getPro
exports.changeColor = changeColor
exports.changePos = changePos