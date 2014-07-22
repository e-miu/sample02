// connect db & load db schema
var Todo = require('./dbschema').Todo;

// apply router
exports.start = function (app, router) {

	// every request
	router.use(function (req, res, next) {
		// user authentication
		next();
	});

	// client home page
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

	// apply router to /todo
	app.use('/todo', router);
};
