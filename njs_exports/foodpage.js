
const fs = require('fs')
let isLogin = false
function checkLoginStatus(req,res){
	isLogin = false
	let user = {}
	 user.name = req.cookies?req.signedCookies.userid:'undefined'
	 isLogin = req.cookies?true:false
	/*if( req.signedCookies.userid && req.signedCookies.password ){
		user.name = req.signedCookie.userid
		isLogin = true
	}*/
	return user
}

const index = function(req,res){
	let user = checkLoginStatus(req,res)
	const postList = JSON.parse(fs.readFileSync('./articles.json'))
	res.render('index',{
		user: user.name,
		loginStatus: isLogin,
		posts: postList["posts"]
	})
}

exports.index = index