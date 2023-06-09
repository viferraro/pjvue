var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({ origin: '*' }));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mean');