import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
    return socket;
}

export function setSocket(playerId: string): Socket {
    if (socket !== null) {
        console.log("socket already set");
        return socket;
    }
    socket = io("http://localhost:3001", { query: { "playerId": playerId } });
    return socket;
}