import { GameUser } from "./Models/GameUser";
import FirebaseHelper from "utils/FirebaseHelper";
import { GameRoom } from "./Models/GameRoom";
import { SocketHelper } from "utils/SocketHelper";
import Consts from "./Consts";
import { GameRound } from "./Models/GameRound";

export class GameData {

    private socketHelper: SocketHelper;
    private firebaseHelper: FirebaseHelper;
    private gameRoom: GameRoom;
    private gameRound: GameRound;
    private gameUsers: Array<GameUser>;
    constructor(gameId: string) {
        this.socketHelper = new SocketHelper(gameId);
        this.firebaseHelper = new FirebaseHelper();
        this.gameRoom = new GameRoom(gameId);
        this.gameRound = new GameRound(gameId);
        this.gameUsers = [];
    }


    initial() {
        this.socketHelper.emit(Consts.initialGame, { gameRoom: this.gameRoom, gameRound: this.gameRound, gameUsers: this.gameUsers });
    }

    startGame() {
        this.socketHelper.emit(Consts.startGame, {});
    }


    onGameRoundChanged(onChange: (gameRound: GameRound) => void) {
        this.socketHelper.onEventChanged<GameRound>(Consts.gameRound, async data => {
            this.gameRound = data;
            onChange(data);
        });
    }

    onGameRoomChanged(onChange: (gameRoom: GameRoom) => void) {
        this.socketHelper.onEventChanged<GameRoom>(Consts.gameRoom, data => {
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

    joinRoom(gameUser: GameUser) {
        this.socketHelper.emit<GameUser>(Consts.gameUserUpdate, gameUser);
    }

    updateGameUser(gameUser:GameUser){
        this.socketHelper.emit<GameUser>(Consts.gameUserUpdate, gameUser);
    }

    dispose() {
        this.firebaseHelper.dispose();
        this.socketHelper.dispose();
    }


}