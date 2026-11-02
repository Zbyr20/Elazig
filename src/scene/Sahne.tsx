import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { duvarlar } from "../data/icerik";
import { kitabeDokusu } from "./kitabe";
import { scrollState } from "../scroll";

/* ------------------------------------------------------------ kamera yolu

   Kaydırma kamerayı kulenin çevresinde döndürürken aynı anda aşağı indirir:
   her durak bir sonraki duvarın kitabesinin tam karşısıdır.
--------------------------------------------------------------------------- */

type Durak = { aci: number; yuk: number; uzak: number; bakY: number };

const DURAKLAR: Durak[] = [
  { aci: -34, yuk: 15.5, uzak: 43, bakY: 1.0 },           // giriş: bütün kule
  ...duvarlar.map((d) => ({
    aci: d.kamera.aci,
    yuk: d.kamera.yukseklik,
    uzak: 15.6,
    bakY: d.kamera.yukseklik,
  })),
  { aci: 318, yuk: -3.0, uzak: 36, bakY: -2.0 },          // kapanış: geri çekil
];

const yumusat = (t: number) => t * t * (3 - 2 * t);

function araDeger(p: number) {
  const n = DURAKLAR.length - 1;
  const x = Math.min(Math.max(p, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  const t = yumusat(x - i);
  const a = DURAKLAR[i];
  const b = DURAKLAR[i + 1];
  return {
    aci: a.aci + (b.aci - a.aci) * t,
    yuk: a.yuk + (b.yuk - a.yuk) * t,
    uzak: a.uzak + (b.uzak - a.uzak) * t,
    bakY: a.bakY + (b.bakY - a.bakY) * t,
  };
}

function Kamera() {
  const { camera, size } = useThree();
  const hedef = useRef(new THREE.Vector3());
  const bak = useRef(new THREE.Vector3());
  const ilk = useRef(true);

  useFrame((_, delta) => {
    const d = araDeger(scrollState.progress);
    const a = (d.aci * Math.PI) / 180;

    hedef.current.set(Math.sin(a) * d.uzak, d.yuk, Math.cos(a) * d.uzak);
    bak.current.set(0, d.bakY, 0);

    // Geniş ekranda kuleyi sağa kaydır ki solda metin için yer kalsın.
    const genis = size.width > 900;
    if (genis) {
      const sag = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a));
      const kaydir = 3.4;
      hedef.current.addScaledVector(sag, -kaydir);
      bak.current.addScaledVector(sag, -kaydir);
    }

    const k = ilk.current || scrollState.reducedMotion ? 1 : 1 - Math.pow(0.0009, delta);
    ilk.current = false;
    camera.position.lerp(hedef.current, k);
    camera.lookAt(bak.current);
  });
  return null;
}

/* ------------------------------------------------------------------ kule */

function Kule() {
  const gltf = useLoader(GLTFLoader, `${import.meta.env.BASE_URL}kule.glb`);

  const sahne = useMemo(() => {
    const s = gltf.scene.clone(true);
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return s;
  }, [gltf]);

  const paneller = useMemo(
    () =>
      duvarlar.map((d) => ({
        id: d.id,
        konum: d.panel.konum,
        donus: d.panel.donus,
        doku: kitabeDokusu(d.id, d.ad, d.tur),
      })),
    [],
  );

  return (
    <group>
      <primitive object={sahne} />
      {paneller.map((p) => (
        <mesh key={p.id} position={p.konum} rotation={p.donus} receiveShadow>
          <planeGeometry args={[4.36, 3.38]} />
          <meshStandardMaterial map={p.doku} roughness={0.86} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ----------------------------------------------------------------- ışık */

function Isiklar() {
  const gunes = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    // Güneş kamerayla birlikte dönsün: hangi duvara baksak taş yandan
    // ışık alsın, derzler gölge versin.
    const d = araDeger(scrollState.progress);
    const a = ((d.aci - 48) * Math.PI) / 180;
    gunes.current?.position.set(Math.sin(a) * 26, 22, Math.cos(a) * 26);
  });

  return (
    <>
      <hemisphereLight args={["#cfe0ec", "#6d5a3f", 1.15]} />
      <directionalLight
        ref={gunes}
        intensity={2.6}
        color="#ffe6bd"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0012}
      />
      <directionalLight position={[-14, -6, -10]} intensity={0.35} color="#8fb6c6" />
    </>
  );
}

export default function Sahne() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 38, near: 0.5, far: 180, position: [0, 15, 38] }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.04;
          scene.fog = new THREE.Fog("#17130e", 34, 96);
        }}
      >
        <color attach="background" args={["#17130e"]} />
        <Isiklar />
        <Kamera />
        <Suspense fallback={null}>
          <Kule />
        </Suspense>
      </Canvas>
    </div>
  );
}
