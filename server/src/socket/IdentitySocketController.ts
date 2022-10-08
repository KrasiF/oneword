import { randomUUID } from "crypto";
import { Server } from "socket.io";

export default class IdentitySocketController {
    io: Server;

    constructor(io: Server) {
        this.io = io;
        this.setupConnectionEndpoints();
    }

    private setupConnectionEndpoints() {
        this.io.on('connection', (socket) => {
            if (socket.handshake.query.playerId === "null") {
                console.log("sending playerId...");
                socket.emit("receive_playerId", randomUUID());
            }
        })
    }
}