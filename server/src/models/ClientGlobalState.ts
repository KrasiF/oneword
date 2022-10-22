import { ClientStatesEnum } from "./ClientStatesEnum";
import GameRoomController from "../controllers/GameRoomController";

export default class ClientGlobalState {

    constructor(id: string) {
        this.playerId = id;
        this.state = ClientStatesEnum.UNNAMED;
    }

    state: ClientStatesEnum;
    playerId: string;
    inRoom: boolean = false;
    roomId: string = undefined;

    public setInRoomState(room: GameRoomController) {
        this.inRoom = true;
        this.roomId = room.getRoomId();
        this.state = ClientStatesEnum.IN_ROOM;
    }

    public setInHomeState() {
        this.inRoom = false;
        this.roomId = undefined;
        this.state = ClientStatesEnum.IN_HOME;
    }

    public setInGameState() {
        this.state = ClientStatesEnum.IN_ROOM;
    }
}