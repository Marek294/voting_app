const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://dieozjsudtihso:5615d18a7044e548e29a1c721be174796b821e7544fa3d5c6d3b941b4e2499aa@ec2-23-23-227-188.compute-1.amazonaws.com:5432/d9ddsjlklolgs5?ssl=true';
//var connectionString = process.env.DATABASE_URL || 'postgres://postgres:larson@localhost:5432/voting_app';

router.post('/authenticate', function(req, res, next) {

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        var query = client.query("SELECT * FROM admins WHERE username=$1 LIMIT 1",[req.body.username]);

        var result;
        query.on('row', function(row) {
            result = row;
        })

        query.on('end', function() {
            done();
            if(result) {
                bcrypt.compare(req.body.password, result.password, function(err, isMatch) {
                    if(isMatch) {
                        var token = jwt.sign( { data: token, username: result.username }, 'secret', { expiresIn: 60 * 60 });

                        res.send({ success: true,
                            message: 'authentication success',
                            token: token
                        });

                    } else res.status(401).send({ message: "Wrong username or password" });
                });
            } else res.status(401).send({ message: "Wrong username or password" });
        })
    });
});

router.use(function(req, res, next) {
    var token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, 'secret', function (err, decoded) {
            if (err) {
                console.log(err);
                if (err.name = 'TokenExpiredError') {
                    return res.status(401).send('Unauthorized');
                }
                else {
                    console.log(err);
                    return res.status(403).send('Forbidden');
                }
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else return res.status(403).send('Forbidden');
});

router.get('/admins', function (req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        var query = client.query("SELECT * FROM admins WHERE username!=$1 ORDER BY id",[req.decoded.username]);

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

router.get('/admins/:id', function (req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        var query = client.query("SELECT * FROM admins WHERE id=$1 LIMIT 1",[req.params.id]);

        var result;
        query.on('row', function(row) {
            result = row;
        })

        query.on('end', function() {
            done();
            return res.send(result);
        })
    });
});

router.post('/admins', function (req, res, next) {
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                done();
                console.log(err);
                return res.status(500).send({ success: false, data: err });
            }

            client.query("INSERT INTO admins(username, password) values($1, $2)", [req.body.username, hash]);

            var query = client.query("SELECT * FROM admins ORDER BY id desc LIMIT 1");
            var result;
            query.on('row', function(row) {
                result = row;
            })

            query.on('end', function() {
                done();
                return res.send(result);
            })
        });
    });
});

router.put('/admins/:id', function (req, res, next) {
    if(req.body.password)
        bcrypt.hash(req.body.password, null, null, function(err, hash) {
            pg.connect(connectionString, function(err, client, done) {
                if(err) {
                    done();
                    console.log(err);
                    return res.status(500).send({ success: false, data: err });
                }

                client.query("UPDATE admins SET username=$1, password=$2 WHERE id=$3", [req.body.username, hash, req.params.id]);

                var query = client.query("SELECT * FROM admins WHERE id=$1 LIMIT 1", [req.params.id]);
                var result;
                query.on('row', function(row) {
                    result = row;
                })

                query.on('end', function() {
                    done();
                    return res.send(result);
                })
            });
        });
    else
        pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        client.query("UPDATE admins SET username=$1 WHERE id=$2", [req.body.username, req.params.id]);

        var query = client.query("SELECT * FROM admins WHERE id=$1 LIMIT 1", [req.params.id]);
        var result;
        query.on('row', function(row) {
            result = row;
        })

        query.on('end', function() {
            done();
            return res.send(result);
        })
        });
});

router.delete('/admins/:id', function (req, res, next) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).send({ success: false, data: err });
        }

        var query = client.query("SELECT * FROM admins WHERE id=$1 LIMIT 1", [req.params.id]);

        var result;
        query.on('row', function(row) {
            result = row;
        });

        client.query("DELETE FROM admins WHERE id=$1", [req.params.id]);

        query.on('end', function() {
            done();
            return res.send(result);
        })
    });
});

module.exports = router;
