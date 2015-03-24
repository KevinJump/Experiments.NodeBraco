var express = require('express');
var router = express.Router();

var NodebracoProvider = require('../providers/NodebracoProvider').NodebracoProvider;

var nodebracoProvider = new NodebracoProvider();

/* GET home page. */
router.get('*', function(req, res, next) {

  console.log(req.path);

  // res.render('index', { title: 'Express' });

  var node = nodebracoProvider.GetByUrl(req.path, function(err, node){
     // res.send(node);
     res.render(node.content.template, {currentPage: node.content});
  });

});

module.exports = router;
