import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import {io} from 'socket.io-client';
import { JoinRoomPayload, RoomStatePayload } from "../../shared/roomSocketTypes"
import { randomUUID } from 'crypto';



function App() {

  let playerId = sessionStorage.getItem("playerId");
  if(playerId === null){
    playerId = randomUUID();
    sessionStorage.setItem("playerId",playerId);
  }
  const socket = io("http://localhost:3001",{query:{"playerId":playerId}})

  const roomIdInputRef = useRef<any>("");
  const nicknameInputRef = useRef<any>("");
  const [clients,setClients] = useState<Array<string>>([]);
  socket.on("joined_room",(data)=>{
    onRoomJoined(JSON.parse(data));
  });

  socket.on("state_update_room",(data)=>{
    onRoomUpdated(JSON.parse(data));
  });

  socket.on("left_room", ()=>{
    setClients([]);
  });

  // socket.on("receive_playerId",(id)=>{
  //   console.log("received playerId");
  //   if(sessionStorage.getItem("playerId")==null){
  //     sessionStorage.setItem("playerId",id);
  //     console.log("playerId set");
  //   }
  // });

  return (
    <div className="App">
      <label>Nickname:</label>
      <input type="text" ref={nicknameInputRef}></input>
      <button onClick={()=>{createRoom()}}>Create Room</button>
      <input type="text" ref={roomIdInputRef}></input>
      <button onClick={()=>{joinRoom()}}>Join Room</button>
      <button onClick={()=>{leaveRoom()}}>Leave Room</button>
      {
        clients.map((c)=><p>{c}</p>)
      }
    </div>
  );

  function getNickname() : string {
    let inputVal = nicknameInputRef.current.value;
    return inputVal;
  }

  function onRoomUpdated(payload: RoomStatePayload){
    payload.clients.forEach((c)=>console.log(c));
    setClients(payload.clients);
  }

  function onRoomJoined(payload: RoomStatePayload){
    payload.clients.forEach((c)=>console.log(c));
    setClients(payload.clients);
    roomIdInputRef.current.value = payload.roomId;
  }

  function createRoom() {
    let nickname = getNickname();
    if(nickname == null || nickname.length == 0){
      return;
    }
    const payload = {nickname: nickname}
    socket.emit("create_room",payload);
  }

  function joinRoom(){
    let nickname = getNickname();
    let inputVal = roomIdInputRef.current.value;

    if(nickname == null || nickname.length == 0 || inputVal == null){
      return;
    }
    const joinRoomPayload: JoinRoomPayload = {roomId: inputVal, nickname: nickname};
    socket.emit("join_room",JSON.stringify(joinRoomPayload));
  }

  function leaveRoom(){
    socket.emit("leave_room");
  }
}

export default App;
