

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
const getLocation = function(req,res){
	const postList = JSON.parse(fs.readFileSync('./articles.json'))
	let user = checkLoginStatus(req,res)
	res.render('map_index',{
		locations: [
			{
				lat: 22.997846,
				lng: 120.218399
			},
			{
				lat: 22.994846,
				lng: 120.222399
			},
			{
				lat: 22.969846,
				lng: 120.238399
			},
			{
				lat: 22.973846,
				lng: 120.241323
			},
			{
				lat: 22.979843,
				lng: 120.221389
			},
			{
				lat: 22.979846,
				lng: 120.221399
			},
			{
				lat: 22.959846,
				lng: 120.251399
			},
			{
				lat: 22.959846,
				lng: 22.959846
			},
		],
		posts: postList["posts"],
		user: user.name,
		loginStatus: isLogin,
	})
}

exports.getLocation = getLocation