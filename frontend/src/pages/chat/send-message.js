import React, { useState} from 'react';
import { useSelector } from "react-redux";
    
const SendMessage = ({ socket}) => {
    const [message, setMessage] = useState('');
    const { currentRoom, currentUsername } = useSelector((state) => state.room);

    const handleClick = () => {
        if (message !== '') {
            const __createdAt__ = Date.now();
            let username = currentUsername;
            let room = currentRoom;
            socket.emit('send_message', { username, room, message, __createdAt__ });
            setMessage('');
        }
    };

    return (
     
      <div className="flex items-stretch p-3.5 bg-[#5A658D] rounded-lg rounded-e-lg">
        <input
          className="mr-4 drop-shadow-md hover:drop-shadow-xl rounded-lg rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1  w-80 text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder='Message...'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <img src='https://img.icons8.com/?size=100&id=RHtRRB1E4DKI&format=png&color=000000'
        alt="Send Message"
        className="h-[5%] w-[5%] cursor-pointer drop-shadow-md hover:drop-shadow-xl"
        id = "sendButton"
        onClick={handleClick}
        />
    </div>
  );
};

export default SendMessage;

