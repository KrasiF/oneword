import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import RoomManagerController from './src/controllers/RoomManagerController';

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const clientRoomManager = new RoomManagerController(io);

server.listen(3001, () => {
    console.log('listening on *:3001');
});