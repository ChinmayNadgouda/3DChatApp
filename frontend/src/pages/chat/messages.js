import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';
import { Tilt } from 'react-tilt';
import { useSelector } from "react-redux";

const getLast100Messages = async (room) => {
  if (room) {
    const rpcRequest = {
      jsonrpc: "2.0",
      method: "getLast100Messages",
      params: { query: room },
      id: 1, // Unique request ID
    };
    const response = await fetch("http://localhost:4000/jsonrpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rpcRequest),
    });
    const data = await response.json();
    if (data.result) {
      return data.result;
    }
  } else {
    console.log('No room specified to retrieve last 100 messages!')
  }
}

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [messageQueue, setMessageQueue] = useState([]); // Buffer messages when spin is false

  const messagesColumnRef = useRef(null); 
  
  const { currentRoom, currentUsername, spin } = useSelector((state) => state.room);
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data.room === currentRoom) {
        if (spin) {
          setMessagesReceived((prev) => [
            ...prev,
            { message: data.message, username: data.username, __createdAt__: data.__createdAt__, room: data.room }
          ]);
        } else {
          setMessageQueue((prev) => [...prev, data]);
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket, currentRoom, spin]);

  useEffect(() => {
    if (spin && messageQueue.length > 0) {
      setMessagesReceived((prev) => [...prev, ...messageQueue]);
      setMessageQueue([]); 
    }
  }, [spin, messageQueue]);
  
  useEffect(() => {
    getLast100Messages(currentRoom).then( last100Messages => {
      const oldMessages = last100Messages.filter( user => user.message !== undefined)
    setMessagesReceived((state) => [...oldMessages]);
    });
  }, [currentRoom]);

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
          <div className={`${msg.username === currentUsername ? styles.messageMe : styles.message}  p-2 rounded-lg max-w-[80%] break-words`} key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-[#9898C9] text-[0.75rem]">{msg.username}</span>
            <span className="text-[#9898C9] text-[0.75rem]">
              {formatDateFromTimestamp(msg.__createdAt__)}
            </span>
          </div>
          <p className="text-white whitespace-pre-wrap">{msg.message}</p>
          <br />
        </div>
        </Tilt>
      ))}
    </div>
  );
};

export default Messages;