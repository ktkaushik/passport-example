
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/index')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , flash = require('connect-flash');

var connection = mongoose.connect('mongodb://localhost/passports', {
  server: {
    poolSize: 3
  }
});

var LocalUserSchema = new mongoose.Schema({
  username: String,
  password: String
});

LocalUserSchema.methods.validPassword = function( pwd ) {
  return true;
};

var User = mongoose.model('User', LocalUserSchema);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

passport.use( new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        return done(err); 
      };
      if(!user) {
        return done(null, false, { message: 'incorrect Username'} );
      };

      if(!user.validPassword( password )){
        return done(null, false, {message: 'incorrect password'});
      };

      return done(null, user);
    })
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function printUsers(req, res, next) {
  User.findOne({} ,function(err, users) {
    if(err) throw err;
    console.log(users);
  });

  next();
};

function regUser (req, res, next) {
  var user = new User;
  user.username = 'kt';
  user.password = 'kt';
  user.save(function(err, me) {
    if (err) {
      throw err;
    } else{
      console.log('registered user');
      next();
    };
  });
};

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', regUser ,user.login);
app.post('/login', printUsers ,
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true }));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
