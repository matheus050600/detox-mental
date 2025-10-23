import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// GLSL Shaders for liquid metal effect
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  uniform float uTime;
  uniform float uDisplacementStrength;

  // Perlin noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;

    // Create liquid waves with multiple noise layers
    float noise1 = snoise(vec3(position.x * 0.5 + uTime * 0.3, position.y * 0.5, position.z * 0.5 + uTime * 0.2));
    float noise2 = snoise(vec3(position.x * 1.2 - uTime * 0.2, position.y * 1.2, position.z * 1.2 + uTime * 0.15));
    float noise3 = snoise(vec3(position.x * 2.0 + uTime * 0.1, position.y * 2.0, position.z * 2.0 - uTime * 0.25));

    // Combine noises for complex liquid movement
    float displacement = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2) * uDisplacementStrength;

    vec3 newPosition = position + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  uniform float uTime;
  uniform vec3 uColorLilac;
  uniform vec3 uColorBlue;
  uniform vec3 uColorViolet;
  uniform float uMetalness;
  uniform float uRoughness;

  void main() {
    // Dynamic color mixing based on position and time
    float mixFactor1 = sin(vPosition.x * 2.0 + uTime * 0.5) * 0.5 + 0.5;
    float mixFactor2 = cos(vPosition.y * 2.0 - uTime * 0.3) * 0.5 + 0.5;

    vec3 color1 = mix(uColorLilac, uColorBlue, mixFactor1);
    vec3 color2 = mix(color1, uColorViolet, mixFactor2);

    // Add metallic highlights based on normal
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);

    // Metallic reflection simulation
    vec3 finalColor = color2 + vec3(fresnel * 0.3);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function LiquidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisplacementStrength: { value: 0.8 },
      uColorLilac: { value: new THREE.Color('#A78BFA') },
      uColorBlue: { value: new THREE.Color('#7DD3FC') },
      uColorViolet: { value: new THREE.Color('#5B21B6') },
      uMetalness: { value: 1.0 },
      uRoughness: { value: 0.2 },
    }),
    []
  );

  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      // Slow rotation for liquid effect
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[2.5, 2.5, 2.5]}>
      <icosahedronGeometry args={[1, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function LiquidMetalBackground() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Ambient light for base illumination */}
        <ambientLight intensity={0.4} />

        {/* Directional lights for metallic reflections */}
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -5, 2]} intensity={0.6} color="#A78BFA" />
        <directionalLight position={[0, -5, -5]} intensity={0.8} color="#7DD3FC" />

        {/* Point lights for dynamic highlights */}
        <pointLight position={[2, 2, 2]} intensity={0.8} color="#7DD3FC" />
        <pointLight position={[-2, -2, 1]} intensity={0.6} color="#A78BFA" />

        {/* Liquid metal mesh */}
        <LiquidMesh />

        {/* Optional: Enable orbit controls for testing (remove in production) */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
}
