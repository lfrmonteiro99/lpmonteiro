import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Banner3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 5;

    // Code blocks data
    const codeBlocks = [
      {
        language: "PHP",
        color: 0x4f5b93,
        position: new THREE.Vector3(-2, 1, 0),
        rotation: new THREE.Vector3(0.2, 0.3, 0),
      },
      {
        language: "Laravel",
        color: 0xf55247,
        position: new THREE.Vector3(-1, -1, 1),
        rotation: new THREE.Vector3(-0.1, 0.2, 0.1),
      },
      {
        language: "JavaScript",
        color: 0xffd43b,
        position: new THREE.Vector3(0, 1.5, -1),
        rotation: new THREE.Vector3(0.3, -0.2, 0),
      },
      {
        language: "Vue.js",
        color: 0x41b883,
        position: new THREE.Vector3(1, -0.5, 0),
        rotation: new THREE.Vector3(-0.2, -0.1, 0.2),
      },
      {
        language: "React",
        color: 0x61dbfb,
        position: new THREE.Vector3(2, 0.5, 1),
        rotation: new THREE.Vector3(0.1, 0.4, -0.1),
      },
      {
        language: "Symfony",
        color: 0xffffff,
        position: new THREE.Vector3(-1.5, 0, -1),
        rotation: new THREE.Vector3(0.1, -0.3, 0.2),
      },
      {
        language: "MySQL",
        color: 0x00758f,
        position: new THREE.Vector3(0, -1.5, -1),
        rotation: new THREE.Vector3(-0.3, 0.1, -0.1),
      },
      {
        language: "Git",
        color: 0xf1502f,
        position: new THREE.Vector3(1.5, 1, 1),
        rotation: new THREE.Vector3(0.2, 0.1, 0.3),
      },
    ];

    // Create code blocks
    const blocks = [];
    const blockGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.1);

    codeBlocks.forEach((block) => {
      // Create material with custom shader for code-like effect
      const blockMaterial = new THREE.MeshBasicMaterial({
        color: block.color,
        transparent: true,
        opacity: 0.7,
      });

      const mesh = new THREE.Mesh(blockGeometry, blockMaterial);
      mesh.position.copy(block.position);
      mesh.rotation.set(block.rotation.x, block.rotation.y, block.rotation.z);
      mesh.userData = {
        language: block.language,
        originalPosition: block.position.clone(),
        originalRotation: new THREE.Vector3(
          block.rotation.x,
          block.rotation.y,
          block.rotation.z
        ),
        originalScale: new THREE.Vector3(1, 1, 1),
        targetScale: new THREE.Vector3(1, 1, 1),
      };

      scene.add(mesh);
      blocks.push(mesh);
    });

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredBlock = null;

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(blocks);

      if (intersects.length > 0) {
        if (hoveredBlock !== intersects[0].object) {
          if (hoveredBlock) {
            // Reset previously hovered block
            hoveredBlock.userData.targetScale = new THREE.Vector3(1, 1, 1);
          }

          hoveredBlock = intersects[0].object;
          // Scale up hovered block
          hoveredBlock.userData.targetScale = new THREE.Vector3(1.3, 1.3, 1.3);
        }
      } else if (hoveredBlock) {
        // Reset when not hovering any block
        hoveredBlock.userData.targetScale = new THREE.Vector3(1, 1, 1);
        hoveredBlock = null;
      }
    }

    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate blocks
      blocks.forEach((block) => {
        // Smooth scale animation
        block.scale.lerp(block.userData.targetScale, 0.1);

        // Floating animation
        const time = Date.now() * 0.001;
        const offsetX = Math.sin(time + block.position.x) * 0.02;
        const offsetY = Math.cos(time + block.position.y) * 0.02;
        const offsetZ = Math.sin(time * 0.5 + block.position.z) * 0.02;

        block.position.x = block.userData.originalPosition.x + offsetX;
        block.position.y = block.userData.originalPosition.y + offsetY;
        block.position.z = block.userData.originalPosition.z + offsetZ;

        // Gentle rotation
        block.rotation.x += 0.002;
        block.rotation.y += 0.001;
      });

      // Rotate entire scene slightly based on mouse position
      scene.rotation.y += (mouse.x * 0.01 - scene.rotation.y) * 0.05;
      scene.rotation.x += (mouse.y * 0.01 - scene.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    let animationId = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationId);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of geometries and materials
      blockGeometry.dispose();
      blocks.forEach((block) => {
        if (block.material) {
          block.material.dispose();
        }
      });

      // Clear scene
      while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />
  );
};

export default Banner3D;
