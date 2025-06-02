// src/components/ThreeScene.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeScene({
  modelPath = '/models/default_model.gltf', // Varsayılan model
  height = '600px' // Varsayılan yükseklik
}) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    // ... (önceki useEffect içeriğinizin geri kalanı aynı kalacak) ...
    // Sadece renderer ve kamera aspect ratio ayarlarında mountRef.current.clientHeight kullanılacak.
    // Ve en sonda return edilen div'in style'ı güncellenecek.

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controlsRef.current = controls;

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const desiredSize = 3;
        const scale = desiredSize / maxDim;
        model.scale.set(scale, scale, scale);
        scene.add(model);
        controls.target.copy(model.position);
        controls.update();
      },
      undefined,
      (error) => {
        console.error('Model yüklenirken bir hata oluştu:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [modelPath, height]); // height'ı bağımlılıklara ekle

  return <div ref={mountRef} style={{ width: '100%', height: height, border: '1px solid black' }} />;
}