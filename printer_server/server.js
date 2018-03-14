/*var express=require('express'),
    app = express(),
    port = process.env.PORT || 4000;
*/
var gcode = require('./gcode');

var pieces = new Array();

for(let i=0;i<10;i++){
	pieces.push({posx: i*10, posy: i*20, posz: i*2, container: i}); 
}

gcode.generate(pieces);

//var bodyParser = require('body-parser')

//app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);
//app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
//app.use(bodyParser.json())

/*app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl +  ' not found'})
});

// Which port to listen on
app.set('port', process.env.PORT || 4000);

app.post("/", function (req, res) {
    console.log(req);
	gcode.generate(req.body);
});

// Start listening for HTTP requests
var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
*/
