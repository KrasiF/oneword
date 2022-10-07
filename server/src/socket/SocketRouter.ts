import { Server } from "socket.io";
import RoomSocketController from "./RoomSocketController";

export default class SocketRouter {
    io: Server;

    roomSocketController: RoomSocketController;

    constructor(io: Server) {
        this.io = io;
        this.roomSocketController = new RoomSocketController(this.io);

    }
}