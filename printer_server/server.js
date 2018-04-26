var express=require('express'),
    app = express(),
    port = process.env.PORT || 4000;

var SerialPort=require('serialport'); 

var index=0; //Numero de ligne envoye
var toSend; //Donnees a envoyer, tableau de string

var gcode = require('./gcode');

/*var pieces = new Array();

for(let i=0;i<10;i++){
	pieces.push({posx: i*30+50.4, posy: i*30+7, posz: 0, container: i}); 
}*/

//gcode.generate(pieces);

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
	toSend = gcode.generate(req.body);
	var port = new SerialPort('/dev/ttyACM0', {baudRate: 250000,
                parity: 'none',
                rtscts: false,
                xon: false,
                xoff: false,
                xany: false,
                hupcl:false,
                rts: false,
                cts: false,
                dtr: false,
                dts: false,
                brk: false,
                databits: 8,
                stopbits: 1,
                buffersize: 256});

	port.open(function(err){
        	if(err){
		    res.status=500;
		    res.json({errors : ["Error opening port : "+ err.message] });
		    return console.log('Error opening port ', err.message);
        	}
	    res.status=200;
	    res.send();
	    console.log("Opening serial port");
	});

	port.on('open', function(){
        	//toSend = gcode.generate(pieces);
        	//sleep(10000);

        	setTimeout(function(){sendData(0);}, 10000);
	});

	function sendData(index){
        	//Send = "G91\nG1 X100\nM119\n";
        	if(index>=toSend.length)return;
        	console.log("Sending data : " + toSend[index]);
        	port.write(toSend[index]);
	}

	port.on('data', function (data) {
    		console.log('Data : '+ data);
    		if(data=="ok\n" || data=="ok" || data=="k\n" || data=="\nok"){
        		console.log("ok received");
        		index++;
        		sendData(index);
    		}
	});

});

              
// Start listening for HTTP requests
var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
