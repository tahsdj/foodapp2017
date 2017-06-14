
function initMap() {
	var position_center = {lat: 22.997846, lng: 120.218399};
	var map
    var styles =[
		  {
			"featureType": "administrative.land_parcel",
			"elementType": "labels",
			"stylers": [
			  {
				"visibility": "off"
			  }
			]
		  },
		  {
			"featureType": "landscape.man_made",
			"elementType": "geometry.fill",
			"stylers": [
			  {
				"color": "#f2f2f2"
			  }
			]
		  },
		  {
			"featureType": "poi",
			"elementType": "labels.text",
			"stylers": [
			  {
				"visibility": "off"
			  }
			]
		  },
		  {
			"featureType": "road.local",
			"elementType": "labels",
			"stylers": [
			  {
				"visibility": "off"
			  }
			]
		  }
		]; 
	  // Create a new StyledMapType object, passing it the array of styles,
	  // as well as the name to be displayed on the map type control.
	  var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

	  // Create a map object, and include the MapTypeId to add
	  // to the map type control.
	  var mapOptions = {
		zoom: 16,
		center: position_center,
		disableDefaultUI: true,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		}
	  };
	   map = new google.maps.Map(document.getElementById('map'),mapOptions);

	  //Associate the styled map with the MapTypeId and set it to display.
	  map.mapTypes.set('map_style', styledMap);
	  map.setMapTypeId('map_style');
    //----------------------------------------------------------
    /*map = new google.maps.Map(document.getElementById('map'), {
			center: _position,
			zoom: 16,
			disableDefaultUI: true
		 });*/
		/* initialize image*/
		let browserSupportFlag =  new Boolean();
		if(window.navigator.geolocation){
			browserSupportFlag =true;
			window.navigator.geolocation.getCurrentPosition(function(position){
			let initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
			let userPosition = {}
			let lat = position.coords.latitude
			let lng = position.coords.longitude
			let user_marker_img = "./images/user_marker.png"
			//userPosition =  {lat:_lat ,lng:_lng}; //使用者位置
			userPosition.lat = lat
			userPosition.lng = lng
			map.setCenter(initialLocation);
			let userMarker = new google.maps.Marker({
						position: userPosition,
						map: map,
						draggable: false,
						icon: user_marker_img
		            });
			}, function(){
				 handleNoGeolocation(browserSupportFlag);
			 })
		}else{
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag)
		}

	const location_lists = [
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
				lat: 23.003846,
				lng: 120.161323
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
				lat: 23.019846,
				lng: 120.251399
			},
			{
				lat: 22.959846,
				lng: 120.199846
			}
		]
	const titles = [
			'$100 瓦力套餐',
			'$200 看了就想吃餐盒',
			'$200 飯糰蛋糕',
			'$80 彗星炒飯',
			'$55 櫻桃蘋果蛋塔',
			'$70 特級麻婆豆腐',
			'$70 鳳凰水晶',
			'$125 炭烤薰香鴨肉',
		]
	 drawMarker(map,location_lists,titles)
 }
 //const location_lists = <%- JSON.stringify(locations) %>

 /*function getMarker(map){
 	$.ajax({
 		url: '/get-marker',
 		type: 'POST',
 		dataType: 'json',
 		data: '',
 		contenType: '',
 		complete: function(data){
 			console.log('success')
 			drawMarker(map,data)
 		},
 		error: function(){
 			console.log('error')
 		}
 	})
 }*/

function drawMarker(map,data1,data2){
 	const data_length = data1.length
 	for( let i = 0 ; i < data_length ; i++ ){
 		let position = data1[i]
 		let title = data2[i]
 		let marker = new google.maps.Marker({
 			position: position,
 			map: map,
			draggable: false,
 		})
 		let infoWindow = new google.maps.InfoWindow({
 			content: title
 		})
 		marker.addListener('click',()=>{
 			infoWindow.open(map,marker)
 		})
 		$('.postBoard > .posts').eq(i).hover(()=>{
 			infoWindow.open(map,marker)
 		},()=>{
 			infoWindow.close()
 		})
 		//infoWindow.open(map,marker)
 	}
}