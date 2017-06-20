// nodejs modules
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs-extra')
const formidable = require('formidable')

//custom modules
const user = require('./njs_exports/user')
const trade = require('./njs_exports/trade')
const foodpage = require('./njs_exports/foodpage')
const map = require('./njs_exports/map')
const data = require('./njs_exports/data')
const mgDb = require('./njs_exports/mongodb_test')
const event = require('./njs_exports/event')
//const member = require('./njs_exports/member')
const imgur = require('./njs_exports/upload_imgur')
const app = express()
// remember install sockeio

/*
var server = require('http').createServer(app),
	io = require('socket.io').listen(server)

server.listen(3333,()=>{
	console.log('listen to port 3333')
})
*/




var edit = require('./njs_exports/edit')



//set the viewegin fiele path
app.set('views', __dirname + '/views')

//default view engine is jade
app.set('view engine', 'ejs')
app.use(express.static( __dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.cookieParser('secret'))
app.use(bodyParser.json())

// check use login or not

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


app.all('/', (req, res)=>{
	event.getAllPost(req,res)
 })

app.all('/foodpage',(req, res) =>{
	foodpage.index(req,res)
})
app.all('/login',(req,res) =>{
	res.render('login',{
		userName: '',
		userPassword: ''
	})
})
app.all('/food/:id',(req,res)=>{
	event.enter(req,res)
})

app.all('/register',(req,res) =>{
	res.render('register',{
		userName: '',
		userPassword: ''
	})
})

app.all('/trade/:id',(req,res) =>{
	data.findTradePage(req,res)
})
app.all('/foodpage/:id',(req,res)=>{
	data.findPostPage(req,res)
})

app.all('/like_clicked',(req,res)=>{
	event.clickLikes(req,res)
})
/*
app.all('/near',(req,res)=>{
	map.getLocation(req,res)
})
app.post('/deal',(req,res)=>{
	trade.check(req,res)
})*/
app.all('/edit', function(req,res) {
  //i modified the docs name from edit to edit_index
  let user = checkLoginStatus(req,res)
  console.log(user)
  res.render('edit_index',{
  	user: user,
  	loginStatus: user.isLogin
  })
})

//deal witdh event building
app.post('/build_event',function(req,res){
	event.build(req,res)
})

//check input id
app.post('/enter_event',function(req,res){
	event.enter(req,res)
})


app.post('/food/join_event/:id',function(req,res){
	event.join(req,res)
})

app.post('/doLogin',(req,res) =>{
	event.login(req,res)
})
app.post('/doRegister',(req,res) => {
	user.doRegister(req,res)
})

app.get('/ajax',(req,res) =>{
	res.send('hi'+req.query.name)
})

app.post('/doPreview',(req,res) => {
	edit.doPreview(req,res)
})

app.post('/search',(req,res)=>{
	event.search(req,res)
})

app.post('/find_my_event',(req,res)=>{
	event.checkEvent(req,res)
})

//upload post and images
app.post('/upload',  function(req, res) {
  var post_data = {}
  var id = ''
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    // Store post data
    console.log('upload object: '+ fields)
    /*Object.size = function(obj) {
	    let size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size
	}*/
	/*let numberOfotherlists = 5
	let size = Object.size(fields)
	let itemLength = size - numberOfotherlists
	let item = []
	for(let i = 0 ; i < itemLength ; i++ ){
		let _item = fields["item"+i+""]
		item.push(_item)
	}*/
	/*
	post_data.poster = fields.poster
	post_data.title = fields.title
	post_data.time = fields.time
	post_data.people_limit = fields.people_limit
	post_data.place = fields.place
	post_data.intro = fields.intro
	post_data.item_list = fields.item_list
    console.log(post_data)
    */
    event.build(fields,(getId)=>{
    	id = getId
    })
  });

  form.on('end', function(fields, files) {
    /* Temporary location of the upload file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the upload file */
    var file_name = this.openedFiles[0].name;
    /* Location where we put the uploaded file */
    var new_location = 'uploads/';

    // copy image to server
    fs.copy(temp_path, new_location + file_name, function(err) {
			if (err) {
        console.log(err);
      } else {
        // upload to imgur
        imgur.setup(req, res);
        imgur.upload(req, res, new_location + file_name, (link) => {
          post_data.pic_path = link;
          event.updateImg(id,link,res)
          console.log(link)
          // preview post
          //edit.doPreview(req, res, post_data, link);
        });
      }
    });
  });
});


// change cause of using io socket on the top 
var server = app.listen(3333, function() {
  console.log('Listening on port 3333')
})

/*
var number = 0 
var onlineList = []
io.sockets.on('connection',(socket)=>{
	console.log('someone connect')
	socket.on('new member',(data)=>{
		if (onlineList.indexOf(data) != -1 ){

		}else{
			console.log('data is: ' + data)
			//socket.emit just emit to one
			//io.sockets.emiit emit to all
			io.sockets.emit('chat',data +' '+'add')
			onlineList.push(data)
			socket.nickname = data
		 	updateMemberList()
		}
	})
	socket.on('disconnect',(data)=>{
		if(!socket.nickname) return
		io.sockets.emit('chat',socket.nickname+" "+"leave")

		//remove disconnected user
		onlineList.splice(onlineList.indexOf(socket.nickname),1)
		updateMemberList()
	})
})


function updateMemberList(){
	io.sockets.emit('list',onlineList)
	
}*/