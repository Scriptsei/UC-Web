ws = require('ws').Server;
wss = new WebSocketServer({host:'127.0.0.1' ,port: 3031});

wss.on('connection', function(ws) {
  var thisId = ++clientId;

  ws.on('message', function(data, flags) {
    if (!flags.binary) {

    }
    else {
    }
  });

  ws.on('close', function() {
    console.log('Client #%d disconnected. %d files received.', thisId, filesReceived);
  });

  ws.on('error', function(e) {
    console.log('Client #%d error: %s', thisId, e.message);
  });
});
