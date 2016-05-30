var express = require('express');

var app = express();
app.use('/', express.static('../app/'));
app.use('/bower_components', express.static('../bower_components/'));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var expressions = [
    ];

app.get('/expressions', function (req, res) {
    'use strict';
    
    res.send(expressions);
});

app.post('/expressions', jsonParser, function (req, res) {
    'use strict';
    
    if (!req.body) {
        return res.sendStatus(400);
    }
    expressions.push(req.body);

    io.emit('expression', req.body);
    return res.sendStatus(200);
});

http.listen(3000, function () {
    'use strict';
});