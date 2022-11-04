import { Server } from "socket.io";
import ClientGlobalState from "../models/ClientGlobalState";
import RoomManagerSocketController from "../socket/RoomManagerSocketController";
import GameRoomController from "./GameRoomController";

export default class RoomManagerController {

    private clients: Map<string, ClientGlobalState>;
    private rooms: Map<string, GameRoomController>;
    private socketController: RoomManagerSocketController;

    constructor(io: Server) {
        this.clients = new Map<string, ClientGlobalState>();
        this.rooms = new Map<string, GameRoomController>();
        this.socketController = new RoomManagerSocketController(io, this);
    }

    private static generateRoomId() {
        const LENGTH = 6;
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < LENGTH; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    private generateUniqueRoomId() {
        let uniqueIdTest = RoomManagerController.generateRoomId();
        while (this.rooms.has(uniqueIdTest)) {
            uniqueIdTest = RoomManagerController.generateRoomId();
        }
        return uniqueIdTest;
    }

    public registerClient(id: string): ClientGlobalState {
        if (this.clients.has(id)) {
            return this.clients.get(id);
        }
        let client = new ClientGlobalState(id);
        this.clients.set(id, client);
        return this.clients.get(id);
    }

    public initializeRoom(creator: ClientGlobalState, chosenNickname: string): GameRoomController {
        if (creator.inRoom) {
            return null;
        }
        let roomId = this.generateUniqueRoomId();
        let room = new GameRoomController(roomId);
        let clientRoomState = room.addClient(creator.playerId, chosenNickname);
        creator.setInRoomState(room);
        if (clientRoomState == null) {
            console.error("Error on room creation: could not add creator!");
            return null;
        }
        this.rooms.set(room.getRoomId(), room);
        return room;
    }

    public leaveRoom(client: ClientGlobalState): GameRoomController {
        if (!client.inRoom) {
            return null;
        }
        let room = this.rooms.get(client.roomId);
        if (typeof room == "undefined") {
            return null;
        }
        if (room.removeClient(client.playerId)) {
            client.setInHomeState();
            return room;
        }
        return null;
    }

    public joinRoom(client: ClientGlobalState, roomId: string, chosenNickname: string): GameRoomController {
        if (!this.rooms.has(roomId) || client.inRoom) {
            return null;
        }
        let room = this.rooms.get(roomId);
        room.addClient(client.playerId, chosenNickname);
        client.setInRoomState(room);
        return room;
    }

    public getClient(id: string): ClientGlobalState {
        return this.clients.get(id);
    }

    public getRoomGameController(roomId: string): GameRoomController {
        return this.rooms.get(roomId);
    }
}