export class GameRound {
    constructor(id: string) {
        this.id = id;
    }
    id: string;
    currentRound: number = 0;
    timing: number = 0;
    isFinished: boolean = false;
}
