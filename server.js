var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, { path: '/api' });

io.on('connection', (socket) => {

  console.log('a user connected');
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on('join', roomData => {

    socket.join(roomData.room);

    socket.on("message", data => {
      io.to(roomData.room).emit("message", data);
    });

    socket.on("gameRoom", data => {
      io.to(roomData.room).emit("gameRoom", data);
    });
    socket.on("gameRound", data => {
      io.to(roomData.room).emit("gameRound", data);
    });

    socket.on("timer-start", config => {
      const { roundNumber, timeLimit } = config;
      let currentRound = 1;
      let currentRoundTiming = 0;
      let total = roundNumber * timeLimit;
      let timer = setInterval(() => {

        currentRoundTiming++;
        if (currentRoundTiming > timeLimit) {
          currentRound++;
          currentRoundTiming -= timeLimit;
        }
        var isFinished = (currentRound - 1) * timeLimit + currentRoundTiming >= total;
        console.log({ currentRound, timing: currentRoundTiming, isFinished });
        io.to(roomData.room).emit('gameRound', { currentRound, timing: currentRoundTiming, isFinished });
        if (isFinished) {
          clearInterval(timer);
        }
      }, 1000);

      socket.on('timer-stop', () => {
        if (timer) {
          clearInterval(timer);
        }
      })

    });


  })

});

http.listen(5000, () => {
  console.log('listening on *:5000');
});