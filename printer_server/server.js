var express=require('express'),
    app = express(),
    port = process.env.PORT || 4000;

var SerialPort=require('serialport'); 

var gcode = require('./gcode');

var pieces = new Array();

for(let i=0;i<10;i++){
	pieces.push({posx: i*10, posy: i*20, posz: i*2, container: i}); 
}

var bodyParser = require('body-parser')

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl +  ' not found'})
});*/

// Which port to listen on
app.set('port', process.env.PORT || 4000);

app.post("/", function (req, res) {
    console.log(req);
	gcode.generate(req.body);
	res.status=200;
	res.send();
});

var port = new SerialPort('/dev/ttyACM0', {baudRate: 250000});

port.open(function(err){
        if(err){
                return console.log("Error opening port : ", err.message);
        }
});

port.on('open', function(){
        //var toSend = gcode.generate(pieces);
        var toSend = "M360 \r\n";
	port.write(toSend);
});

port.on('data', function (data) {
  console.log('Data:', data);
});

// Start listening for HTTP requests
var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
