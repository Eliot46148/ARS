require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/authApi');
var formRouter = require('./routes/formApi');
var processorRouter = require('./routes/processor');
var functionRouter = require('./routes/functionApi');
var committeeRouter = require('./routes/committeeAPI');
var mailRouter = require('./routes/mailApi');
var progressRouter = require('./routes/progressApi');

var adminMongo = require("./adminMongo/app.js");

var app = express();

process.env.TZ = "Asia/Taipei";

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev', { skip: (req, res) => process.env.NODE_ENV === 'testing' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'controller')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/form', formRouter);
app.use('/processor', processorRouter);
app.use('/function', functionRouter);
app.use('/committee', committeeRouter);
app.use('/mailServerSecret', mailRouter);
app.use('/progress',progressRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});

const port = process.env.PORT;
app.listen(port, ()=> console.log(`port = ${port}`));

module.exports = app;
