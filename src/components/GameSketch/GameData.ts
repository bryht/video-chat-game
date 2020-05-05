import { Line } from "./Models/Line";
import { GameUser } from "./Models/GameUser";
import FirebaseHelper from "utils/FirebaseHelper";
import { GameRoom } from "./Models/GameRoom";
import Log from "utils/Log";
import { GameRoomState } from "./Models/GameRoomState";
import { SocketHelper } from "utils/SocketHelper";
import { GameRoomPlayingRoundState } from "./Models/GameRoomPlayingRoundState";

export class GameData {

    socketHelper: SocketHelper;
    firebaseHelper:FirebaseHelper;
    constructor(roomId: string) {
        this.socketHelper = new SocketHelper(roomId);
        this.firebaseHelper=new FirebaseHelper();
    }


    drawLine() {


    }

    onDrawLine(lineDraw: (line: Line) => void) {

    }


    async startTimerAsync(room: GameRoom) {

        if (room.playingState.isTimerStarted) {
            return;
        }

        this.socketHelper.startRoundTimer(room.round, room.roundTime);
        room.playingState.currentPlayerUid = room.users[0].uid;
        room.playingState.isTimerStarted = true;
        await this.createOrUpdateRoomAsync(room);
    }

    onRoomPlayingRoundStateChanged(onChange: (data: GameRoomPlayingRoundState) => void) {
        this.socketHelper.onRoundTimerChanged(onChange);
    }



    async joinRoomAsync(roomId: string, gameUser: GameUser) {
        var room = await this.firebaseHelper.dbGetByDocIdAsync<GameRoom>("game-sketch-room", roomId);
        if (room) {
            var user = room.users.find(p => p.uid === gameUser.uid)
            if (!user) {
                room.users.push(gameUser);
            } else {
                var index = room.users.indexOf(user);
                room.users[index] = gameUser;
            }
            Log.Info(room);
            await this.firebaseHelper.dbAddOrUpdateAsync("game-sketch-room", room.id, room);
        }
    }
    onRoomChanged(roomId: string, roomJoined: (gameRoom: GameRoom) => void) {
        this.firebaseHelper.dbChanging<GameRoom>("game-sketch-room", roomId, result => {
            roomJoined(result);
        });

    }

    async getRoomAsync(roomId: string) {
        return await this.firebaseHelper.dbGetByDocIdAsync<GameRoom>("game-sketch-room", roomId);
    }

    async createOrUpdateRoomAsync(room: GameRoom) {

        await this.firebaseHelper.dbAddOrUpdateAsync("game-sketch-room", room.id, room);
    }

    async startGame(roomId: string) {
        var room = await this.getRoomAsync(roomId);
        if (room) {
            room.roomState = GameRoomState.started;
            room.playingState.isTimerStarted=false;
            room.playingState.roundState.currentRound=1;
            room.playingState.roundState.isFinished=false;
            await this.createOrUpdateRoomAsync(room);
        }
    }

    dispose() {
        this.firebaseHelper.dispose();
        this.socketHelper.dispose();
    }


}