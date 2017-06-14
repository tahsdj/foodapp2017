$(()=>{
	
	//find the rest of amount
	const content = $('#amount-of-products > div').text()
	const amount = parseInt(content)
	let options = ''

	//show the number of select list 
	for ( let i = 0 ; i < amount ; i++ ){
		options += '<option value = '+(i+1)+'>'+(i+1)+'</option>'
	}
	$('#amount').html(options)
});

(function(){
	$('#next').click(()=>{
		const name = $('#name').val()
		const psd = $('#password').val()
		const mail = $('#mail').val()
		const phone = $('#phoneNumber').val()
		if ( name && psd && mail && phone) {
			$('.trade').css({
			'z-index':"2"
			})
			$('.creditCardBox').css({
				'z-index':"1"
			})
			$('.steps > .step1').css({
				"background-color":"#C1C4C8"
			})
			$('.steps > .step2').css({
				"background-color":"#2471A3"
			})
			$('#remind1').html('')
		}else{
			$('#remind1').html('請填寫完所有表格~')
		}
	})
	$('#previous').click(()=>{
		$('.trade').css({
			'z-index':"1"
		})
		$('.creditCardBox').css({
			'z-index':"2"
		})
		$('.steps > .step2').css({
			"background-color":"#C1C4C8"
		})
		$('.steps > .step1').css({
			"background-color":"#2471A3"
		})
	})
	$('#complete').click(()=>{
		let form_content = {
			userName: $('#name').val(),
			password: $('#password').val(),
			mail: $('#mail').val(),
			phoneNumber: $('#phoneNumber').val(),
			amount: $('#amount').val(),
			product: $('.info>.content>.title').text(),
			perPrice: $('#products-price > div').text(),
			contact: $('#contact-phoneNumber > div').text()
		}
		$.post('/deal',form_content,(data,status)=>{
			alert("預定完成~~ 請確認一下資料")
			let content = ''
			$('.main > .container > .infoBox > .userProfile').html('')
			$('.main > .container > .steps').remove()
			$('.main > .container > .inputBox').remove()
			content += '<h3 class = "title">交易清單</h3>'
			content += '<ul>' 
			content += '<li style = "padding: 10px 5px;"><label>預定者:</label>'+'<div>'+ data.name + '</div></li>'
			content += '<li style = "padding: 10px 5px;"><label>預定食物:</label>'+'<div>'+ data.product + '</div></li>'
			content += '<li style = "padding: 10px 5px;"><label>享用時間:</label>'+'<div>'+ data.time + '</div></li>'
			content += '<li style = "padding: 10px 5px;"><label>消費數量:</label>'+'<div>'+ data.amount + '</div></li>'
			content += '<li style = "padding: 10px 5px;"><label>總價:</label>'+'<div>'+ data.price + '</div></li>'
			content += '<li style = "padding: 10px 5px;"><label>聯絡資訊:</label>'+'<div>'+ data.contact + '</div></li>'
			content += '</ul>'
			$('.main > .container > .infoBox > .info > .content').html(content)
			$('.main > .container').append('<a href="/foodpage" style="line-height: 70px;">回首頁</a>')
		})
	})
})()