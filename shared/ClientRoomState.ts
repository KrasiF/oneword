export default class ClientRoomState {

    roomId: string;
    playerId: string;
    nickname: string;
    isOwner: boolean;
    isReady: boolean;

    constructor(playerId: string, nickname: string, roomId: string) {
        this.nickname = nickname;
        this.playerId = playerId;
        this.roomId = roomId;
        this.isOwner = false;
        this.isReady = false;
    }
}