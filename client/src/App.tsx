import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import {io} from 'socket.io-client';
import { JoinRoomPayload, RoomStatePayload } from "../../shared/roomSocketTypes"
const socket = io("http://localhost:3001")


function App() {

  const inputRef = useRef<any>("");
  const [clients,setClients] = useState<Array<string>>([]);
  socket.on("joined_room",(data)=>{
    onRoomJoined(JSON.parse(data));
  })

  socket.on("state_update_room",(data)=>{
    onRoomUpdated(JSON.parse(data));
  })

  socket.on("left_room", ()=>{
    setClients([]);
  })

  return (
    <div className="App">
      <button onClick={()=>{createRoom()}}>Create Room</button>
      <input type="text" ref={inputRef}></input>
      <button onClick={()=>{joinRoom()}}>Join Room</button>
      <button onClick={()=>{leaveRoom()}}>Leave Room</button>
      {
        clients.map((c)=><p>{c}</p>)
      }
    </div>
  );

  function onRoomUpdated(payload: RoomStatePayload){
    payload.clientIds.forEach((c)=>console.log(c));
    setClients(payload.clientIds);
  }

  function onRoomJoined(payload: RoomStatePayload){
    payload.clientIds.forEach((c)=>console.log(c));
    setClients(payload.clientIds);
    inputRef.current.value = payload.roomId;
  }

  function createRoom() {
    socket.emit("create_room");
  }

  function joinRoom(){

    let inputVal = inputRef.current.value;

    if(inputVal!=null){
      const joinRoomPayload: JoinRoomPayload = {roomId: inputVal};
      socket.emit("join_room",JSON.stringify(joinRoomPayload));      
    }    
  }

  function leaveRoom(){
    socket.emit("leave_room");
  }
}

export default App;
