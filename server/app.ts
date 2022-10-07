import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import ClientRoomManager from './src/ClientRoomManager';
import SocketRouter from './src/socket/SocketRouter';

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

export const clientRoomManager = new ClientRoomManager();
export const socketRouter = new SocketRouter(io);

server.listen(3001, () => {
    console.log('listening on *:3001');
});