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
    gameUsers: Array<GameUser>;
    constructor(gameId: string) {
        this.socketHelper = new SocketHelper(gameId);
        this.firebaseHelper = new FirebaseHelper();
        this.gameRoom = new GameRoom(gameId);
        this.gameRound = new GameRound(gameId);
        this.gameUsers = [];
    }


    initialAsync() {
        // let _gameRoom = await this.firebaseHelper.dbGetByDocIdAsync<GameRoom>(Consts.gameSketchRoom, this.gameRoom.id);
        // if (_gameRoom) {
        //     this.gameRoom = _gameRoom;
        // }
        // let _gameRound = await this.firebaseHelper.dbGetByDocIdAsync<GameRound>(Consts.gameSketchRound, this.gameRound.id);
        // if (_gameRound) {
        //     this.gameRound = _gameRound;
        // }
        this.socketHelper.emit(Consts.initialGame, { gameRoom: this.gameRoom, gameRound: this.gameRound, gameUsers: this.gameUsers });
    }

    async saveGameRoomAsync() {
        // await this.firebaseHelper.dbAddOrUpdateAsync(Consts.gameSketchRoom, this.gameRoom.id, this.gameRoom);
    }

    async saveGameRoundAsync() {
        // await this.firebaseHelper.dbAddOrUpdateAsync(Consts.gameSketchRound, this.gameRound.id, this.gameRound);
    }

    emitGameRoom() {
        this.socketHelper.emit<GameRoom>(Consts.gameRoom, this.gameRoom)
    }

    emitGameRound() {
        this.socketHelper.emit<GameRound>(Consts.gameRound, this.gameRound)
    }

    startGame() {

        this.gameUsers[0].userState = GameUserState.playing;
        this.socketHelper.emit(Consts.gameUserUpdate, this.gameUsers[0]);
        this.gameRoom.roomState= RoomState.started;
        this.socketHelper.emit(Consts.startGame, this.gameRoom);

    }

    onGameRoundChanged(onChange: (gameRound: GameRound) => void) {
        this.socketHelper.onEventChanged<GameRound>(Consts.gameRound, async data => {
            this.gameRound = data;
            onChange(data);
        });
    }

    onGameRoomChanged(onChange: (gameRoom: GameRoom) => void) {
        this.socketHelper.onEventChanged<GameRoom>(Consts.gameRoom, data => {
            Log.Info(data);
            this.gameRoom = data;
            onChange(data);
        });
    }

    onGameRoomUsersChanged(onChange: (gameUsers: Array<GameUser>) => void) {
        this.socketHelper.onEventChanged<Array<GameUser>>(Consts.gameUsers, data => {
            this.gameUsers = data;
            onChange(data);
        });
    }


    // private async setNextPlayerAsync() {

    //     let users = this.gameUsers.sort((a, b) => {
    //         if (a.uid < b.uid) { return -1; }
    //         if (a.uid > b.uid) { return 1; }
    //         return 0;
    //     });

    //     let playingIndex = users.findIndex(p => p.userState === GameUserState.playing);
    //     let nextPlayingIndex = playingIndex + 1 >= users.length ? 0 : playingIndex + 1;


    //     for (let index = 0; index < users.length; index++) {
    //         const element = users[index];
    //         if (index === playingIndex) {
    //             element.userState = GameUserState.waiting;
    //         }
    //         if (index === nextPlayingIndex) {
    //             element.userState = GameUserState.playing;
    //         }
    //     }

    // }

    async joinRoomAsync(gameUser: GameUser) {
        // var user = this.gameRoom.users.find(p => p.uid === gameUser.uid)
        // if (!user) {
        //     this.gameRoom.users.push(gameUser);
        // } else {
        //     var index = this.gameRoom.users.indexOf(user);
        //     this.gameRoom.users[index] = gameUser;
        // }
        // this.emitGameRoom();
        this.socketHelper.emit<GameUser>(Consts.gameUserUpdate, gameUser);

    }

    // async startGameAsync() {

    //     this.gameRoom.roomState = RoomState.started;
    //     this.gameRound.currentRound = 1;
    //     this.gameRound.isFinished = false;
    //     this.emitGameRoom();
    //     this.emitGameRound();
    //     await this.saveGameRoomAsync();
    //     await this.saveGameRoundAsync();
    // }

    // async finishGameAsync() {
    //     this.gameRoom.roomState = RoomState.waiting;
    //     this.emitGameRoom();
    //     await this.saveGameRoomAsync();
    // }

    async disposeAsync() {
        await this.saveGameRoomAsync();
        await this.saveGameRoundAsync();
        this.firebaseHelper.dispose();
        this.socketHelper.dispose();
    }


}