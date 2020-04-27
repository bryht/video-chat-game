var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const namespace = io.of('/socket');

namespace.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on('join',roomData=>{
   
    socket.join(roomData.room);
    socket.on("line", data => {
      console.log(data);
      namespace.to(roomData.room).emit("line", data);
    });
  })

});

http.listen(5000, () => {
  console.log('listening on *:5000');
});