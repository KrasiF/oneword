import { ClientStatesEnum } from "./ClientStatesEnum";
import GameRoom from "./GameRoom";

export default class ClientGlobalState {

    constructor(id: string) {
        this.id = id;
        this.state = ClientStatesEnum.UNNAMED;
    }

    state: ClientStatesEnum;
    id: string;
    inRoom: boolean = false;
    roomId: string = undefined;
    nickname: string = undefined;

    public setInRoomState(room: GameRoom) {
        this.inRoom = true;
        this.roomId = room.id;
        this.state = ClientStatesEnum.IN_ROOM;
    }

    public setInHomeState() {
        this.inRoom = false;
        this.roomId = undefined;
        this.state = ClientStatesEnum.IN_HOME;
    }

    public setNickname(nickname: string) {
        this.nickname = nickname;
    }

    public setInGameState() {
        this.state = ClientStatesEnum.IN_ROOM;
    }
}