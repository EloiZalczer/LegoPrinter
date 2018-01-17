var express=require('express'),
    app = express(),
    port = process.env.PORT || 3000;

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

app.listen(port);

console.log('Server started on port '+port);
