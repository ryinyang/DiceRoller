var express = require('express')
var path = require('path')
var app = express()
var port = process.env.PORT || 8000
var logger = require('morgan')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

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