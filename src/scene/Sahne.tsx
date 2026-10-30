import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { scrollState } from "../scroll";
import { Bag, BuzlukMagarasi, Harput, HazarGolu, KebanBaraji } from "./Modeller";

/** Modeller dikey bir eksende sıralanır; kaydırma bu eksende bir iniştir. */
const ARALIK = 16;
const MODELLER = [Harput, HazarGolu, KebanBaraji, BuzlukMagarasi, Bag];
const TOPLAM_DUSUS = ARALIK * (MODELLER.length - 1);

function Kamera() {
  const { camera } = useThree();
  const hedef = useRef(new THREE.Vector3());
  const bakis = useRef(new THREE.Vector3());
  const ilkKare = useRef(true);

  useFrame((_, delta) => {
    const p = scrollState.progress;
    const azalt = scrollState.reducedMotion;

    // İniş sayfanın ilk %78'inde tamamlanır; kalan bölümler bağda geçer.
    const inis = Math.min(p / 0.78, 1);

    // Kaydırdıkça kamera hem alçalır hem de modelin çevresinde döner.
    const aci = p * Math.PI * (azalt ? 0.6 : 2.4) + 0.4;
    const yaricap = 13 + Math.sin(inis * Math.PI) * 2.2;
    const merkezY = -inis * TOPLAM_DUSUS;

    hedef.current.set(
      Math.sin(aci) * yaricap,
      merkezY + 4.6 - Math.sin(inis * Math.PI) * 2.4,
      Math.cos(aci) * yaricap,
    );
    bakis.current.set(0, merkezY, 0);

    // Yumuşatma: kaydırma dursa bile kamera hedefe akıcı şekilde oturur.
    const k = ilkKare.current || azalt ? 1 : 1 - Math.pow(0.0015, delta);
    ilkKare.current = false;

    camera.position.lerp(hedef.current, k);
    camera.lookAt(bakis.current);
  });

  return null;
}

function Isiklar() {
  return (
    <>
      <hemisphereLight args={["#9fb6c4", "#14161a", 0.75]} />
      <directionalLight position={[8, 12, 6]} intensity={1.45} color="#f0e3cd" />
      <directionalLight position={[-9, 4, -7]} intensity={0.5} color="#4a8c8c" />
    </>
  );
}

export default function Sahne() {
  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden="true"
      // Sahne tamamen dekoratiftir; tıklama ve kaydırma sayfaya geçmelidir.
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 42, near: 0.1, far: 120, position: [6, 5, 12] }}
      >
        <color attach="background" args={["#141619"]} />
        <fog attach="fog" args={["#141619", 11, 34]} />
        <Isiklar />
        <Kamera />
        {MODELLER.map((Model, i) => (
          <group key={i} position={[0, -i * ARALIK, 0]}>
            <Model />
          </group>
        ))}
      </Canvas>
    </div>
  );
}
