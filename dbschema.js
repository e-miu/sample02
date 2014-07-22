// load module
var Schema = require('mongoose').Schema;

// define schema
var TodoSchema = new Schema({
	content: { type: String, required: true },                //
	priority: { type: Number, min: 0, max: 3, default: 0 },  // 0: no priority, low priority 1 -> 3 high priority
	done: { type: Boolean, default: false }                  // is done ?
});
var UserSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true }
});

// export db model
exports.Todo = mongoose.model('Todo', TodoSchema);
exports.User = mongoose.model('User', UserSchema);