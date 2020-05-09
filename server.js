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
    game.updateUser = (user) => {
      var index = game.users.findIndex(p => p.uid === user.uid);
      if (index > -1) {
        game.users[index] = user;
      } else {
        game.users.push(user);
      }
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

function setNextPlayer(users) {

  users.sort((a, b) => {
    if (a.uid < b.uid) { return -1; }
    if (a.uid > b.uid) { return 1; }
    return 0;
  });

  let playingIndex = users.findIndex(p => p.userState === 1);
  let nextPlayingIndex = playingIndex + 1 >= users.length ? 0 : playingIndex + 1;

  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    if (index === playingIndex) {
      element.userState = 0;
    }
    if (index === nextPlayingIndex) {
      element.userState = 1;
    }
  }
  return users;
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
      console.log(data);
      game.updateRoom(data);
      io.to(gameId).emit("gameRoom", data);
    });

    socket.on("gameRound", data => {
      game.updateRound(data);
      io.to(gameId).emit("gameRound", data);
    });

    socket.on("gameUserUpdate", data => {
      game.updateUser(data);
      io.to(gameId).emit("gameUsers", game.users);
    });

    socket.on("initialGame", (data) => {
      if (!game.room) {
        game.room = data.gameRoom;
      }
      if (!game.round) {
        game.round = data.gameRound;
      }
      if (!game.users) {
        game.users = data.gameUsers;
      }

      io.to(gameId).emit("gameRoom", game.room);
      io.to(gameId).emit("gameRound", game.round);
      io.to(gameId).emit("gameUsers", game.users);

    });

    socket.on("startGame", () => {
      const { round, roundTime } = game.room;
      game.room.roomState=1;
      io.to(gameId).emit('gameRoom',game.room);
      let { currentRound, timing } = { currentRound: 1, timing: 0 };
      let total = round * roundTime;

      if (!game.onTimerChanged) {
        game.onTimerChanged = () => {
          timing++;
          if (timing > roundTime) {
            currentRound++;
            game.users = setNextPlayer(game.users);
            io.to(gameId).emit('gameUsers', game.users);
            timing -= roundTime;
          }
          var isFinished = (currentRound - 1) * roundTime + timing >= total;
          console.log({ currentRound, timing, isFinished });
          io.to(gameId).emit('gameRound', { currentRound, timing, isFinished });
          if (isFinished) {
            game.stopTimer();
            game.room.roomState=0;//TODO: clean logic here
            io.to(gameId).emit('gameRoom',game.room);
          }
        };
      }

      game.startTimer();


    });

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


  })

});

http.listen(5000, () => {
  console.log('listening on *:5000');
});