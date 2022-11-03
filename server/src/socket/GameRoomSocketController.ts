import { Server } from "socket.io";

export default class GameRoomSocketController {
    io: Server;

    constructor(io: Server) {
        this.io = io;
        this.setupConnectionEndpoints();
    }

    setupConnectionEndpoints() {
        //receive onReady
        //receive onStart

        //send State update

    }
}