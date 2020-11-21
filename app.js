require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');

var indexRouter = require('./routes/index');
var authModule = require('./routes/authApi');
var formRouter = require('./routes/formApi');
var processorRouter = require('./routes/processorApi');
var functionRouter = require('./routes/functionApi');
var committeeRouter = require('./routes/committeeAPI');
var mailRouter = require('./routes/mailApi');
var progressRouter = require('./routes/progressApi');

var app = express();

process.env.TZ = "Asia/Taipei";

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// environment library setup
app.use(logger('dev', { skip: (req, res) => process.env.NODE_ENV === 'testing' }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'controller')));
app.use(express.static(path.join(__dirname, 'uploads')));

// passport authentication setup
app.use(session({ 
  secret: 'nksnfoiehhrekwqnrlkje',
  resave: false,
  saveUninitialized: true
}));
passport.use('login', authModule.strategy);
passport.serializeUser(authModule.serializeUser);
passport.deserializeUser(authModule.deserializeUser);
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/processor');
}

// api routers setup
app.use('/', indexRouter);
app.use('/auth/login', passport.authenticate('login'), function(req, res){
  authModule.login(req.body.username, req.body.password).then(function(respond){
     if (respond){
         res.status(200).send({ "username": req.body.username });
     }else
         res.status(500);
  });
});
app.use('/auth', authModule.router);
app.use('/form', formRouter);
app.use('/processor', function(req, res, next) {
  res.render('processor/index', { title: 'Express' });
});
app.use('/processorFunction', ensureAuthenticated, processorRouter);
app.use('/function', functionRouter);
app.use('/committee', committeeRouter);
app.use('/mailServerSecret', mailRouter);
app.use('/progress', progressRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});

const port = process.env.PORT;
app.listen(port, () => console.log(`port = ${port}`));

module.exports = app;
