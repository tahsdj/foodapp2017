const doPreview = function (req, res) {
  res.render('preview',{
    logo_text: req.body['logo_text'],
    pic_path: req.body['pic_path'],
    food: req.body['food'],
		price: req.body['price'],
		number: req.body['number'],
    place: req.body['place'],
		time: req.body['time'],
    gettime: req.body['gettime'],
		suggest: req.body['suggest']
  })
}

exports.doPreview = doPreview
