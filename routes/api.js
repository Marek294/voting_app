const express = require('express');
const router = express.Router();
const pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://dieozjsudtihso:5615d18a7044e548e29a1c721be174796b821e7544fa3d5c6d3b941b4e2499aa@ec2-23-23-227-188.compute-1.amazonaws.com:5432/d9ddsjlklolgs5?ssl=true';
//var connectionString = process.env.DATABASE_URL || 'postgres://postgres:larson@localhost:5432/voting_app';


router.get('/polls', function (req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        var query = client.query("SELECT * FROM polls");

        var results = [];
        query.on('row', function(row) {
            results.push(row);
        })

        query.on('end', function() {
            done();
            return res.send(results);
        })
    });
});

router.post('/polls', function (req, res, next) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        client.query("INSERT INTO polls(poll_title, create_date) VALUES($1, LOCALTIMESTAMP)", [req.body.poll_title]);

        var query = client.query("SELECT * FROM polls ORDER BY id desc LIMIT 1");

        var result;
        query.on('row', function(row) {
            result = row;

            result.options = [];

            req.body.options.map(function(option) {
                client.query("INSERT INTO options(poll_id, title) VALUES($1, $2)", [result.id, option.title]);
                result.options.push({poolId: result.id, title: option.title, clicks: 0});
            });
        });

        query.on('end', function() {
            done();
            return res.send(result);
        })
    });
});

router.put('/polls/:id', function (req, res, next) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        if(req.body.title) client.query("UPDATE polls SET poll_title=$1 WHERE id=$2", [req.body.title, req.params.id]);
        if(req.body.options) req.body.options.map(function(option) {
           if(option.id && option.title) client.query("UPDATE options SET title=$1, clicks=0 WHERE id=$2", [option.title, option.id]);
        });

        var poll_query = client.query("SELECT * FROM polls WHERE id=$1", [req.params.id]);
        var options_query = client.query("SELECT * FROM options WHERE poll_id=$1", [req.params.id]);

        var poll;
        poll_query.on('row', function(row) {
            poll = row;
        });

        var options = [];
        options_query.on('row', function(row) {
            options.push(row);
        });

        options_query.on('end', function() {
            done();
            return res.send({ poll: poll, options: options });
        })
    });
});

router.delete('/polls/:id', function (req, res, next) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        var query = client.query("SELECT * FROM polls WHERE id=$1 LIMIT 1", [req.params.id]);

        var result;
        query.on('row', function(row) {
            result = row;
        });

        client.query("DELETE FROM polls WHERE id=$1", [req.params.id]);
        client.query("DELETE FROM options WHERE poll_id=$1", [req.params.id]);

        query.on('end', function() {
            done();
            return res.send(result);
        })
    });
});

// Get one pool with options
router.get('/polls/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        var query = client.query("SELECT * FROM polls p INNER JOIN options o ON p.id = o.poll_id WHERE p.id=$1 ORDER BY o.id", [req.params.id]);
        var results = [];
        query.on('row', function(row) {
            results.push(row);
        })

        query.on('end', function() {
            done();
            return res.send(results);
        })
    });
});

// Increment click
router.put('/polls/option/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
       if(err) {
           done();
           console.log(err);
           return res.status(500).send({ success: false, data: err });
       }

       var query = client.query('SELECT * FROM options WHERE id=$1', [req.params.id]);

       var result;
       query.on('row', function(row) {
           result = row;

           result.clicks++;
           client.query('UPDATE options SET clicks=$1 WHERE id=$2', [result.clicks, req.params.id]);
       })

        query.on('end', function(row) {
           done();
           res.send(result);
        });
    });
});

module.exports = router;
