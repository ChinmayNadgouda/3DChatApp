import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, setUsername, currRoom, setRoom }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();
  const rooms = [
    { id: 'javascript', name: 'JavaScript'},
    { id: 'node', name: 'Node'},
    { id: 'express', name: 'Express'},
    { id: 'react', name: 'React'}
  ]
  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      const {room, chatRoomUsers} = data;
      if(room === currRoom){
        const currUsers = chatRoomUsers.filter( user => user.room === currRoom)
        setRoomUsers(currUsers);
      }
    });

    return () => socket.off('chatroom_users');
  }, [socket, currRoom]);

  const leaveRoom = () => {
    const __createdAt__ = Date.now();
    const updatedRoomUsers = roomUsers.filter(user => user.username !== username);
    setRoomUsers(updatedRoomUsers)
    let room = currRoom
    socket.emit('leave_room', { username, room, __createdAt__ });
    navigate('/', { replace: true });
  };

  const joinRoom = (roomId) => {
    setRoom(roomId);
    let room = roomId;
    socket.emit('join_room', { username, room });  
  }

  return (
    <div className={styles.roomAndUsersColumn}>
      <h2 className={styles.roomTitle}>{currRoom}</h2>

      <div>
        {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
        <ul className={styles.usersList}>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
              }}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <button className='btn btn-outline' onClick={leaveRoom}>
        Leave
      </button>
      <div>
        {rooms.length > 0 && <h5 className={styles.usersTitle}>Rooms:</h5>}
        <ul className={styles.usersList}>
          {rooms.map((room) => (
            <li
              key={room.id}
            >
              <button
                className='btn btn-secondary'
                style={{ width: '70%' }}
                onClick={() => joinRoom(room.id)}
              >
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