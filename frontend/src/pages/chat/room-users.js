import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { useDispatch, useSelector } from "react-redux";
import { setRoomAsync } from "../../store/roomSlice";

const RoomAndUsers = ({ socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentRoom, currentUsername } = useSelector((state) => state.room);
  
  const [roomUsers, setRoomUsers] = useState([]);
  const [hasNewMessage, setHasNewMessage] = useState({
    javascript: false,
    mars: false,
    moon: false,
    sun: false,
  });

  const rooms = [
    { id: 'javascript', name: 'Earth'},
    { id: 'mars', name: 'Mars'},
    { id: 'moon', name: 'Moon'},
    { id: 'sun', name: 'Sun'}
  ]
  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      const {room, chatRoomUsers} = data;
      if(room === currentRoom){
        const currUsers = chatRoomUsers.filter( user => user.room === currentRoom)
        setRoomUsers(currUsers);
      }
    });
    return () => socket.off('chatroom_users');
  }, [socket]);

  const leaveRoom = () => {
    const __createdAt__ = Date.now();
    const updatedRoomUsers = roomUsers.filter(user => user.username !== currentUsername);
    setRoomUsers(updatedRoomUsers)
    let room = currentRoom
    let username = currentUsername;
    socket.emit('leave_room', { username, room, __createdAt__ });
    navigate('/', { replace: true });
  };

  const joinRoom = async (roomId) => {
    let room = roomId;
    await dispatch(setRoomAsync(room));
    let username = currentUsername;
    socket.emit('join_room', { username, room });  
    setHasNewMessage((prevState) => ({
      ...prevState,
      [roomId]: false,
    }));
  }
  const Indicator = ({ hasNewMessage }) => {
    const meshRef = useRef();
  
    const { color } = useSpring({
      color: hasNewMessage ? "green" : "red",
      config: { tension: 180, friction: 20 },
    });
  
    useFrame(() => {
      if (meshRef.current && hasNewMessage) {
        meshRef.current.rotation.y += 0.02; // Rotate slightly for effect
      }
    });
  
    return (
      <a.mesh ref={meshRef} position={[-1.5, 0, 0]}>
        <octahedronGeometry args={[1.5, 0]} /> 
        <a.meshStandardMaterial color={color} />
      </a.mesh>
    );
  };
  useEffect(() => {
    socket.on("notify", (room) => {
        if(room !== currentRoom){
            setHasNewMessage((prevState) => ({
          ...prevState,
          [room]: true, 
        }));
        }
    });
    return () => socket.off("notify");
  }, [socket, currentRoom, hasNewMessage]);
  return (
    <div className="border-r-[1px] border-r-white overflow-y-hidden h-[95vh] ">
      <div className="overflow-y-scroll overflow-x-hidden h-[70vh] ">
        <div className="rounded-lg rounded-e-none bg-[#5A658D] mt-2 drop-shadow-xl">
          <h2 className="mb-[60px] uppercase text-[2rem] text-[#ecfeff] pl-2" style={{textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)'}}>{currentRoom}</h2>
        </div>
        <div className="rounded-lg rounded-e-none bg-[#5A658D] mt-2 drop-shadow-xl">
          {roomUsers.length > 0 && <h5 className="text-[1.2rem] text-[#ecfeff] pl-2" style={{textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)'}}>Active Users:</h5>}
          <ul className="list-none mb-[60px] text-[#282B36] pl-2">
            {roomUsers.map((user) => (
              <li
                className="mb-[12px]"
                style={{
                  fontWeight: `${user.username === currentUsername ? 'bold' : 'normal'}`,
                }}
                key={user.id}
              >
                {user.username}
              </li>
            ))}
          </ul>
          <div className='pl-20 pb-5'>
            <button className='pl-2 btn btn-outline drop-shadow-md hover:drop-shadow-xl ' onClick={leaveRoom}>
            <p className='text-[0.82rem] text-[#ecfeff]' style={{textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)'}}>Leave</p>
            </button>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
      <div>
        {rooms.length > 0 && <h5 className=" text-[1.2rem] text-[#ecfeff]" style={{textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)'}}>Rooms:</h5>}
        <ul className="list-none pl-0 mb-[10px] text-[#5A658D]">
          {rooms.map((room) => (
           <li key={room.id} className="flex items-center mb-2 gap-2">
           <button
              className="btn h-[40px] drop-shadow-md hover:drop-shadow-xl bg-[#282B36]"
              style={{
                width: "80%", 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
              }}
              onClick={() => joinRoom(room.id)}
            >
              <Canvas style={{ width: "50px", height: "50px", display: "inline-block" }}>
                <ambientLight intensity={1.75} />
                <directionalLight position={[1, 1, 1]} />
                <Indicator hasNewMessage={hasNewMessage[room.id]}/>
              </Canvas>
              {room.name}
            </button>
         </li>
          ))}
        </ul>
      </div>
      </div>
  );
};

export default RoomAndUsers;