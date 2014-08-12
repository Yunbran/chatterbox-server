/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

// Server data storage:
var data = {};
data.results = [];

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */


  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  /* Without this line, this server wouldn't work. See the note below about CORS. */
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";

  if(request.url.indexOf('/classes/') === -1 &&  request.url !== "/"){
    console.log('URL',request.url,"does not contain /classes/",request.url==="/classes/messages");
    response.writeHead(404, headers);
    response.end("404: no-content");
  } else if (request.method === 'POST') {
    var body = "";
    request.on('data', function(chunk){
      body+=chunk;
    });
    request.on("end", function(){
      message = JSON.parse(body);
      message.createdAt = new Date();
      message.updatedAt = message.createdAt;
      message.objectId = data.results.length+1;
      data.results.push(message);
      /* .writeHead() tells our server what HTTP status code to send back */
      response.writeHead(201, headers);
      /* Make sure to always call response.end() - Node will not send
       * anything back to the client until you do. The string you pass to
       * response.end() will be the body of the response - i.e. what shows
       * up in the browser.*/
      response.end(JSON.stringify(data));
    });
  } else if (request.method === 'GET') {
    response.writeHead(200, headers);
    response.end(JSON.stringify(data));
  } else if (request.method === 'OPTIONS'){
    response.writeHead(200, headers);
    response.end("OPTIONS: no-content");
  } else {
    console.log('ERROR',request.url,"!== /classes/messages",request.url==="/classes/messages");
    response.writeHead(500, headers);
    response.end("500: no-content");
  }
};

// Export handleRequest to allow require from server file.
module.exports.handler = handleRequest;

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
