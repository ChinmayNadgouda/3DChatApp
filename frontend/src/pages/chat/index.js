import styles from './styles.module.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsersColumn from './room-users'; 
import StarBackground from "./stars"; 

const Chat = ({ socket }) => {
    return (
      <div className="max-w-[1100px] mx-auto grid grid-cols-[1fr_4fr] gap-5 ">
        <StarBackground  socket={socket} /> 
        <RoomAndUsersColumn socket={socket} />
        <div>
          <MessagesReceived socket={socket} />
          <SendMessage socket={socket} />
        </div>
      </div>
    );
  };

export default Chat;