import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useDispatch } from "react-redux";
import { setSpin } from "../../store/roomSlice";

const StarBackground = ({socket}) => {
  const dispatch = useDispatch();
  const mountRef = useRef(null);
  
  let rotating = 0.0005;
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const loader = new THREE.TextureLoader();

    const starMaterial = new THREE.PointsMaterial({  
      map: loader.load("https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png"),
      transparent: true, 
      size: 10 
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 500;

    
    const animate = () => {
      requestAnimationFrame(animate);
      if(stars){
        stars.rotation.y += rotating; 
      }
      renderer.render(scene, camera);
    };
    animate();

    const resizeRendererToDisplaySize = (renderer) => {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      // resize only when necessary
      if (needResize) {
        //3rd parameter `false` to change the internal canvas size
        renderer.setSize(width, height, false);
      }
      return needResize;
    };
    
    const render = (time) => {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        // changing the camera aspect to remove the strechy problem
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      stars.position.x = mouseX * 0.01;
      stars.position.y = mouseY * -0.01;
    
       // Re-render the scene
      renderer.render(scene, camera);
       // loop
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    socket.on("spin", (room) => {
      dispatch(setSpin(false));
      rotating = 0.5; // Rotate stars fast
      setTimeout(() => {
            dispatch(setSpin(true));
            rotating= 0.0005; // Rotate stars slightly
      }, 1000);
    });
        
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      socket.off("spin");  
      window.removeEventListener("resize", handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose(); 
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1 }}
    />
  );
};

export default StarBackground;
