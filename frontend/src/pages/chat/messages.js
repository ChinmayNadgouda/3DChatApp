import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';
import { Tilt } from 'react-tilt';
import { useSelector } from "react-redux";

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);

  const messagesColumnRef = useRef(null); 
  
  const { currentRoom, currentUsername } = useSelector((state) => state.room);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if(currentRoom == data.room){
        setMessagesReceived((state) => [
          ...state,
          {
            message: data.message,
            username: data.username,
            __createdAt__: data.__createdAt__,
            room: data.room
          },
        ]);
      }
    });

    return () => socket.off('receive_message');
  }, [socket, currentRoom]);

  useEffect(() => {
    socket.on('last_100_messages', (last100Messages) => {
      console.log('Last 100 messages:', last100Messages);
      const oldMessages = last100Messages.filter( user => user.message !== undefined)
      setMessagesReceived((state) => [...oldMessages]);
    });

    return () => socket.off('last_100_messages');
  }, [socket]);

  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved]);

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    
    <div className="overflow-auto h-[90vh] pr-0.5 pl-0.5 pt-0.5 pb-0.5 overflow-x-hidden" ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => (
        <Tilt>        
          <div className={`${msg.username === currentUsername ? styles.messageMe : styles.message}`} key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-[#9898C9] text-[0.75rem]">{msg.username}</span>
            <span className="text-[#9898C9] text-[0.75rem]">
              {formatDateFromTimestamp(msg.__createdAt__)}
            </span>
          </div>
          <p className="text-white">{msg.message}</p>
          <br />
        </div>
        </Tilt>
      ))}
    </div>
  );
};

export default Messages;