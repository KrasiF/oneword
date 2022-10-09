import ClientGlobalState from "./models/ClientGlobalState";
import GameRoom from "./models/GameRoom";

export default class ClientRoomManager {

    private clients: Map<string, ClientGlobalState>;
    private rooms: Map<string, GameRoom>;

    constructor() {
        this.clients = new Map<string, ClientGlobalState>();
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

    public registerClient(id: string): ClientGlobalState {
        if (this.clients.has(id)) {
            return this.clients.get(id);
        }
        let client = new ClientGlobalState(id);
        this.clients.set(id, client);
        return this.clients.get(id);
    }

    public createRoom(creator: ClientGlobalState, chosenNickname: string): GameRoom {
        if (creator.inRoom) {
            return undefined;
        }
        let roomId = this.generateUniqueRoomId();
        let room = new GameRoom(roomId);
        let clientRoomState = room.addClient(creator.playerId, chosenNickname);
        creator.setInRoomState(room);
        if (clientRoomState == null) {
            console.error("Error on room creation: could not add creator!");
            return undefined;
        }
        this.rooms.set(room.getRoomId(), room);
        return room;
    }

    public leaveRoom(client: ClientGlobalState): GameRoom {
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

    public joinRoom(client: ClientGlobalState, roomId: string, chosenNickname: string): GameRoom {
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
}