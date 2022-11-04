import ClientRoomState from "../../../shared/ClientRoomState";
import { RoomStatePayload } from "../../../shared/roomSocketTypes";
import ClientGlobalState from "../models/ClientGlobalState";
import { RoomStatesEnum } from "../models/RoomStatesEnum";

export default class GameRoomController {
    //each game room can have up to 7 clients
    private id: string;

    private owner: ClientRoomState;
    private clients: Array<ClientRoomState>;

    private state: RoomStatesEnum;

    constructor(id: string) {
        this.id = id;
        this.clients = new Array<ClientRoomState>();
        this.state = RoomStatesEnum.WAITING;
    }

    public addClient(playerId: string, nickname: string): ClientRoomState {
        if (this.clients.length >= 7 || this.getClientRoomState(playerId)) {
            return null;
        }
        const roomClientState: ClientRoomState = new ClientRoomState(playerId, nickname, this.id);
        this.clients.push(roomClientState);

        if (this.clients.length === 1) {
            this.setOwner(roomClientState);
        }

        return roomClientState;
    }

    //it is assumed that client is always in the pool of current clients
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

    public setClientIsReady(playerId: string, isReady: boolean) {
        const playerState = this.getClientRoomState(playerId);
        if (!playerState) {
            return;
        }
        playerState.isReady = isReady;
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
        //in order to remove the reference from the returned value to the actual values
        let stringified = JSON.stringify({ roomId: this.id, clients: this.clients, state: this.state });
        return JSON.parse(stringified);
    }
}