import { Line } from "./Models/Line";

export class Data {

    drawLine() {

    }

    onDrawLine(lineDraw: (line: Line) => void) {

    }

    joinRoom(room: string, uid: string) {

    }

    onJoinRoom(roomJoined: (room: string, uid: string) => void) {


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