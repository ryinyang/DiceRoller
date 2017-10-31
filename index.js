var http = require('http')
var fs = require('fs')

const server = http.createServer((request, response) => {
	
	const { headers, method, url } = request;
	let body = [];

	var main = fs.readFile('public/index.html', function(err, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});


	request.on('error', (err) => {
		console.error(err);
	}).on('data', (chunk) => {
		body.push(chunk);
	}).on('end', () => {
		body = Buffer.concat(body).toString();
	});
}).listen(8080)