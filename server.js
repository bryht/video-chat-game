var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, { path: '/api' });

var timers = [];

function getOrCreateTimer(key) {
  var item = timers[key];
  if (item) {
    return item;
  } else {
    timers[key] = {};
    timers[key].isPaused = false;
    timers[key].onChanged = null;
    timers[key].timer = setInterval(() => {
      if (!timers[key].isPaused) {
        if (timers[key].onChanged) {
          timers[key].onChanged()
        }
      }
    }, 1000);;
    return timers[key];
  }
}

function pauseTimer(key) {
  var item = timers[key];
  if (item) {
    item.isPaused = true;
  }
}

function startTimer(key) {
  var item = timers[key];
  if (item) {
    item.isPaused = false;
  }
}

function disposeTimer(key) {
  var item = timers[key];
  if (item) {
    clearInterval(item.timer);
    item = null;
  }
}

io.on('connection', (socket) => {

  console.log('a user connected');
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on('join', roomData => {

    socket.join(roomData.room);

    socket.on("line", data => {
      io.to(roomData.room).emit("line", data);
    });

    socket.on("canvas", data => {
      io.to(roomData.room).emit("canvas", data);
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

      let timer = getOrCreateTimer(roomData.room);
      if (!timer.onChanged) {
        timer.onChanged = () => {
          currentRoundTiming++;
          if (currentRoundTiming > timeLimit) {
            currentRound++;
            currentRoundTiming -= timeLimit;
          }
          var isFinished = (currentRound - 1) * timeLimit + currentRoundTiming >= total;
          console.log({ currentRound, timing: currentRoundTiming, isFinished });
          io.to(roomData.room).emit('gameRound', { currentRound, timing: currentRoundTiming, isFinished });
          if (isFinished) {
            disposeTimer(roomData.room);
          }
        }
      }
      socket.on('timer-pause', () => {
        pauseTimer(roomData.room);
      })

      socket.on('timer-start', () => {
        startTimer(roomData.room);
      })

    });


  })

});

http.listen(5000, () => {
  console.log('listening on *:5000');
});