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
    constructor(onMessageChanged: (data: Message) => void) {
        this.socketClient = io({ path: '/api' });
        this.socketClient.on("message", onMessageChanged);
    }

    joinRoom(room: string) {
        this.socketClient.emit('join', { 'room': room });
    }
    emit<T>(type: string, data: T) {
        this.socketClient.emit("message", new Message(type, data));
    }

    dispose() {
        this.socketClient.close();
    }
}