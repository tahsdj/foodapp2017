$(function(){
	$(window).scroll(function(){
	    let scrollVal = $(this).scrollTop()
	    let speed = 50
	    if( scrollVal >= 20 ) {
	        $("header.top").css({
	        	"background":"rgba(1,1,1,1)"
        	})
	    }else{
	    	$("header.top").css({
	    		"background": "rgba(0,0,0,0)"
	    		
        	})
	    }
	})
	$(window).scroll(function(){
	    let scrollVal = $(this).scrollTop()
	    let speed = 50
	    if( scrollVal >= 785 ) {
	        $("#sample1").css({
	        	"top": "590px",
	        	"left": "calc(20% - 75px)",
	        	"width": "130px",
	        	"height": "130px"
        	})
        	$("#sample2").css({
	        	"top": "590px",
	        	"left": "calc(40% + 60px)",
	        	"width": "130px",
	        	"height": "130px"
        	})
        	$("#sample3").css({
	        	"top": "590px",
	        	"left": "calc(40% + 200px)",
	        	"width": "130px",
	        	"height": "130px"
        	})
	    }else{
	    	$('.item').css({
	    		'top': '50px',
	    		'width': 'calc((100% - 60px)/3)',
	    		'height': '170px'
	    	})
	    	$("#sample1").css({
	        	"left": "0px",
        	})
        	$("#sample2").css({
	        	"left": "calc((100% - 60px)/3 + 10px)",
        	})
        	$("#sample3").css({
	        	"left": "calc((100% - 60px)*2/3 + 20px)",
        	})
	    }
	})
});

$(function(){
	$('.intros .member a').click(function(){
		const index = $(this).parents('.member').index()
		$(this).html('<br>')
		switch(index){
			case 0:
				$(this).parents('.intro').append('<p>你知道的太多了</p>')
				break
			case 1:
				$(this).parents('.intro').append('<p>沒有更多了</p>')
				break
			case 2:
				$(this).parents('.intro').append('<p>同上</p>')
				break
			case 3:
				$(this).parents('.intro').append('<a>更少..</a>')
				break
			case 4:
				$(this).parents('.intro').append('<p>忘了寫ㄏㄏ</p>')
				break
		}
	})
})
