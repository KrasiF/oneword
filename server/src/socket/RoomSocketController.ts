import { Server, Socket } from "socket.io";
import { clientRoomManager } from "../../app";
import { CreateRoomPayload, JoinRoomPayload, RoomStatePayload } from "../../../shared/roomSocketTypes"
import GameRoom from "../models/GameRoom";
import ClientGlobalState from "../models/ClientGlobalState";

export default class RoomSocketController {
    io: Server;

    constructor(io: Server) {
        this.io = io;
        this.setupConnectionEndpoints();
    }

    handleRoomJoinedSocket(socket: Socket, room: GameRoom) {
        let payload: RoomStatePayload = room.getRoomStatePayload();
        socket.join(payload.roomId);
        socket.emit("joined_room", JSON.stringify(payload));
        socket.to(payload.roomId).emit("state_update_room", JSON.stringify(payload));
    }

    handleRoomLeftSocket(socket: Socket, room: GameRoom) {
        let payload: RoomStatePayload = room.getRoomStatePayload();
        socket.leave(payload.roomId);
        socket.emit("left_room");
        socket.to(payload.roomId).emit("state_update_room", JSON.stringify(payload));
    }

    setupConnectionEndpoints() {
        this.io.on('connection', (socket) => {
            let playerId: string = socket.handshake.query.playerId as string;
            let client = clientRoomManager.registerClient(playerId);
            console.log('a user connected: ' + client);

            socket.on("ping", () => {
                console.log("pinged")
            })

            socket.on("join_room", (data) => {
                const payload: JoinRoomPayload = JSON.parse(data);
                let room = clientRoomManager.joinRoom(client, payload.roomId, payload.nickname);

                if (room === null) {
                    console.log("client " + client.playerId + " " + "couldnt join room " + payload.roomId)
                    return;
                }

                this.handleRoomJoinedSocket(socket, room);
                console.log("client " + client.playerId + " " + "joined room " + payload.roomId)
            })

            socket.on("create_room", (data) => {
                const payload: CreateRoomPayload = JSON.parse(data);
                let room = clientRoomManager.createRoom(client, payload.nickname);

                if (room === null) {
                    console.log("new room wasn't created.");
                    return;
                }

                this.handleRoomJoinedSocket(socket, room);
                console.log("new room has been created" + " " + room.getRoomId());
            })

            socket.on("leave_room", () => {
                let room = clientRoomManager.leaveRoom(client);

                if (room === null) {
                    console.log(client.playerId + "couldn't leave room")
                    return;
                }

                this.handleRoomLeftSocket(socket, room);
                console.log(client.playerId + " left room")
            })


        });
    }
}
