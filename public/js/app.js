
var socket = io.connect()

var app = new Vue({
	el: '#app',
	data:{
		colorList:[
			{
				name: "yellow",
				color: "#FFEB8A"
			},
			{
				name: "pink",
				color: "#FAD2DA"
			},
			{
				name: "gray",
				color: "#DAE3EA"
			},
			{
				name: "blue",
				color: "#ABC5E8"
			}
		],
		postits: [],
		projects: [],
		nowId: -1,
		nowProjectId: 0,
		mousePos: {
			x: 0,
			y: 0
		},
		onPos:{
			x: 0,
			y: 0
		},
		margin: {
			marginLeft: 0,
			marginTop: 0
		},
		newContent: '',
		newTitle: '',
		hovered: false,
		profileClicked: false,
		profileForm: {
			display: "none"
		}
	},
	mounted: function(){
		let _this = this
		$.ajax({
	    	type: 'post',
	        data: JSON.stringify({}),
	        contentType: 'application/json',
	        url: './getProjects',
	        success: function(data) {
				_this.projects = data
	        }
	    })
	},
	watch: {
		mousePos(){
			//console.log('asdasdasda')
			if( this.nowId != -1){
				if( this.postits[this.nowId].pos.marginTop >= -240){
					//this.postits[this.nowId].pos.x = this.mousePos.x
					//this.postits[this.nowId].pos.y = this.mousePos.y
					//this.postits[this.nowId].locked = true
					this.move(this.nowId,this.mousePos.x,this.mousePos.y)
				}
			}
		},
		onPos(){

		}
	},
	methods:{
		postitCss(p){
			let fontSize = (240-60) / p.text.length
			if (fontSize <= 15 ) fontSize = 15
			return {
				marginLeft: p.pos.marginLeft + 'px',
				marginTop: p.pos.marginTop + 'px',
				left: p.pos.x + "px",
				top: p.pos.y + "px",
				fontSize: fontSize + 'px',
				lineHeight: (fontSize+5) + 'px',
				backgroundColor: this.colorList.find(i=>i.name == p.color).color,
				border: p.outline
			}
		},
		// click postit to get id
		selectId(i){
			this.nowId = i
			let x = this.postits[i].pos.x
			let y = this.postits[i].pos.y
			let ml = this.postits[i].pos.marginLeft
			let mt = this.postits[i].pos.marginTop 
			if( (mt - (this.mousePos.y - y)) >= -240 ) {
				this.postits[i].pos.marginLeft -= ( this.mousePos.x - x )
				this.postits[i].pos.marginTop -= ( this.mousePos.y - y )
				//console.log(this.postits[i].pos.marginTop)
				//this.postits[i].locked = true
			}
		},
		post(){
			if(this.newContent != ''){
				this.postits.push({
							text: this.newContent,
							color: "yellow",
							outline: "none",
							pos: {
								x: 20,
								y: 0,
								marginLeft: 50,
								marginTop: 50
							},
							locked: false
						})
				let _this = this
				let projectId = this.projects[_this.nowProjectId].id
				let content = {}
				content = {
							text: this.newContent,
							color: "yellow",
							outline: "none",
							pos: {
								x: 20,
								y: 0,
								marginLeft: 50,
								marginTop: 50
							},
							locked: false
						}
				$.ajax({
		        	type: 'post',
			        data: JSON.stringify(content),
			        contentType: 'application/json',
			        url: './addPostit/'+projectId+'',
			        success: function(data) {
						_this.newContent = ''
			        }
			    })
			}
		},
		remove(index){
			this.postits.splice(index,1)
		},
		hover(index){
			this.hovered = !this.hovered
			if(this.hovered){
				this.postits[index].outline = "2px solid #22C7A9"
			}else{
				this.postits[index].outline = "none"
			}

		},
		colorStyle(c){
			return {
				backgroundColor: c.color
			}
		},
		changeColor(c,i){
			this.postits[i].color = c.name
			let projectId = this.projects[this.nowProjectId].id
			let content = {}
			content.index = i
			content.color = c.name
			$.ajax({
		        	type: 'post',
			        data: JSON.stringify(content),
			        contentType: 'application/json',
			        url: './color/'+projectId+'',
			        success: function(data) {
			        	console.log('update color')
			        }
			    })
		},
		showForm(){
			this.profileClicked = true
			console.log('hi')
			this.profileForm = {
				display: "inline-block"
			}
		},
		move(index,x,y){
			const content = {}
			content.index = index
			content.x = x
			content.y = y
			socket.emit('move',content)
		},
		addProject(){
			if (this.newTitle != '') {
				let content = {}
				content = {
					title: this.newTitle,
					id: '',
					postits: []
				}
				console.log(content)
				let _this = this
				$.ajax({
			        type: 'post',
			        data: JSON.stringify(content),
			        contentType: 'application/json',
			        url: './build',
			        success: function(data) {
			        	console.log(_this.newTitle)
			        	_this.projects.push({
							title: _this.newTitle,
							active: false,
							id: data
						})
						_this.newTitle = ''
			        }
			    })
			}
		},
		titleActive(i){
			this.projects[this.nowProjectId].active = false
			this.projects[i].active = true
			this.nowProjectId = i
			let _this = this
			let id = this.projects[i].id
			let content = {}
			$.ajax({
		        type: 'post',
		        data: JSON.stringify(content),
		        contentType: 'application/json',
		        url: './getPostits/'+id+'',
		        success: function(data) {
		        	_this.postits = data
		        }
		    })
		}
	}
})


window.onmousemove = (event) => {
	//let id = app.nowId
	app.mousePos = { x: event.pageX , y: event.pageY}
	//console.log(app.mousePos) 
}

window.onmouseup = ()=>{
	if(app.nowId != -1){
		app.postits[app.nowId].locked = false
		let projectId = app.projects[app.nowProjectId].id
		let content = {}
		content.index = app.nowId
		content.x = app.mousePos.x
		content.y = app.mousePos.y
		$.ajax({
		        	type: 'post',
			        data: JSON.stringify(content),
			        contentType: 'application/json',
			        url: './position/'+projectId+'',
			        success: function(data) {
			        	console.log('update position')
			        }
			    })
		socket.emit('stop',{id: app.nowId})
	}
	app.nowId = -1
	//console.log(app.nowId)
}

window.onmousedown = ()=>{
	let x = app.mousePos.x
	let y = app.mousePos.y

	//use position to avoid form area
	if( (x >= 350 && y >= 350) || ( x >= 350 && y <= 350) || ( x <= 350 && y >= 350)){
		app.profileForm = {
			display: "none"
		}
	}
}

socket.on('someoneMove',(data)=>{
	let id = data.index
	app.nowId = id
	//console.log(app.postits[id].locked)
	//if(app.postits[id].locked){
		app.postits[id].locked = true
		app.postits[app.nowId].pos.x = data.x
		app.postits[app.nowId].pos.y = data.y
		/*app.mousePos = {
			x: data.x,
			y: data.y
		}*/
	//}
})

socket.on('stop',(data)=>{
	console.log('stop')
	app.nowId = -1
	app.postits[data].locked = false
})