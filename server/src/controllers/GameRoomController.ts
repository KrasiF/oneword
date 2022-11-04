import ClientRoomState from "../../../shared/ClientRoomState";
import { RoomStatePayload } from "../../../shared/roomSocketTypes";
import ClientGlobalState from "../models/ClientGlobalState";
import { RoomStatesEnum } from "../models/RoomStatesEnum";

export default class GameRoomController {
    //each game room can have up to 7 clients
    private clients: Array<ClientRoomState>;
    private id: string;


    private owner: ClientRoomState;

    private state: RoomStatesEnum;

    constructor(id: string) {
        this.id = id;
        this.clients = new Array<ClientRoomState>();
        this.state = RoomStatesEnum.WAITING;
    }

    public addClient(playerId: string, nickname: string): ClientRoomState {
        if (this.clients.length >= 7 || typeof this.getClientRoomState(playerId) !== "undefined") {
            return null;
        }
        const roomClientState: ClientRoomState = new ClientRoomState(playerId, nickname, this.id);
        this.clients.push(roomClientState);

        if (this.clients.length === 1) {
            this.setOwner(roomClientState);
        }

        return roomClientState;
    }

    private setOwner(client: ClientRoomState) {
        if (this.owner) {
            this.owner.isOwner = false;
        }
        this.owner = client;
        this.owner.isOwner = true;
    }

    public removeClient(playerId: string): boolean {
        let index = this.getClientRoomStateIndex(playerId);
        if (index === -1) {
            return false;
        }
        let client = this.clients.splice(index, 1)[0];

        if (client === this.owner) {
            client.isOwner = false;

            if (this.clients.length != 0) {
                this.setOwner(this.clients[0]);
            }
            else {
                //room is empty 
                //todo: react accordingly
            }
        }
        return true;
    }

    public getClientRoomState(playerId: string) {
        return this.clients.find((c) => c.playerId === playerId);
    }

    public getClientRoomStateIndex(playerId: string) {
        return this.clients.findIndex((c) => c.playerId === playerId);
    }

    public getClientRoomStates() {
        return this.clients;
    }

    public getRoomId() {
        return this.id;
    }

    public getRoomStatePayload(): RoomStatePayload {
        return { roomId: this.id, clients: this.clients, state: this.state }
    }
}