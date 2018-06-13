var express = require('express')
var path = require('path')
var app = express()
var port = process.env.PORT || 8000
var logger = require('morgan')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var spawn = require('child_process').spawn

var routes = require('./routes/index')
// var users = require('./routes/users')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// logger logs everything into console
app.use(logger('dev'))

// bodyParser allows us to read in the body easily
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// 
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', routes)

app.listen(port, function() {
	console.log('server started on port: ', port)
})

// Receives dice rolls and randomly generates number
// then sends sum back
app.post('/roll', function(req, res) {
	console.log('requested')
	console.log(req.body)
	dice = req.body
	sum = 0
	for (size in dice) {
		num = dice[size]
		for (i = 0; i < num; i++) {
			sum += Math.floor(Math.random() * size) + 1
		}
	}
	res.send(JSON.stringify(sum))
})


// V Failed attempt to get server to talk to python script
// app.post('/test.py', function(req, res) {
// 	console.log(typeof(req.body))
// 	dice = req.body
// 	txt = ''
// 	python = spawn('python', ['test.py'])

// 	python.stdout.on('data', function(data) {
// 		txt += data.toString()
// 	})

// 	python.stdout.on('end', function() {
// 		console.log(txt)
// 	})

// 	python.stdin.write('hello')
// 	python.stdin.end()
// })