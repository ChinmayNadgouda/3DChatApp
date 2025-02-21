import styles from './styles.module.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsersColumn from './room-users'; 

const Chat = ({ username, setUsername, room, setRoom, socket }) => {
    return (
      <div className={styles.chatContainer}>
        <RoomAndUsersColumn socket={socket} username={username} setUsername={setUsername} currRoom={room} setRoom={setRoom} />
        <div>
          <MessagesReceived usern={username} room={room} socket={socket} />
          <SendMessage socket={socket} username={username} room={room} />
        </div>
      </div>
    );
  };

export default Chat;