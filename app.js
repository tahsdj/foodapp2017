
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const user = require('./njs_exports/user')
const trade = require('./njs_exports/trade')
const foodpage = require('./njs_exports/foodpage')
const map = require('./njs_exports/map')
const data = require('./njs_exports/data')
const mgDb = require('./njs_exports/mongodb_test')
const event = require('./njs_exports/event')
const app = express()





var edit = require('./njs_exports/edit')



//set the viewegin fiele path
app.set('views', __dirname + '/views')

//default view engine is jade
app.set('view engine', 'ejs')
app.use(express.static( __dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.cookieParser('secret'))
app.use(bodyParser.json())
app.all('/', (req, res)=>{
	mgDb.test(req,res)
	//res.render('index_mainPage')
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
app.all('/near',(req,res)=>{
	map.getLocation(req,res)
})
app.post('/deal',(req,res)=>{
	trade.check(req,res)
})
app.all('/edit', function(req,res) {
  //i modified the docs name from edit to edit_index
  res.render('edit_index')
})

//deal witdh event building
app.post('/build_event',function(req,res){
	event.build(req,res)
})

//check input id
app.post('/enter_event',function(req,res){
	event.enter(req,res)
})

app.post('/join_event/:id',function(req,res){
	event.join(req,res)
})

app.post('/doLogin',(req,res) =>{
	user.doLogin(req,res)
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


var server = app.listen(3333, function() {
  console.log('Listening on port 3333')
})
