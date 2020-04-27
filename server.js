var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/api/', (req, res) => {
  res.send('{a:1}');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(5000, () => {
  console.log('listening on *:5000');
});