import ClientRoomState from "../../../shared/ClientRoomState";
import { RoomStatePayload } from "../../../shared/roomSocketTypes";
import ClientGlobalState from "../models/ClientGlobalState";
import IClientObservervable from "../models/IClientObservable";
import IClientObserver from "../models/IClientObserver";
import { RoomStatesEnum } from "../models/RoomStatesEnum";
import GameLogicController from "./GameLogicController";

export default class GameRoomController implements IClientObservervable {
    //each game room can have up to 7 clients
    private clients: Array<ClientRoomState>;
    private id: string;

    private 

    private gameLogicController: GameLogicController;

    private owner: ClientRoomState;

    private state: RoomStatesEnum;

    private observers: IClientObserver[];

    constructor(id: string) {
        this.id = id;
        this.clients = new Array<ClientRoomState>();
        this.gameLogicController = new GameLogicController(this);
        this.observers = [];
        this.state = RoomStatesEnum.WAITING;
    }

    public subscribe(observer: IClientObserver): void {
        if (this.observers.findIndex((o) => observer === o) != -1) {
            return;
        }
        this.observers.push(observer);
        console.log("new subscriber");
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

        this.notifyClientJoin(roomClientState);
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

        this.notifyClientLeave(client);
        return true;
    }

    public onClientRoomStateUpdate(client: ClientRoomState) {

    }

    private notifyClientStateUpdate(oldState: ClientRoomState, newState: ClientRoomState) {
        this.observers.forEach((o) => {
            o.onClientStateUpdate(oldState, newState);
        });
    }

    private notifyClientJoin(client: ClientRoomState) {
        this.observers.forEach((o) => {
            o.onClientJoin(client);
        });
    }

    private notifyClientLeave(client: ClientRoomState) {
        this.observers.forEach((o) => {
            o.onClientLeave(client);
        });
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