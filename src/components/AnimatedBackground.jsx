import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070f24, 1);
    mount.appendChild(renderer.domElement);

    // ── Particles ──
    const PARTICLE_COUNT = 300;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Mix between orange-red and cyan-blue
      const t = Math.random();
      if (t < 0.5) {
        colors[i * 3]     = 1.0;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.1;
      } else {
        colors[i * 3]     = 0.1 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 2] = 1.0;
      }

      sizes[i] = Math.random() * 3 + 1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + position.x * 0.7) * 0.12;
          pos.x += cos(uTime * 0.4 + position.z * 0.5) * 0.08;
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.1, 0.0, d);
          // float glow = exp(-d * 4.0) * 0.8;
          gl_FragColor = vec4(vColor , alpha * 0.65);
        }
      `,
      uniforms: { uTime: { value: 0 } },
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Connection Lines ──
    const lineGroup = new THREE.Group();
    scene.add(lineGroup);
    const MAX_DIST = 2.2;

    const pts = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pts.push(new THREE.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]));
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dist = pts[i].distanceTo(pts[j]);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.4;
          const geo = new THREE.BufferGeometry().setFromPoints([pts[i], pts[j]]);
          const mat = new THREE.LineBasicMaterial({
            color: 0x3a7fff,
            transparent: true,
            opacity: alpha,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          lineGroup.add(new THREE.Line(geo, mat));
        }
      }
    }

    // ── Floating Geometric Shapes ──
    const shapes = [];
    const shapeGeos = [
      new THREE.IcosahedronGeometry(0.18, 0),
      new THREE.OctahedronGeometry(0.22, 0),
      new THREE.TetrahedronGeometry(0.20, 0),
    ];

    for (let i = 0; i < 12; i++) {
      const geo = shapeGeos[i % shapeGeos.length];
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff4a1c : 0x3a7fff,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 1,
      );
      mesh.userData.rotSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.012,
        z: (Math.random() - 0.5) * 0.008,
      };
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      scene.add(mesh);
      shapes.push(mesh);
    }

    // ── Grid Floor ──
    const gridHelper = new THREE.GridHelper(20, 24, 0x1a3a6a, 0x0d1f3c);
    gridHelper.position.y = -3.5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;
    gridHelper.material.blending = THREE.AdditiveBlending;
    scene.add(gridHelper);

    // ── Mouse parallax ──
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.9;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation ──
    let t = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;

      particleMat.uniforms.uTime.value = t;
      particles.rotation.y = t * 0.04 + mouseX * 0.3;
      particles.rotation.x = mouseY * 0.2;

      lineGroup.rotation.y = t * 0.04 + mouseX * 0.3;
      lineGroup.rotation.x = mouseY * 0.2;

      shapes.forEach((s) => {
        s.rotation.x += s.userData.rotSpeed.x;
        s.rotation.y += s.userData.rotSpeed.y;
        s.rotation.z += s.userData.rotSpeed.z;
        s.position.y += Math.sin(t + s.userData.floatOffset) * 0.003;
      });

      gridHelper.position.z = (t * 0.3) % 1;

      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}