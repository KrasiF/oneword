import ClientRoomState from "../../../shared/ClientRoomState";
import { RoomStatePayload } from "../../../shared/roomSocketTypes";
import ClientGlobalState from "./ClientGlobalState";

export default class GameRoom {
    //each game room can have up to 7 clients
    private clients: Array<ClientRoomState>;
    private id: string;

    constructor(id: string) {
        this.id = id;
        this.clients = new Array<ClientRoomState>();
    }

    public addClient(playerId: string, nickname: string): ClientRoomState {
        if (this.clients.length >= 7 || typeof this.getClientRoomState(playerId) !== "undefined") {
            return null;
        }
        const roomClientState: ClientRoomState = { playerId: playerId, nickname: nickname };
        this.clients.push(roomClientState);
        return roomClientState;
    }

    public removeClient(playerId: string): boolean {
        let index = this.getClientRoomStateIndex(playerId);
        if (index === -1) {
            return false;
        }
        this.clients.splice(index, 1);
        return true;
    }

    public getClientRoomState(playerId: string) {
        return this.clients.find((c) => c.playerId === playerId);
    }

    public getClientRoomStateIndex(playerId: string) {
        return this.clients.findIndex((c) => c.playerId === playerId);
    }

    public getRoomId() {
        return this.id;
    }

    public getRoomStatePayload(): RoomStatePayload {
        return { roomId: this.id, clients: this.clients }
    }
}