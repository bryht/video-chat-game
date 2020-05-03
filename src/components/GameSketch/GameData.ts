import { Line } from "./Models/Line";
import { GameUser } from "./Models/GameUser";
import FirebaseHelper from "utils/FirebaseHelper";
import { GameRoom } from "./Models/GameRoom";

export class GameData {

    constructor() {
        this.connect();

    }
    connect() {
    }

    drawLine() {

    }

    onDrawLine(lineDraw: (line: Line) => void) {

    }

    async joinRoom(roomId: string, gameUser: GameUser) {
        var room = await FirebaseHelper.dbGetByDocIdAsync<GameRoom>("game-sketch-room", roomId);
        if (room) {
            room.users.push(gameUser);
            await FirebaseHelper.dbAddOrUpdateAsync("game-sketch-room", room.id, room);
        }
    }

    onJoinRoom(roomId: string, roomJoined: (gameRoom: GameRoom) => void) {
        FirebaseHelper.dbChanging<GameRoom>("game-sketch-room", roomId, result => {
            debugger;
            roomJoined(result);
        });

    }

    async createRoom(room: GameRoom) {

        await FirebaseHelper.dbAddOrUpdateAsync("game-sketch-room", room.id, room);
    }

    startGame(roomId: string) {

    }

    onUserAction(onUserAction: (room: string, uid: string) => void) {

    }

    dispose() {

    }


}