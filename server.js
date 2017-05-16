const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes/api');
const admin = require('./routes/admin');
const pg = require('pg');
const path = require('path');
const cookieParser = require('cookie-parser');

const  app = express();
// Connect to db
var connectionString = process.env.DATABASE_URL || 'postgres://dieozjsudtihso:5615d18a7044e548e29a1c721be174796b821e7544fa3d5c6d3b941b4e2499aa@ec2-23-23-227-188.compute-1.amazonaws.com:5432/d9ddsjlklolgs5?ssl=true';
//var connectionString = process.env.DATABASE_URL || 'postgres://postgres:larson@localhost:5432/voting_app';
var client = new pg.Client(connectionString);
client.connect();

app.set('port', (process.env.PORT || 4000));
app.use(express.static('build'));
app.set('views', './build')
app.use(bodyParser.json());
app.use(cookieParser());
// Initialize routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'build','index.html'));
})
app.use('/api', api);
app.use('/panel', admin);

// error handling middleware
app.use(function(err, req, res, next) {
    res.status(422).send({
        error: err.message
    });
});

app.listen(app.get('port'), function () {
    console.log("Server listening at port " + app.get('port'));
})
