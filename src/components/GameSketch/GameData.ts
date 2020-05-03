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

    joinRoom(roomId: string, gameUser: GameUser) {

    }

    onJoinRoom(roomJoined: (roomId: string, gameUser: GameUser) => void) {


    }

    createRoom(room: GameRoom) {

        FirebaseHelper.dbAdd("game-sketch-room",room.id, room);

    }

    startGame(roomId: string) {

    }

    onUserAction(onUserAction: (room: string, uid: string) => void) {

    }

    dispose() {

    }


}