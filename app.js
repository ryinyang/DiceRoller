var express = require('express')
var app = express()

app.get('/', function (req, res) {
	console.log('Got a GET request for the homepage')
	res.send('Hello GET')
})

app.post('/', function (req, res) {
	console.log('Got a POST request for the homepage')
	res.send('Hello POST')
})

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port

	console.log('Example app listening at http://%s:%s', host, port)
})