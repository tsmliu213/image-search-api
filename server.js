"use strict";
var express = require('express');
var bing = require('./bing.js');

var app = express();

bing.imgSearch();

