const imgur = require('imgur')

const setup = function(req, res) {
  imgur.setAPIUrl('https://api.imgur.com/3/')
  imgur.setCredentials('uiddgroupc@gmail.com', 'foodsharing2017', '7411efce4e05c15') 
}

const upload = function(req, res, file_path, cb) {
  imgur.uploadFile(file_path)
    .then(function (json) {       
       cb(json.data.link)
    })
    .catch(function (err) {
      console.log(err.message)
    })
}

exports.setup = setup
exports.upload = upload