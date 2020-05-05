import { GameUser } from "./Models/GameUser";
import FirebaseHelper from "utils/FirebaseHelper";
import { GameRoom } from "./Models/GameRoom";
import { RoomState } from "./Models/RoomState";
import { SocketHelper } from "utils/SocketHelper";
import Consts from "./Consts";
import { GameUserState } from "./Models/GameUserState";
import { GameRound } from "./Models/GameRound";
import Log from "utils/Log";

export class GameData {

    socketHelper: SocketHelper;
    firebaseHelper: FirebaseHelper;
    gameRoom: GameRoom;
    gameRound: GameRound;
    constructor(roomId: string) {
        this.socketHelper = new SocketHelper(roomId);
        this.firebaseHelper = new FirebaseHelper();
        this.gameRoom = new GameRoom(roomId);
        this.gameRound = new GameRound(roomId);
    }


    async initialAsync() {
        let _gameRoom = await this.firebaseHelper.dbGetByDocIdAsync<GameRoom>(Consts.gameSketchRoom, this.gameRoom.id);
        if (_gameRoom) {
            this.gameRoom = _gameRoom;
        }
        let _gameRound = await this.firebaseHelper.dbGetByDocIdAsync<GameRound>(Consts.gameSketchRound, this.gameRound.id);
        if (_gameRound) {
            this.gameRound = _gameRound;
        }
    }

    async saveGameRoomAsync() {
        await this.firebaseHelper.dbAddOrUpdateAsync(Consts.gameSketchRoom, this.gameRoom.id, this.gameRoom);
    }

    async saveGameRoundAsync() {
        await this.firebaseHelper.dbAddOrUpdateAsync(Consts.gameSketchRound, this.gameRound.id, this.gameRound);
    }

    emitGameRoom() {
        this.socketHelper.emit<GameRoom>("gameRoom", this.gameRoom)
    }

    emitGameRound() {
        this.socketHelper.emit<GameRound>("gameRound", this.gameRound)
    }

    startTimer() {

        if (this.gameRoom.isTimerStarted) {
            return;
        }

        this.socketHelper.startRoundTimer(this.gameRoom.round, this.gameRoom.roundTime);
        this.gameRoom.users[0].userState = GameUserState.playing;
        this.gameRoom.isTimerStarted = true;
        this.emitGameRoom();
    }

    onGameRoundChanged(onChange: (data: GameRound) => void) {
        this.socketHelper.onRoundTimerChanged(data => {
            this.gameRound.currentRound = data.currentRound;
            this.gameRound.timing = data.timing;
            this.gameRound.isFinished = data.isFinished;
            onChange(this.gameRound);
        });
    }

    joinRoom(gameUser: GameUser) {
        var user = this.gameRoom.users.find(p => p.uid === gameUser.uid)
        if (!user) {
            this.gameRoom.users.push(gameUser);
        } else {
            var index = this.gameRoom.users.indexOf(user);
            this.gameRoom.users[index] = gameUser;
        }
        this.emitGameRoom();
    }
    onGameRoomChanged(onChange: (gameRoom: GameRoom) => void) {
        this.socketHelper.onEventChanged<GameRoom>("gameRoom", onChange);
    }

    startGame() {

        this.gameRoom.roomState = RoomState.started;
        this.gameRoom.isTimerStarted = false;
        this.gameRound.currentRound = 1;
        this.gameRound.isFinished = false;

        this.emitGameRoom();
        this.emitGameRound();
    }

    finishGame(){
        this.gameRoom.roomState = RoomState.waiting;
        this.gameRoom.isTimerStarted = false;
        this.gameRound.currentRound = 1;
        this.gameRound.isFinished = false;
        this.emitGameRoom();
        this.emitGameRound();
    }

    async disposeAsync() {
        await this.saveGameRoomAsync();
        await this.saveGameRoundAsync();
        Log.Info(this.gameRoom);
        this.firebaseHelper.dispose();
        this.socketHelper.dispose();
    }


}