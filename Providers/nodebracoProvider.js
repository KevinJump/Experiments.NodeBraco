/*
 * nodebraco, presenting umbraco content via a nodejs/express site.
 *
 * uses the umbraco.config (cache) file to serve page data into your
 * views - and then you can use handlebars to present the site
 */

 var fs = require('fs');
 var path = require('path');
 var dom = require('xmldom').DOMParser;
 var xpath = require('xpath');

 var templates = require('../data/templates.json');

 var dataFile = '/data/umbraco.config';

 NodebracoProvider = function() {};

 NodebracoProvider.prototype.routes = [];

 NodebracoProvider.prototype.recurseNodes = function(node, url)
 {
   console.log( url, node.getAttribute('id'), node.getAttribute('nodeName'));
   var routeInfo = { url: url, id: node.getAttribute('id'), content: this.NodeToPojo(node, url)}
   this.routes[this.routes.length] = routeInfo;

   if ( node.hasChildNodes() )
   {
     for(var x=0; x < node.childNodes.length;x++)
     {
       if ( node.childNodes[x].nodeName.charAt(0) != '#')
       {
         var child = node.childNodes[x];

         if ( child.getAttribute('id') != '' )
         {
           if ( url == '/') {
             nodeUrl = '/' + child.getAttribute('urlName');
           }
           else {
             nodeUrl = url + '/' + child.getAttribute('urlName');
           }
           this.recurseNodes(child, nodeUrl);
         }
       }
     }
   }
 };

 NodebracoProvider.prototype.NodeToPojo = function(node, url)
 {
   var n = {};

   n.url = url;
   n.id = node.getAttribute('id');
   n.nodeName = node.getAttribute('nodeName');
   n.parentId = node.getAttribute('parentID');
   n.created = node.getAttribute('createDate');
   n.updated = node.getAttribute('updateDate');
   n.docType = node.getAttribute('nodeTypeAlias');
   n.template = this.GetTemplate(node.getAttribute('template'), n.docType);

   if (node.hasChildNodes())
   {

     for(var x=0;x < node.childNodes.length;x++)
     {
       if ( node.childNodes[x].nodeName.charAt(0) != '#')
       {
         if ( node.childNodes[x].getAttribute('id') != undefined)
         {
           var fieldNode = node.childNodes[x];
           // console.log('---> field: ', fieldNode.nodeName, fieldNode.textContent);
           // if it has no id - we treat it as a field....
           n[fieldNode.nodeName] = fieldNode.textContent;
         }
       }
     }
   }

   return n;
 };

 // search the routes based on an ID and return the object.
 NodebracoProvider.prototype.GetById = function(id, callback)
 {
   var result = null;
   for(var i=0;i<this.routes.length;i++)
   {
     if ( this.routes[i].id = id )
     {
       result = this.routes[i];
       break;
     }
   }
   callback(null, result);
 };

 NodebracoProvider.prototype.GetByUrl = function(url, callback)
 {
   console.log('looking for page:', url);
   var result = null;
   for(var i=0;i<this.routes.length;i++)
   {
     if ( this.routes[i].url == url)
     {
       result = this.routes[i];
       console.log("found route:", result.id);
       break;
     }
   }
   callback(null, result);
 };

 NodebracoProvider.prototype.GetTemplate = function(templateId, nodeAlias)
 {
   for(var i=0;i<templates.length;i++)
   {
     if( templates[i].id == templateId )
     {
       return templates[i].name
     }
   }
   return nodeAlias;
 }

 //
 // build the cache, and routing table,
 // so we can get content later
 //
  NodebracoProvider.prototype.refreshCache = function(cacheFile)
  {
    var filepath = path.join(__dirname, cacheFile);
    var provider = this;
    fs.readFile(filepath, 'ascii', function(err, data){

      var doc = new dom().parseFromString(data);
      var root = doc.childNodes[2];
      for(var x =0;x< root.childNodes.length;x++)
      {
        if ( root.childNodes[x].nodeName.charAt(0) != '#' ) {
          provider.recurseNodes(root.childNodes[x], '/');
        }
      }
    });
  };



new NodebracoProvider().refreshCache('../data/umbraco.config');
exports.NodebracoProvider = NodebracoProvider;
