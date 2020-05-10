import { RoomState } from "./RoomState";
import { GameUser } from "./GameUser";

export class GameRoom {
    constructor(gameId: string) {
        this.gameId = gameId;
    }
    gameId: string;
    roomState: RoomState = RoomState.waiting;
    round: number = 3;
    roundTime: number = 60;
}
