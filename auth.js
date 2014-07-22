// passportで必要なもの
var flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	User = require('./dbschema').User;

// ハッシュ値を求めるために必要なもの
var crypto = require("crypto");
var secretKey = "miu_todo_list";	// シークレットは適当に変えてください
var getHash = function (target) {
	var sha = crypto.createHmac("sha256", secretKey);
	sha.update(target);
	return sha.digest("hex");
};

//passportでのセッション設定
//シリアライズの設定をしないと、user.passwordでパスワードがポロリする可能性があるので、必要な項目だけ持たせる
passport.serializeUser(function (user, done) {
	done(null, {email: user.username, _id: user._id});
});
passport.deserializeUser(function (serializedUser, done) {
	User.findById(serializedUser._id, function (err, user) {
		done(err, user);
	});
});

//LocalStrategyを使う設定
passport.use(new LocalStrategy(
	function (username, password, done) {
		//非同期で処理させるといいらしいです
		process.nextTick(function () {
			User.findOne({username: username}, function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {message: "Incorrect username."});
				}
				var hashedPassword = getHash(password);
				if (user.password !== hashedPassword) {
					return done(null, false, {message: "Incorrect password."});
				}
				return done(null, user);
			});
		});
	}
));

//リクエストがあったとき、ログイン済みかどうか確認する関数
var isLogined = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next(); // ログイン済み
	}
	//ログインしてなかったらログイン画面に飛ばす
	res.redirect("/login");
};