import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from "react-redux";
import { setRoom, setUsername } from "../../store/roomSlice";
const Home = ({socket}) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { currentRoom, currentUsername } = useSelector((state) => state.room);

    const joinRoom = () => {
        if (currentRoom !== '' && currentUsername !== '') {
          let room = currentRoom;
          let username = currentUsername;
          console.log(socket);
          socket.emit('join_room', { username, room });
          console.log(socket);
        }
        navigate('/chat', { replace: true });
    };

    return (
      <div className="h-screen w-full flex justify-center items-center dark:bg-gray-700">
        <div className="p-8 gap-8 bg-indigo-300 rounded-md flex flex-col items-center drop-shadow-[0_200px_130px_rgba(1, 1, 1, 1)] ">
        <h1 className="font-bold">{`Planet Chat-rooms`}</h1>
        <div className="flex">
        <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
          </svg>
        </span>
        
          <input
            className="drop-shadow-md hover:drop-shadow-xl rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1  w-80 text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            placeholder='Username...'
            onChange={(e) => dispatch(setUsername(e.target.value))} 
          />
          </div>
          <select
            className="drop-shadow-md hover:drop-shadow-xl bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => dispatch(setRoom(e.target.value))} 
          >
            <option>-- Select Room --</option>
            <option value='javascript'>Earth</option>
            <option value='mars'>Mars</option>
            <option value='moon'>Moon</option>
            <option value='sun'>Sun</option>
          </select>
        
        <button 
          className='btn btn-secondary drop-shadow-md hover:drop-shadow-xl'
          style={{ width: '100%' }}
          onClick={joinRoom}
        >
          <span className='block text-center'> Join Room </span>
        </button>
        </div>
      </div>
    );
  };

export default Home;