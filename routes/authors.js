var express = require('express');
var authors = express.Router();


/* GET home page. */
authors.get('/', function(req, res) {
  res.render('authors', { title: 'Autores' });
});


module.exports = authors;
