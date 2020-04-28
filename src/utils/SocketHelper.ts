import io from "socket.io-client";

export class SocketHelper {
    socketClient: SocketIOClient.Socket;
    constructor(onMessageChanged: (data: any) => void) {
        this.socketClient = io({path:'/api'});
        this.socketClient.on("message", onMessageChanged);
    }
    
    joinRoom(room:string){
        this.socketClient.emit('join', { 'room': room });
    }

    emit<T>(message: T) {
        this.socketClient.emit("message", message);
    }

    dispose() {
        this.socketClient.close();
    }
}