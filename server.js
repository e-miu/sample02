/*
 * load modules
 */
var http = require('http'),
	express = require('express'),
	settings = require('./settings.js'),
	mongoose = require('mongoose');

/*
 * create instance
 */
var app = express();
var server = http.createServer(app);

/*
 * request routing
 */
// every request
router.use(function (req, res, next) {
	console.log(req.method, req.url);	// log each request to the console
	next();	// continue doing what we were doing and go to the route
});

/*
 * apply router for todo
 */
require('./todo').start(app, express.Router());

/*
 * context root & client view
 */
app.get('/login', function (req, res) {
	res.sendfile('views/login.html');
});
app.get('/', function(req, res) {
	res.send('miu web server works!');
});
app.get('/view/*', function(req, res) {
	res.sendfile("./view/" + req.params[0]);
});

//connect db
mongoose.connect('mongodb://localhost/miutodo');

/*
 * start server
 */
server.listen(settings.PORT, function () {
	console.log('Server running.');
});