var Busboy = Meteor.npmRequire("busboy");

var fieldnames = [];

Router.onBeforeAction(function (req, res, next) {
  var files = []; // Store files in an array and then pass them to request.

  var image = {}; // crate an image object
  if (!req.body) req.body = {};

  if (req.method === "POST" && req.url === "/bits/camli/upload") {
    console.log('req.headers = ' + JSON.stringify(req.headers));
    var busboy = new Busboy({ headers: req.headers });
    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

      image.mimeType = mimetype;
      image.encoding = encoding;

      // buffer the read chunks
      var buffers = [];

      file.on('data', function(data) {
        buffers.push(data);
      });
      file.on('end', function() {
        // concat the chunks
        image.data = Buffer.concat(buffers);
        // push the image object to the file array
        fieldnames.push({'blobRef': filename, 'size': image.data.length});
        files.push(image);
      });
    });

    busboy.on("field", function(fieldname, value) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(value));
      req.body[fieldname] = value;
    });

    busboy.on("finish", function () {
      // Pass the file array together with the request
      req.files = files;
      next();
    });
    // Pass request to busboy
    req.pipe(busboy);
  }
  else{
    this.next();
  }

});

Router.route('/bits/camli/enumerate-blobs', function(){

  console.log('################################################');
  console.log(this.request.method + ' ' + this.request.url);
  console.log(this.request.headers);
  console.log('this.request.query: ' + JSON.stringify(this.request.query));
  console.log('this.request.params: ' + JSON.stringify(this.params));

  console.log('------------------------------');
  console.log(this.request.body);
  console.log('------------------------------');

  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  this.response.end(JSON.stringify(
    {
      "blobs": [ ],
      "canLongPoll": false
    }
  ));

}, {where: 'server'});

Router.route('/bits/camli/stat', function(){

  console.log('################################################');
  console.log(this.request.method + ' ' + this.request.url);
  console.log(this.request.headers);
  console.log('this.request.query: ' + JSON.stringify(this.request.query));
  console.log('this.request.params: ' + JSON.stringify(this.params));

  console.log('------------------------------');
  console.log(this.request.body);
  console.log('------------------------------');

  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  this.response.end(JSON.stringify({
    "stat": [ ],
    "canLongPoll": false
  }));

}, {where: 'server'});

Router.route('/bits/camli/upload', function(){

  console.log('################################################');
  console.log(this.request.method + ' ' + this.request.url);
  console.log(this.request.headers);
  console.log('this.request.query: ' + JSON.stringify(this.request.query));
  console.log('this.request.params: ' + JSON.stringify(this.params));
  console.log('this.request.body: ' + JSON.stringify(this.request.body));
  //console.log('this.request.files: ' + JSON.stringify(this.request.files));

  console.log('------------------------------');
  console.log(this.request.body);
  console.log('fieldnames = ' + JSON.stringify(fieldnames));
  console.log('------------------------------');

  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "text/plain");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  this.response.end(JSON.stringify(
    {
      "received": fieldnames
    }
  ));

}, {where: 'server'});

Router.route('/bits/camli/:id', function(){

  console.log('################################################');
  console.log(this.request.method + ' ' + this.request.url);
  console.log(this.request.headers);
  console.log('this.request.query: ' + JSON.stringify(this.request.query));
  console.log('this.request.params: ' + JSON.stringify(this.params));

  console.log('------------------------------');
  console.log(this.request.body);
  console.log('------------------------------');

  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  this.response.end(JSON.stringify({ }));

}, {where: 'server'});
