import Client from "./models/Client";
import GameRoom from "./models/GameRoom";

export default class ClientRoomManager {

    private clients: Map<string, Client>;
    private rooms: Map<string, GameRoom>;

    constructor() {
        this.clients = new Map<string, Client>();
        this.rooms = new Map<string, GameRoom>();
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
        let uniqueIdTest = ClientRoomManager.generateRoomId();
        while (this.rooms.has(uniqueIdTest)) {
            uniqueIdTest = ClientRoomManager.generateRoomId();
        }
        return uniqueIdTest;
    }

    public registerClient(id: string): Client {
        if (this.clients.has(id)) {
            return this.clients.get(id);
        }
        let client = new Client(id);
        this.clients.set(id, client);
        return this.clients.get(id);
    }

    public createRoom(creator: Client): GameRoom {
        if (creator.inRoom) {
            return undefined;
        }
        let roomId = this.generateUniqueRoomId();
        let gameRoom = new GameRoom(roomId);
        let addCheck = gameRoom.addClient(creator);
        if (!addCheck) {
            console.error("Error on room creation: could not add creator!");
            return undefined;
        }
        this.rooms.set(gameRoom.id, gameRoom);
        return gameRoom;
    }

    public leaveRoom(client: Client): GameRoom {
        if (!client.inRoom) {
            return null;
        }
        let room = this.rooms.get(client.roomId);
        if (typeof room == "undefined") {
            return null;
        }
        if (room.removeClient(client)) {
            return room;
        }
        return null;
    }

    public joinRoom(client: Client, roomId: string): GameRoom {
        if (!this.rooms.has(roomId) || client.inRoom) {
            return null;
        }
        let room = this.rooms.get(roomId);
        room.addClient(client);
        return room;
    }

    public getClient(id: string): Client {
        return this.clients.get(id);
    }
}