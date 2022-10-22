import { Server } from "socket.io";
import RoomManagerSocketController from "./RoomManagerSocketController";

export default class SocketRouter {
    io: Server;

    roomSocketController: RoomManagerSocketController;

    constructor(io: Server) {
        this.io = io;
        this.roomSocketController = new RoomManagerSocketController(this.io);
    }
}