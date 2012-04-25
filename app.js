
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'cs391wp' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Bank Application Routes

app.get('/', routes.home);
app.get('/login', routes.home);
app.get('/index', routes.home);
app.get('/home', routes.home);

app.get('/create', routes.create);
app.get('/logout', routes.logout);
app.get('/profile', routes.profile);
app.get('/gpa', routes.gpa);
app.get('/est', routes.est);

app.post('/create', routes.create);
app.post('/login', routes.login);
app.post('/add-course', routes.add_course);
app.post('/calculate', routes.calculate);

app.get('/get-data', routes.get_data);


//almost forgot to set this back to 3000
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
