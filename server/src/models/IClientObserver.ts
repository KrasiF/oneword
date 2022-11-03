import ClientRoomState from "../../../shared/ClientRoomState";

export default interface IClientObserver {
    onClientJoin(joiningClient: ClientRoomState): void;
    onClientLeave(leavingClient: ClientRoomState): void;
    onClientStateUpdate(oldState: ClientRoomState, newState: ClientRoomState): void;
}