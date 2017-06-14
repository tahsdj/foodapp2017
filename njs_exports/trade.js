
const check = function(req,res){
	const req_content = req.body
	const perPrice = parseInt(req_content["perPrice"])
	let returnContent = {}
	returnContent.name = req_content['userName'],
	returnContent.product = req_content["product"]
	returnContent.time = "18:30~20:00"
	returnContent.amount = req_content["amount"]
	returnContent.price = perPrice*req_content["amount"],
	returnContent.contact = req_content['contact']
	res.send(returnContent)
}

exports.check = check