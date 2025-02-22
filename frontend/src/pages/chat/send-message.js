import styles from './styles.module.css';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSelector } from "react-redux";
    
const SendMessage = ({ socket}) => {
    const [message, setMessage] = useState('');
    const { currentRoom, currentUsername } = useSelector((state) => state.room);
    // const mountRef = useRef(null);
    // const messageBubbleRef = useRef(null);

    // useEffect(() => {
    //     const scene = new THREE.Scene();
    //     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
    //     const renderer = new THREE.WebGLRenderer();
    //     renderer.setClearColor( 0xffffff, 0);

    //     renderer.setSize(window.innerWidth/50, window.innerHeight/20);
    //     mountRef.current.appendChild(renderer.domElement);
        
    //     const geometry = new THREE.SphereGeometry(2, 32, 32);
    //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //     const messageBubble = new THREE.Mesh(geometry, material);
    //     scene.add(messageBubble);
        
    //     camera.position.z = 5;
    //     messageBubbleRef.current = messageBubble; 

    //     function render() {
    //         requestAnimationFrame(render);
    //         renderer.render(scene, camera);
    //     }
    //     render();

    //     return () => {
    //         if(mountRef.current){
    //             mountRef.current.removeChild(renderer.domElement);
    //         }
    //     };
    // }, []);

    const handleClick = () => {
        // if (!messageBubbleRef.current) return;

        // let start = { x: -2, y: -2, z: 0 };
        // let end = { x: 2, y: 2, z: 0 };
        // messageBubbleRef.current.position.set(start.x, start.y, start.z);
        
        // let progress = 0;
        // function animate() {
        //     if (progress < 1) {
        //         progress += 0.02;
        //         messageBubbleRef.current.position.x = start.x + (end.x - start.x) * progress;
        //         messageBubbleRef.current.position.y = start.y + (end.y - start.y) * progress;
        //         requestAnimationFrame(animate);
        //     }
        // }
        // animate();
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
        className="h-[5%] w-[5%] cursor-pointer"
        id = "sendButton"
        onClick={handleClick}
        />
    
    </div>
  );
};

export default SendMessage;

