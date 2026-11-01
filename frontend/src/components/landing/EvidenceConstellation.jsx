import { Component, Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Html,
  Lightformer,
  Line,
  RoundedBox,
} from "@react-three/drei";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import ProofGraphVisual from "./ProofGraphVisual";

const NODES = {
  repo: {
    id: "repo",
    label: "Repository",
    meta: "payments-core",
    position: [-3.15, 1.1, 0],
    width: 1.8,
    kind: "evidence",
  },
  assessment: {
    id: "assessment",
    label: "Assessment",
    meta: "Algorithms · 91",
    position: [-3.15, 0, 0],
    width: 1.8,
    kind: "evidence",
  },
  activity: {
    id: "activity",
    label: "Contributions",
    meta: "24 months active",
    position: [-3.15, -1.1, 0],
    width: 1.8,
    kind: "evidence",
  },
  python: {
    id: "python",
    label: "Python",
    position: [-1.15, 1.62, 0],
    width: 1.32,
    kind: "skill",
  },
  fastapi: {
    id: "fastapi",
    label: "FastAPI",
    position: [-1.15, 0.54, 0],
    width: 1.32,
    kind: "skill",
  },
  postgres: {
    id: "postgres",
    label: "PostgreSQL",
    position: [-1.15, -0.54, 0],
    width: 1.32,
    kind: "skill",
  },
  docker: {
    id: "docker",
    label: "Docker",
    position: [-1.15, -1.62, 0],
    width: 1.32,
    kind: "skill",
  },
  core: {
    id: "core",
    label: "CAP",
    position: [1.05, 0, 0],
    kind: "core",
  },
  match: {
    id: "match",
    label: "MATCH",
    position: [2.9, 0, 0],
    kind: "match",
  },
};

const EDGES = [
  ["repo", "python", true],
  ["repo", "fastapi", true],
  ["repo", "docker", false],
  ["assessment", "python", true],
  ["assessment", "postgres", true],
  ["activity", "python", false],
  ["activity", "fastapi", true],
  ["activity", "postgres", true],
  ["activity", "docker", true],
  ["python", "core", true],
  ["fastapi", "core", true],
  ["postgres", "core", true],
  ["docker", "core", true],
  ["core", "match", true],
];

const LAYER_LABELS = [
  { text: "EVIDENCE", position: [-3.15, 2.24, 0] },
  { text: "VERIFIED SKILLS", position: [-1.15, 2.62, 0] },
  { text: "CAPABILITY", position: [1.05, 1.18, 0] },
  { text: "MATCH", position: [2.9, 1.32, 0] },
];

const clampScale = (width) => {
  if (width < 480) return 0.54;
  if (width < 720) return 0.68;
  if (width < 1024) return 0.84;
  return 0.98;
};

function Connection({ from, to, highlighted }) {
  const lineRef = useRef(null);

  useFrame((_, delta) => {
    const material = lineRef.current?.material;
    if (material) {
      material.dashOffset -= delta * (highlighted ? 0.72 : 0.28);
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[from, to]}
      color={highlighted ? "#38bdf8" : "#0ea5e9"}
      lineWidth={highlighted ? 1.35 : 0.65}
      transparent
      opacity={highlighted ? 0.78 : 0.22}
      dashed
      dashSize={0.1}
      gapSize={0.16}
      toneMapped={false}
    />
  );
}

function DataPulse() {
  const pulseRef = useRef(null);
  const curve = useMemo(
    () =>
      new THREE.LineCurve3(
        new THREE.Vector3(-3.15, 1.1, 0.42),
        new THREE.Vector3(1.05, 0, 0.42)
      ),
    []
  );

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.elapsedTime % 4.6) / 4.6;
    const point = curve.getPoint(t);
    pulseRef.current.position.copy(point);
    const scale = 0.7 + Math.sin(t * Math.PI) * 0.9;
    pulseRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#bae6fd" toneMapped={false} />
    </mesh>
  );
}

function NodePill({ node }) {
  const color = node.kind === "skill" ? "#38bdf8" : "#0ea5e9";

  return (
    <group position={node.position}>
      <RoundedBox args={[node.width, 0.46, 0.18]} radius={0.2} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          transmission={0.92}
          thickness={0.45}
          roughness={0.1}
          metalness={0.04}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.15}
          transparent
          opacity={0.72}
        />
      </RoundedBox>

      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[node.width * 0.9, 0.34]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} toneMapped={false} />
      </mesh>

      <Html
        center
        position={[0, 0, 0.22]}
        zIndexRange={[20, 0]}
        className="constellation-node"
        style={{ pointerEvents: "none" }}
      >
        <div className="constellation-node-inner" aria-hidden="true">
          <span className="constellation-node-label">{node.label}</span>
          {node.meta ? <span className="constellation-node-meta">{node.meta}</span> : null}
        </div>
      </Html>
    </group>
  );
}

