import ClientRoomState from "./ClientRoomState";

export interface JoinRoomPayload {
    nickname: string
    roomId: string
}

export interface CreateRoomPayload {
    nickname: string
}

export interface RoomStatePayload {
    roomId: string;
    clients: Array<ClientRoomState>;
}