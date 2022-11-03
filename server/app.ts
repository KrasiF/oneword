import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import ClientToRoomController from './src/controllers/ClientToRoomController';

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const clientRoomManager = new ClientToRoomController(io);

server.listen(3001, () => {
    console.log('listening on *:3001');
});