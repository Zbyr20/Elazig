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
      {/* Üstten açık gökyüzü, alttan ovanın sıcak yansıması */}
      <hemisphereLight args={["#bcd2e0", "#6b563b", 0.95]} />
      {/* Alçak güneş: kireçtaşı surları sarıya çeker, gölgeleri uzatır */}
      <directionalLight position={[9, 11, 5]} intensity={2.1} color="#ffe9c4" />
      {/* Karşı taraftan turkuaz dolgu — su ve buz için */}
      <directionalLight position={[-9, 4, -7]} intensity={0.65} color="#6fb9c4" />
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
        <color attach="background" args={["#191714"]} />
        <fog attach="fog" args={["#191714", 12, 38]} />
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
