/*
//#todo var nconf = require('nconf');
// todo var winston = require('winston');

*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');



var routes = require('./routes/index');




var app = express();

app.use(expressSession({secret: 'thewaygoesup', saveUninitialized:true,  resave: true}));
app.use(bodyParser({limit: '50mb'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(express.methodOverride()); // поддержка put и delete ????
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname, 'public'));




app.use('/', routes);
app.use('*', routes);

/*
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
	//res.json({ error: 'Not found' });
    res.render('404.jade');
    next(err);
});

*/


/// error handlers

// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
*/

// production error handler
// no stacktraces leaked to user
/*
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/

module.exports = app;