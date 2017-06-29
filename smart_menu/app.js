var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routeHelper = require("./routes/route.js");
var dateUtil = require('./utils/dateUtil.js');
var config = require('./Config.js');

/*全局变量*/
global.sql = require('./utils/sqlUtil.js');
global.date = dateUtil.getDate();
global.uploadFloder = config.imagePath;
global.iconFloder = config.iconPath;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(config.imagePath)));
app.use(express.static(path.join(config.iconPath)));

var ejs = require('ejs');
app.engine('html',ejs.__express);
app.set('view engine', 'html');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	cookie:{
		maxAge: 1000*60*30
	}
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.all('/*', function(req,res,next){
	if (!req.session.user && req.url != "/login" && req.url.indexOf("Api")==-1){
		res.redirect('/login');
	}else {
		next();
	}
});

app.use('/', routeHelper);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
