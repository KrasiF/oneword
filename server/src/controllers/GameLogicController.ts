import ClientRoomState from "../../../shared/ClientRoomState";
import IClientObserver from "../models/IClientObserver";
import GameRoomController from "./GameRoomController";

export default class GameLogicController implements IClientObserver {

    private owner: GameRoomController;

    constructor(owner: GameRoomController) {
        this.owner = owner;
    }

    onClientJoin(joiningClient: ClientRoomState): void {
        throw new Error("Method not implemented.");
    }

    onClientLeave(leavingClient: ClientRoomState): void {
        throw new Error("Method not implemented.");
    }
}