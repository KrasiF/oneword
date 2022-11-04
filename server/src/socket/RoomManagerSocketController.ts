import { Server, Socket } from "socket.io";
import { CreateRoomPayload, JoinRoomPayload, RoomStatePayload } from "../../../shared/roomSocketTypes"
import GameRoomController from "../controllers/GameRoomController";
import ClientGlobalState from "../models/ClientGlobalState";
import RoomManagerController from "../controllers/RoomManagerController";

export default class RoomManagerSocketController {
    io: Server;
    controller: RoomManagerController;

    constructor(io: Server, controller: RoomManagerController) {
        this.io = io;
        this.controller = controller;
        this.setupConnectionEndpoints();
    }

    handleRoomJoinedSocket(socket: Socket, room: GameRoomController) {
        let payload: RoomStatePayload = room.getRoomStatePayload();
        socket.join(payload.roomId);
        socket.emit("joined_room", JSON.stringify(payload));

        this.sendRoomStateUpdate(socket, room);
    }

    handleRoomLeftSocket(socket: Socket, room: GameRoomController) {
        socket.leave(room.getRoomId());
        socket.emit("left_room");
        this.sendRoomStateUpdate(socket, room);
    }

    sendRoomStateUpdate(socket: Socket, room: GameRoomController) {
        let payload: RoomStatePayload = room.getRoomStatePayload();
        socket.to(payload.roomId).emit("state_update_room", JSON.stringify(payload));
    }

    setupConnectionEndpoints() {
        this.io.on('connection', (socket) => {
            let playerId: string = socket.handshake.query.playerId as string;
            let client = this.controller.registerClient(playerId);
            console.log('a user connected: ' + JSON.stringify(playerId) + " " + socket.id);

            socket.on("ping", () => {
                console.log("pinged")
            })

            socket.on("join_room", (data) => {
                const payload: JoinRoomPayload = JSON.parse(data);
                let room = this.controller.joinRoom(client, payload.roomId, payload.nickname);

                if (room === null) {
                    console.log("client " + client.playerId + " " + "couldnt join room " + payload.roomId)
                    return;
                }

                this.handleRoomJoinedSocket(socket, room);
                console.log("client " + client.playerId + " " + "joined room " + payload.roomId)
            })

            socket.on("create_room", (data) => {
                const payload: CreateRoomPayload = JSON.parse(data);
                let room = this.controller.initializeRoom(client, payload.nickname);

                if (room === null) {
                    console.log("new room wasn't created.");
                    return;
                }

                this.handleRoomJoinedSocket(socket, room);
                console.log("new room has been created" + " " + room.getRoomId());
            })

            socket.on("leave_room", () => {
                let room = this.controller.leaveRoom(client);

                if (room === null) {
                    console.log(client.playerId + "couldn't leave room")
                    return;
                }

                this.handleRoomLeftSocket(socket, room);
                console.log(client.playerId + " left room")
            })

            socket.on("disconnect", () => {
                console.log(socket.id + " disconnected.")
            });

            socket.on("set_ready", (data) => {
                let payload: { roomId: string, isReady: boolean } = JSON.parse(data);
                this.controller.getRoomGameController(payload.roomId)?.setClientIsReady(client.playerId, payload.isReady);
            })

            socket.on("start_game", (roomId) => {
                this.controller.getRoomGameController(roomId)?.tryStartGame(client.playerId);
            })

        });
    }
}