function CapabilityCore() {
  const orbRef = useRef(null);
  const haloRef = useRef(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (orbRef.current) {
      orbRef.current.scale.setScalar(1 + Math.sin(time * 1.8) * 0.06);
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = time * 0.28;
      haloRef.current.rotation.x = Math.PI / 2.4;
    }
  });

  return (
    <group position={NODES.core.position}>
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.33, 48, 48]} />
        <meshBasicMaterial color="#0ea5e9" toneMapped={false} />
      </mesh>

      <mesh scale={1.8}>
        <sphereGeometry args={[0.33, 32, 32]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.16}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={haloRef}>
        <torusGeometry args={[0.58, 0.012, 8, 96]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.62} toneMapped={false} />
      </mesh>

      <pointLight color="#0ea5e9" intensity={4} distance={5} />

      <Html
        center
        position={[0, -0.63, 0]}
        zIndexRange={[20, 0]}
        className="constellation-node"
        style={{ pointerEvents: "none" }}
      >
        <span
          className="constellation-node-label"
          aria-hidden="true"
          style={{ fontSize: "11px", color: "#7dd3fc", letterSpacing: "0.18em" }}
        >
          CAP
        </span>
      </Html>
    </group>
  );
}

function MatchNode() {
  return (
    <group position={NODES.match.position}>
      <mesh>
        <torusGeometry args={[0.34, 0.01, 8, 80]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.3, 48]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.09} toneMapped={false} />
      </mesh>

      <Html
        center
        position={[0, 0.68, 0]}
        zIndexRange={[30, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div className="match-score-float" aria-hidden="true">
          <span className="match-score-value">94</span>
          <span className="match-score-label">MATCH</span>
        </div>
      </Html>
    </group>
  );
}

function LayerLabels() {
  return (
    <>
      {LAYER_LABELS.map(({ text, position }) => (
        <Html
          key={text}
          center
          position={position}
          zIndexRange={[12, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span className="constellation-layer-label" aria-hidden="true">
            {text}
          </span>
        </Html>
      ))}
    </>
  );
}

function GraphScene() {
  const { size } = useThree();
  const rigRef = useRef(null);
  const scale = clampScale(size.width);

  useFrame(({ pointer, clock }) => {
    if (!rigRef.current) return;
    const targetY = pointer.x * 0.16;
    const targetX = -pointer.y * 0.1;
    rigRef.current.rotation.y += (targetY - rigRef.current.rotation.y) * 0.045;
    rigRef.current.rotation.x += (targetX - rigRef.current.rotation.x) * 0.045;
    rigRef.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.06;
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={1.8} color="#38bdf8" />
      <directionalLight position={[5, -3, 4]} intensity={0.7} color="#f97316" />

      <Environment resolution={128} frames={1}>
        <Lightformer intensity={3} position={[0, 4, 3]} scale={[9, 2, 1]} color="#38bdf8" />
        <Lightformer intensity={1.4} position={[-4, -2, 2]} scale={[6, 2, 1]} color="#0ea5e9" />
        <Lightformer intensity={0.8} position={[4, 0, -2]} scale={[5, 2, 1]} color="#f97316" />
      </Environment>

      <group ref={rigRef} scale={scale}>
        <Float speed={1.15} rotationIntensity={0.1} floatIntensity={0.28}>
          {EDGES.map(([fromId, toId, highlighted]) => (
            <Connection
              key={`${fromId}-${toId}`}
              from={NODES[fromId].position}
              to={NODES[toId].position}
              highlighted={highlighted}
            />
          ))}

          {[NODES.repo, NODES.assessment, NODES.activity, NODES.python, NODES.fastapi, NODES.postgres, NODES.docker].map(
            (node) => (
              <NodePill key={node.id} node={node} />
            )
          )}

          <CapabilityCore />
          <MatchNode />
          <DataPulse />
          <LayerLabels />
        </Float>
      </group>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <Noise opacity={0.03} />
      </EffectComposer>
    </>
  );
}

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function hasWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function EvidenceConstellation() {
  const reducedMotion = usePrefersReducedMotion();
  const [webglAvailable] = useState(hasWebGL);

  if (reducedMotion || !webglAvailable) {
    return <ProofGraphVisual />;
  }

  return (
    <div
      className="constellation-canvas"
      role="img"
      aria-label="An interactive three-dimensional constellation linking evidence such as repositories, assessments and contributions to verified skills, then to a capability core and a final match score of 94."
    >
      <CanvasErrorBoundary fallback={<ProofGraphVisual />}>
        <Canvas
          dpr={[1, 1.8]}
          camera={{ position: [0, 0, 8.6], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <GraphScene />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
