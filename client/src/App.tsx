import React, { useRef, useState, Component, createRef, RefObject } from 'react';
import logo from './logo.svg';
import {io, Socket} from 'socket.io-client';
import { CreateRoomPayload, JoinRoomPayload, RoomStatePayload } from "../../shared/roomSocketTypes"
import { v4 as uuidv4 } from 'uuid';
import ClientRoomState from '../../shared/ClientRoomState';

interface AppProps{

}

interface AppState{
  clients: ClientRoomState[];
  playerId?: string;
}

class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    clients: []
  }
  nicknameInputRef: RefObject<HTMLInputElement>;
  roomIdInputRef: RefObject<HTMLInputElement>;
  socket: Socket;

  constructor(props: AppProps){
    super(props);
    this.socket = this.setupSocket();
    this.nicknameInputRef = React.createRef<HTMLInputElement>();
    this.roomIdInputRef = React.createRef<HTMLInputElement>();
  }


  setupSocket(): Socket {
    let playerId = sessionStorage.getItem("playerId");
    if(playerId === null){
      playerId = uuidv4();
      sessionStorage.setItem("playerId",playerId);
    }
    let socket: Socket = io("http://localhost:3001", { query: { "playerId": playerId } });
    this.setupSocketConnections(socket);
    return socket;
  }

  setupSocketConnections(socket:Socket){
    socket.on("joined_room",(data)=>{
      console.log("joined "+data);
      this.onRoomJoined(JSON.parse(data));
    });
  
    socket.on("state_update_room",(data)=>{
      console.log("stateupdate "+data);
      this.onRoomUpdated(JSON.parse(data));
    });
  
    socket.on("left_room", ()=>{
      this.setState({clients:[]});
    });
  }

  setClients(clients:ClientRoomState[]){
    this.setState({clients:clients});
  }

  getNickname() : string | null {
    let inputVal = this.nicknameInputRef.current !== null? this.nicknameInputRef.current.value : null;
    return inputVal;
  }

  onRoomUpdated(payload: RoomStatePayload){
    payload.clients.forEach((c)=>console.log(c));
    this.setClients(payload.clients);
  }

  onRoomJoined(payload: RoomStatePayload){
    if(this.roomIdInputRef.current){
      this.roomIdInputRef.current.value = payload.roomId;
    }

    this.setClients(payload.clients);
    console.log("payload id: "+ payload.roomId)
  }

  createRoom() {
    let nickname = this.getNickname();
    if(nickname == null || nickname.length == 0){
      return;
    }
    const payload: CreateRoomPayload = {nickname: nickname}
    this.socket.emit("create_room",JSON.stringify(payload));
  }

  joinRoom(){
    let nickname = this.getNickname();
    let inputVal = this.roomIdInputRef.current != null ? this.roomIdInputRef.current.value : null;

    if(nickname == null || nickname.length == 0 || inputVal == null){
      return;
    }
    const joinRoomPayload: JoinRoomPayload = {roomId: inputVal, nickname: nickname};
    this.socket.emit("join_room",JSON.stringify(joinRoomPayload));
  }

  leaveRoom(){
    this.socket.emit("leave_room");
  }

  render() {
    return (
      <div className="App">
        <label>Nickname:</label>
        <input type="text" ref={this.nicknameInputRef}></input>
        <button onClick={()=>{this.createRoom()}}>Create Room</button>
        <input type="text" ref={this.roomIdInputRef}></input>
        <button onClick={()=>{this.joinRoom()}}>Join Room</button>
        <button onClick={()=>{this.leaveRoom()}}>Leave Room</button>
        {
          this.state.clients.map((c)=><p>{c.nickname} isOwner:{c.isOwner.toString()} isReady:{c.isReady.toString()}</p>)
        }
      </div>
    );
  }
}

export default App;
