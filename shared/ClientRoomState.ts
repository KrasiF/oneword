export default class ClientRoomState {
    playerId: string;
    nickname: string;

    constructor(playerId: string, nickname: string) {
        this.nickname = nickname;
        this.playerId = playerId;
    }
}