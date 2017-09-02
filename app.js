// nodejs modules
const express = require('express')
const bodyParser = require('body-parser')
// export js 
const database = require('./njs_exports/database')
//custom modules
const app = express()
// remember install sockeio

 
var server = require('http').createServer(app),
	io = require('socket.io').listen(server)

server.listen(3333,()=>{
	console.log('listen to port 3333')
})





//set the viewegin fiele path
app.set('views', __dirname + '/views')

//default view engine is jade
app.set('view engine', 'ejs')
app.use(express.static( __dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(express.cookieParser('secret'))
app.use(bodyParser.json())

// check use login or not

app.all('/',(req,res)=>{
	res.render('index',{})
})

app.post('/getProjects',(req,res)=>{
	database.getPro(req,res)
})

app.post('/build',(req,res)=>{
	database.build(req,res)
})

app.post('/addPostit/:id',(req,res)=>{
	database.addPostit(req,res)
})

app.post('/getPostits/:id',(req,res)=>{
	database.getPos(req,res)
})

app.post('/color/:id',(req,res)=>{
	database.changeColor(req,res)
})

app.post('/position/:id',(req,res)=>{
	database.changePos(req,res)
})

// change cause of using io socket on the top 
/*var server = app.listen(3333, function() {
  console.log('Listening on port 3333')
})*/


var number = 0 
var onlineList = []
io.sockets.on('connection',(socket)=>{
	//console.log('someone connect')
	socket.on('move',(data)=>{
		if (onlineList.indexOf(data) != -1 ){

		}else{
			//console.log('data is: ' + data.x + ' ' + data.y)
			//socket.emit just emit to one
			//io.sockets.emiit emit to all
			io.sockets.emit('someoneMove', data)
			//onlineList.push(data)
			//socket.nickname = data
		 	//updateMemberList()
		}
	})

	socket.on('stop',(data)=>{
		io.sockets.emit('stop',data.id)
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
	
}