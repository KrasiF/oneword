import { Server, Socket } from "socket.io";
import { clientRoomManager } from "../../app";
import { JoinRoomPayload, RoomStatePayload } from "../../../shared/roomSocketTypes"
import GameRoom from "../models/GameRoom";
import ClientGlobalState from "../models/ClientGlobalState";
import { ClientRequest } from "../../../shared/clientRequestTypes";

export default class RoomSocketController {
    io: Server;

    constructor(io: Server) {
        this.io = io;
        this.setupConnectionEndpoints();
    }

    handleRoomJoinedSocket(socket: Socket, room: GameRoom) {
        let payload: RoomStatePayload = { roomId: room.id, clientIds: room.clients.map((client) => client.id) }
        socket.join(room.id);
        socket.emit("joined_room", JSON.stringify(payload));
        socket.to(room.id).emit("state_update_room", JSON.stringify(payload));
    }

    handleRoomLeftSocket(socket: Socket, room: GameRoom) {
        let payload: RoomStatePayload = { roomId: room.id, clientIds: room.clients.map((client) => client.id) }
        socket.leave(room.id);
        socket.emit("left_room");
        socket.to(room.id).emit("state_update_room", JSON.stringify(payload));
    }

    setupConnectionEndpoints() {
        this.io.on('connection', (socket) => {
            let client = clientRoomManager.registerClient(socket.id);
            console.log('a user connected: ' + socket.id);

            socket.on("ping", () => {
                console.log("pinged")
            })

            socket.on("join_room", (data) => {
                const request: ClientRequest<JoinRoomPayload> = JSON.parse(data);
                let room = clientRoomManager.joinRoom(client, request.payload.roomId);

                if (room == null) {
                    console.log("client " + client.id + " " + "couldnt join room " + request.payload.roomId)
                    return;
                }

                this.handleRoomJoinedSocket(socket, room);
                console.log("client " + client.id + " " + "joined room " + request.payload.roomId)
            })

            socket.on("create_room", () => {
                let room = clientRoomManager.createRoom(client);

                if (room == null) {
                    console.log("new room wasn't created.");
                    return;
                }

                this.handleRoomJoinedSocket(socket, room);
                console.log("new room has been created" + room.clients + " " + room.id);
            })

            socket.on("leave_room", () => {
                let room = clientRoomManager.leaveRoom(client);

                if (room == null) {
                    console.log(client.id + "couldn't leave room")
                    return;
                }

                this.handleRoomLeftSocket(socket, room);
                console.log(client.id + " left room")
            })


        });
    }
}
