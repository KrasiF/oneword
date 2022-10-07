export interface JoinRoomPayload {
    roomId: string
}

export interface RoomStatePayload {
    roomId: string;
    clientIds: Array<string>;
}