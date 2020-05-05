import { Line } from "./Models/Line";
import { GameUser } from "./Models/GameUser";
import FirebaseHelper from "utils/FirebaseHelper";
import { GameRoom } from "./Models/GameRoom";
import Log from "utils/Log";
import { GameRoomState } from "./Models/GameRoomState";
import { SocketHelper } from "utils/SocketHelper";
import { GameRoomPlayingRoundState } from "./Models/GameRoomPlayingRoundState";

export class GameData {

    unSubscribeRoomChanged: () => void;
    socketHelper: SocketHelper;
    constructor(roomId: string) {
        this.unSubscribeRoomChanged = () => { }
        this.socketHelper = new SocketHelper(message => { });
        this.socketHelper.joinRoom(roomId);
    }


    drawLine() {


    }

    onDrawLine(lineDraw: (line: Line) => void) {

    }


    async startTimerAsync(room: GameRoom, roomRoundStateChanged: (data: GameRoomPlayingRoundState) => void) {

        if (room.playingState.isTimerStarted) {
            return;
        }
        
        this.socketHelper.startRoundTimer(room.round, room.roundTime, roomRoundStateChanged);
        room.playingState.currentPlayerUid=room.users[0].uid;
        room.playingState.isTimerStarted=true;
        await this.createOrUpdateRoomAsync(room);
    }



    async joinRoomAsync(roomId: string, gameUser: GameUser) {
        var room = await FirebaseHelper.dbGetByDocIdAsync<GameRoom>("game-sketch-room", roomId);
        if (room) {
            var user = room.users.find(p => p.uid === gameUser.uid)
            if (!user) {
                room.users.push(gameUser);
            } else {
                var index = room.users.indexOf(user);
                room.users[index] = gameUser;
            }
            Log.Info(room);
            await FirebaseHelper.dbAddOrUpdateAsync("game-sketch-room", room.id, room);
        }
    }
    onRoomChanged(roomId: string, roomJoined: (gameRoom: GameRoom) => void) {
        this.unSubscribeRoomChanged = FirebaseHelper.dbChanging<GameRoom>("game-sketch-room", roomId, result => {
            roomJoined(result);
        });

    }

    async getRoomAsync(roomId: string) {
        return await FirebaseHelper.dbGetByDocIdAsync<GameRoom>("game-sketch-room", roomId);
    }

    async createOrUpdateRoomAsync(room: GameRoom) {

        await FirebaseHelper.dbAddOrUpdateAsync("game-sketch-room", room.id, room);
    }

    async startGame(roomId: string) {
        var room = await this.getRoomAsync(roomId);
        if (room) {
            room.roomState = GameRoomState.started;
            await this.createOrUpdateRoomAsync(room);
        }
    }

    dispose() {
        this.unSubscribeRoomChanged();
        this.socketHelper.dispose();
    }


}