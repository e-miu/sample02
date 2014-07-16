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
var router = express.Router();
var Schema = mongoose.Schema;

/*
 * db schema and model
 */
var TodoSchema = new Schema({
	content: { type: String, require: true },                //
	priority: { type: Number, min: 0, max: 3, default: 0 },  // 0: no priority, low priority 1 -> 3 high priority
	done: { type: Boolean, default: false }                  // is done ?
});
var Todo = mongoose.model('Todo', TodoSchema);

/*
 * connect db
 */
mongoose.connect('mongodb://localhost/sample02');

/*
 * request routing
 */
// every request
router.use(function (req, res, next) {
	console.log(req.method, req.url);	// log each request to the console
	next();	// continue doing what we were doing and go to the route
});

// home page
router.get('/', function (req, res, next) {
	res.sendfile("./view/index.html");
});

// todo list
router.route('/lists')
	// get all todo list ('R' of CRUD)
	.get(function (req, res) {
		Todo.find(function (err, todos) {
			if (err) {
				res.send(err);
				return;
			}
			res.json(todos);
		});
	})
	// create new todo ('C' of CRUD)
	.post(function (req, res) {
		var todo = new Todo();
		todo.content = req.body.todo_content;
		todo.priority = req.body.todo_priority || 0;
		todo.done = req.body.todo_done || false;
		todo.save(function (err) {
			if (err) {
				res.send(err);
				return;
			}
			res.json({status:0, message:'create new todo.'});
		});
	});

// todo item
router.param('todo_id', function (req, res, next, todo_id) {
	// validate :todo_id
	next();
});
router.route('/lists/:todo_id')
	// get specified todo ('R' of CRUD)
	.get(function (req, res) {
		Todo.findById(req.params.todo_id, function(err, todo) {
			if (err) {
				res.send(err);
				return;
			}
			res.json(todo);
		});
	})
	// update todo ('U' of CRUD)
	.put(function (req, res) {
		Todo.findById(req.params.todo_id, function(err, todo) {
			if (err) {
				res.send(err);
				return;
			}
			todo.content = req.body.todo_content;
			todo.priority = req.body.todo_priority || 0;
			todo.done = req.body.todo_done || false;
			todo.save(function (err) {	// update
				if (err) {
					res.send(err);
					return;
				}
				res.json({status:0, message:'update todo.'});
			});
		});
	})
	// delete todo ('D' of CRUD)
	.delete(function (req, res) {
		Todo.remove({_id: req.params.todo_id}, function (err, todo) {
			if (err) {
				res.send(err);
				return;
			}
			res.json({status:0, message:'successfully deleted.'});
		});
	});

/*
 * apply router for todo
 */
app.use('/todo', router);

/*
 * other request
 */
app.get('/', function(req, res) {
	res.send('miu web server works!');
});
app.get('/view/*', function(req, res) {
	res.sendfile("./view/" + req.params[0]);
});

/*
 * start server (port:8124, ip:localhost)
 */
server.listen(settings.PORT, 'localhost', function () {
	console.log('Server running.');
});