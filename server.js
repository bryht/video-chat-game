var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, { path: '/api' });

var games = [];

function getOrCreateGame(gameId) {
  var item = games[gameId];
  if (item) {
    return item;
  } else {
    var game = {};
    game.isPaused = false;
    game.onTimerChanged = null;
    game.startTimer = () => {
      game.timer = setInterval(() => {
        if (!game.isPaused) {
          if (game.onTimerChanged) {
            game.onTimerChanged()
          }
        }
      }, 1000);
    }
    game.stopTimer = () => {
      clearInterval(game.timer);
    };
    game.resumeTimer = () => {
      game.isPaused = false;
    };
    game.pauseTimer = () => {
      game.isPaused = true;
    };
    game.updateRoom = (room) => {
      game.room = room;
    };
    game.updateUser = (users) => {
      game.users = users;
    };
    game.updateRound = (round) => {
      game.round = round;
    }
    game.updateLins = (round, user, line) => {

    }
    game.dispose = () => {
      clearInterval(game.startTimer);
      game = null;
    }
    games[gameId] = game;
    return game;
  }
}


io.on('connection', (socket) => {

  console.log('a user connected');
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on('join', gameData => {

    var gameId = gameData.id;
    var game = getOrCreateGame(gameId);
    socket.join(gameId);

    socket.on("line", data => {
      io.to(gameId).emit("line", data);
    });

    socket.on("canvas", data => {
      io.to(gameId).emit("canvas", data);
    });

    socket.on("gameRoom", data => {
      game.updateRoom(data);
      io.to(gameId).emit("gameRoom", data);
    });
    socket.on("gameRound", data => {
      game.updateRound(data);
      io.to(gameId).emit("gameRound", data);
    });

    socket.on("initial", () => {
      if (game.room) {
        io.to(gameId).emit("gameRoom", game.room);
      }
      if (game.round) {
        io.to(gameId).emit("gameRound", game.round);
      }

    });

    socket.on("startGame", () => {
      const { round, roundTime } = game.room;
      let { currentRound, timing } = { currentRound: 1, timing: 0 };

      let total = round * roundTime;

      if (!game.onTimerChanged) {
        game.onTimerChanged = () => {
          timing++;
          if (timing > roundTime) {
            currentRound++;
            timing -= roundTime;
          }
          var isFinished = (currentRound - 1) * roundTime + timing >= total;
          console.log({ currentRound, timing, isFinished });
          io.to(gameId).emit('gameRound', { currentRound, timing, isFinished });
          if (isFinished) {
            game.stopTimer();
          }
        };
      }

      game.startTimer();

      socket.on('pauseTimer', () => {
        game.pauseTimer();
        console.log(game);
      })

      socket.on('resumeTimer', () => {
        game.resumeTimer();
        console.log(game);
      })

      socket.on('leaveRoom', () => {
        game.dispose();
      })

    });


  })

});

http.listen(5000, () => {
  console.log('listening on *:5000');
});