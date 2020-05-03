import { Line } from "./Models/Line";
import { GameUser } from "./Models/GameUser";

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

    createRoom(room: string, uid: string) {

        var round = 10;
        var roundTime = 120;//120 seconds

    }

    startGame(room: string) {

    }

    onUserAction(onUserAction: (room: string, uid: string) => void) {

    }

    dispose() {

    }


}