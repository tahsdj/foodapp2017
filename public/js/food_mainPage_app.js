(() => {
	let clicked = false
	$('#nav-list-btn').click(() => {
		if (!clicked) {
			$('#rwdList').css({
				"display":"inherit"
			})
			clicked = true
		}else{
			$('#rwdList').css({
				"display":"none"
			})
			clicked = false
		}
	})
	$('.mainPage').click(() => {
		$('#rwdList').css({
			"display":"none"
		})
		clicked = false
	})
})()