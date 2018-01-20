var express=require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var pg = require('./lib/postgres');

var DATABASE_URL = 'postgres://pi:raspberry@localhost:5432/lego_api'

var bodyParser = require('body-parser')

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

var routes = require('./api/routes/legoRoutes');
routes(app);

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
