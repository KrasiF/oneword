import { Server } from "socket.io";
import IdentitySocketController from "./IdentitySocketController";
import RoomSocketController from "./RoomSocketController";

export default class SocketRouter {
    io: Server;

    roomSocketController: RoomSocketController;
    identitySocketController: IdentitySocketController;

    constructor(io: Server) {
        this.io = io;
        this.identitySocketController = new IdentitySocketController(this.io);
        this.roomSocketController = new RoomSocketController(this.io);

    }
}