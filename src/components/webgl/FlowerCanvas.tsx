"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBO, ScreenQuad } from "@react-three/drei";
import * as THREE from "three";

/* ---------------- shaders ---------------- */

const SIM_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Ping-pong accumulation: decay the previous frame, stamp a flower along the
// pointer path. Green petals, gold core; colour hashed per stamp.
const SIM_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uAspect;
  uniform float uVel;
  uniform float uActive;
  uniform float uTime;
  uniform float uDecay;
  varying vec2 vUv;

  float flowerMask(vec2 p, float size, float seed) {
    p.x *= uAspect;
    float a = atan(p.y, p.x);
    float r = length(p);
    float petals = 5.0 + floor(mod(seed * 3.0, 3.0));
    // sharper petal silhouette so blooms read as distinct flowers
    float lobe = pow(abs(cos(petals * a + seed * 6.2831)), 0.7);
    float shape = size * (0.35 + 0.65 * lobe);
    return 1.0 - smoothstep(shape * 0.78, shape, r);
  }

  void main() {
    vec4 prev = texture2D(uPrev, vUv);
    vec3 col = prev.rgb;
    float a = prev.a * uDecay;

    vec3 forest = vec3(0.039, 0.349, 0.200);
    vec3 fern   = vec3(0.043, 0.561, 0.247);
    vec3 leaf   = vec3(0.478, 0.788, 0.263);
    vec3 gold   = vec3(1.000, 0.843, 0.000);

    float seed = floor(uTime * 5.0);
    float petalMix = fract(sin(seed * 12.9898) * 43758.5453);
    vec3 petalCol = mix(mix(forest, fern, petalMix), leaf, petalMix * 0.7);

    float stamp = 0.0;
    float core = 0.0;
    float size = 0.05 + clamp(uVel, 0.0, 1.0) * 0.09;
    for (int i = 0; i < 6; i++) {
      float t = float(i) / 5.0;
      vec2 m = mix(uPrevMouse, uMouse, t);
      stamp = max(stamp, flowerMask(vUv - m, size, seed + float(i) * 1.7));
      vec2 d = (vUv - m); d.x *= uAspect;
      core = max(core, 1.0 - smoothstep(size * 0.12, size * 0.3, length(d)));
    }
    stamp *= uActive;
    core *= uActive;

    vec3 addCol = mix(petalCol, gold, core);
    col = mix(col, addCol, max(stamp, core));
    a = max(a, max(stamp, core));

    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  }
`;

const DISP_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uMap, vUv);
    gl_FragColor = vec4(c.rgb, c.a * uOpacity);
  }
`;

/* ---------------- simulation ---------------- */

function Sim({ opacity, intensity }: { opacity: number; intensity: number }) {
  const { gl, size } = useThree();
  const w = Math.max(2, Math.floor(size.width * 0.7));
  const h = Math.max(2, Math.floor(size.height * 0.7));

  const opts = { type: THREE.HalfFloatType, depthBuffer: false, stencilBuffer: false };
  const fboA = useFBO(w, h, opts);
  const fboB = useFBO(w, h, opts);
  const targets = useRef({ read: fboA, write: fboB });

  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const prev = useRef(new THREE.Vector2(0.5, 0.5));
  const lastMove = useRef(0);

  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCam = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  const simMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SIM_VERT,
        fragmentShader: SIM_FRAG,
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uPrev: { value: null },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: size.width / size.height },
          uVel: { value: 0 },
          uActive: { value: 0 },
          uTime: { value: 0 },
          uDecay: { value: 0.983 },
        },
      }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const dispRef = useRef<THREE.ShaderMaterial>(null);

  useMemo(() => {
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat);
    quad.frustumCulled = false;
    simScene.add(quad);
  }, [simScene, simMat]);

  // pointer tracking in canvas-local uv (effect, not memo — needs cleanup)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      target.current.set(x, y);
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame((state) => {
    if (document.hidden) return;
    const idle = performance.now() - lastMove.current > 2200;

    prev.current.copy(mouse.current);
    mouse.current.lerp(target.current, 0.25);
    const vel = mouse.current.distanceTo(prev.current) * 60;
    const active = idle ? 0 : 1;

    simMat.uniforms.uPrev.value = targets.current.read.texture;
    (simMat.uniforms.uMouse.value as THREE.Vector2).copy(mouse.current);
    (simMat.uniforms.uPrevMouse.value as THREE.Vector2).copy(prev.current);
    simMat.uniforms.uVel.value = Math.min(vel, 1) * intensity;
    simMat.uniforms.uActive.value = active;
    simMat.uniforms.uAspect.value = size.width / size.height;
    simMat.uniforms.uTime.value = state.clock.elapsedTime;

    gl.setRenderTarget(targets.current.write);
    gl.render(simScene, simCam);
    gl.setRenderTarget(null);

    const t = targets.current.read;
    targets.current.read = targets.current.write;
    targets.current.write = t;

    if (dispRef.current) dispRef.current.uniforms.uMap.value = targets.current.read.texture;
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={dispRef}
        transparent
        depthTest={false}
        depthWrite={false}
        vertexShader={SIM_VERT}
        fragmentShader={DISP_FRAG}
        uniforms={{ uMap: { value: null }, uOpacity: { value: opacity } }}
      />
    </ScreenQuad>
  );
}

export default function FlowerCanvas({
  opacity = 0.85,
  intensity = 1,
  frameloop = "always",
}: {
  opacity?: number;
  intensity?: number;
  frameloop?: "always" | "never" | "demand";
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ alpha: true, antialias: false, premultipliedAlpha: false }}
      dpr={[1, 1.75]}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      frameloop={frameloop}
      style={{ pointerEvents: "none" }}
    >
      <Sim opacity={opacity} intensity={intensity} />
    </Canvas>
  );
}
