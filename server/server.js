var express=require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var bodyParser = require('body-parser')

var pg = require('./lib/postgres');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

var routes = require('./api/routes/legoRoutes');
routes(app);

var DATABASE_URL = 'postgres://username:password@localhost/api'

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl +  ' not found'})
});

pg.initialize(DATABASE_URL, function(err) {
  if (err) {
    throw err;
  }

  // Which port to listen on
  app.set('port', process.env.PORT || 3000);

  // Start listening for HTTP requests
  var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
  });
});
