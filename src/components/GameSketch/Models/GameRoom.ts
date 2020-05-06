import { RoomState } from "./RoomState";
import { GameUser } from "./GameUser";

export class GameRoom {
    constructor(id: string) {
        this.id = id;
    }
    id: string;
    roomState: RoomState= RoomState.waiting;
    round: number = 12;
    roundTime: number = 120;
    users: Array<GameUser> = [];
    isTimerStarted: boolean = false;
}
