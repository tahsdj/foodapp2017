const fs = require('fs')

const postList = JSON.parse(fs.readFileSync('./articles.json'))

const findPostPage = function(req,res){
	for( let i = 0 ; i < postList["posts"].length ; i ++ ){
		let post = postList["posts"][i]
		if ( post["id"] === req.params.id ){
			res.render('post_page',{
				content: post
			})
		}
	}
}
const findTradePage = function(req,res){
	for( let i = 0 ; i < postList["posts"].length ; i ++ ){
		let post = postList["posts"][i]
		if ( post["id"] === req.params.id ){
			res.render('trading_page',{
				content: post
			})
		}
	}
}

exports.findPostPage = findPostPage
exports.findTradePage = findTradePage