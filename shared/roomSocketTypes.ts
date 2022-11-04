import { RoomStatesEnum } from "../server/src/models/RoomStatesEnum";
import ClientRoomState from "./ClientRoomState";

export interface JoinRoomPayload {
    nickname: string
    roomId: string
}

export interface JoinedRoomPayload {
    roomId: string
}

export interface CreateRoomPayload {
    nickname: string
}

export interface RoomStatePayload {
    roomId: string;
    state: RoomStatesEnum;
    clients: Array<ClientRoomState>;
}