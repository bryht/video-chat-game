import { GameUser } from "./Models/GameUser";
import FirebaseHelper from "utils/FirebaseHelper";
import { GameRoom } from "./Models/GameRoom";
import { RoomState } from "./Models/RoomState";
import { SocketHelper } from "utils/SocketHelper";
import Consts from "./Consts";
import { GameUserState } from "./Models/GameUserState";
import { GameRound } from "./Models/GameRound";

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
        this.socketHelper.emit<GameRoom>(Consts.gameRoom, this.gameRoom)
    }

    emitGameRound() {
        this.socketHelper.emit<GameRound>(Consts.gameRound, this.gameRound)
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
            if (this.gameRound.currentRound !== data.currentRound) {
                this.setNextPlayer();

            }
            this.gameRound.currentRound = data.currentRound;
            this.gameRound.timing = data.timing;
            this.gameRound.isFinished = data.isFinished;
            onChange(this.gameRound);
        });
    }

    private setNextPlayer() {

        let users = this.gameRoom.users.sort((a, b) => {
            if (a.uid < b.uid) { return -1; }
            if (a.uid > b.uid) { return 1; }
            return 0;
        });

        let playingIndex = users.findIndex(p => p.userState === GameUserState.playing);
        let nextPlayingIndex = playingIndex + 1 >= users.length ? 0 : playingIndex + 1;


        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            if (index === playingIndex) {
                element.userState = GameUserState.waiting;
            }
            if (index === nextPlayingIndex) {
                element.userState = GameUserState.playing;
            }
        }
        this.gameRoom.users = users;
        this.emitGameRoom();
    }

    async joinRoomAsync(gameUser: GameUser) {
        var user = this.gameRoom.users.find(p => p.uid === gameUser.uid)
        if (!user) {
            this.gameRoom.users.push(gameUser);
        } else {
            var index = this.gameRoom.users.indexOf(user);
            this.gameRoom.users[index] = gameUser;
        }
        this.emitGameRoom();
        await this.saveGameRoomAsync();

    }
    onGameRoomChanged(onChange: (gameRoom: GameRoom) => void) {
        this.socketHelper.onEventChanged<GameRoom>(Consts.gameRoom, data=>{
            this.gameRoom=data;
            onChange(data);
        });
    }

    async startGameAsync() {

        this.gameRoom.roomState = RoomState.started;
        this.gameRoom.isTimerStarted = false;
        this.gameRound.currentRound = 1;
        this.gameRound.isFinished = false;
        this.emitGameRoom();
        this.emitGameRound();
        await this.saveGameRoomAsync();
        await this.saveGameRoundAsync();
    }

    async finishGameAsync() {
        this.gameRoom.roomState = RoomState.waiting;
        this.gameRoom.isTimerStarted = false;
        this.gameRound.currentRound = 1;
        this.gameRound.isFinished = false;
        this.emitGameRoom();
        this.emitGameRound();
        await this.saveGameRoomAsync();
        await this.saveGameRoundAsync();
    }

    async disposeAsync() {
        this.firebaseHelper.dispose();
        this.socketHelper.dispose();
    }


}