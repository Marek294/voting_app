const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes/api');
const admin = require('./routes/admin');
const pg = require('pg');

const  app = express();
// Connect to db
var connectionString = process.env.DATABASE_URL || 'postgres://dvqgshfwpgkltv:04ee257db46f75888bf84d73e4667e570e65ab2790c31e5acd567b028ce7d96e@ec2-107-20-141-145.compute-1.amazonaws.com:5432/dd6bfmg39u5h21?ssl=true';
//var connectionString = process.env.DATABASE_URL || 'postgres://postgres:larson@localhost:5432/voting_app';
var client = new pg.Client(connectionString);
client.connect();

app.set('port', (process.env.PORT || 4000));
app.use(express.static('build'));
app.set('views', './build')
app.use(bodyParser.json());
// Initialize routes
app.get('/', function(req, res) {
    res.sendFile(`app/build/index.html`);
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
