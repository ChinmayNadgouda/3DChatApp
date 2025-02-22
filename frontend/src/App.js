import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Home from './pages/home';
import Chat from './pages/chat';


const socket = io.connect('http://localhost:4000'); 

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home socket={socket}/>
            }
          />
          <Route
            path='/chat'
            element={<Chat socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;