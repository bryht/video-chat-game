import io from "socket.io-client";

export class Message {
    type: string;
    data: any;
    constructor(type: string, data: any) {
        this.type = type;
        this.data = data;
    }
}
export class SocketHelper {
    socketClient: SocketIOClient.Socket;
    constructor(roomId: string) {
        this.socketClient = io({ path: '/api' });
        this.joinRoom(roomId);
    }

    private joinRoom(room: string) {
        this.socketClient.emit('join', { 'room': room });
    }
    emit<T>(event: string, data: T) {
        this.socketClient.emit(event, data);
    }

    onEventChanged<T>(event: string, onChange: (data: T) => void) {
        this.socketClient.on(event, onChange);
    }

    startRoundTimer(roundNumber: number, timeLimit: number, ) {
        this.socketClient.emit('timer-start', { roundNumber, timeLimit });
    }

    onRoundTimerChanged(onChange: (data: { currentRound: number, timing: number, isFinished: boolean }) => void) {
        this.socketClient.on('gameRound', onChange);
    }

    dispose() {
        if (this.socketClient) {
            this.socketClient.close();
        }
    }
}