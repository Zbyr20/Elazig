import { useMemo } from "react";
import * as THREE from "three";

/** Sabit tohumlu basit rastgelelik: her yüklemede aynı siluet çıksın diye. */
function rastgele(tohum: number) {
  let t = tohum;
  return () => {
    t = (t * 1664525 + 1013904223) % 4294967296;
    return t / 4294967296;
  };
}

const TAS = "#3a3d44";
const TAS_ACIK = "#50545d";
const SU = "#4a8c8c";
const BUZ = "#9fd4dc";
const UZUM = "#6b2639";

function TasMalzeme({ renk = TAS }: { renk?: string }) {
  return <meshStandardMaterial color={renk} roughness={0.95} metalness={0.02} flatShading />;
}

/* ---------------------------------------------------------------- Harput */

export function Harput() {
  const bloklar = useMemo(() => {
    const r = rastgele(7);
    return Array.from({ length: 14 }, () => {
      const a = r() * Math.PI * 2;
      const d = 1.1 + r() * 2.9;
      return {
        p: [Math.cos(a) * d, 0.9 + r() * 1.9, Math.sin(a) * d] as const,
        o: [0.7 + r() * 0.8, 1.4 + r() * 2.6, 0.7 + r() * 0.8] as const,
        d: r() * 0.5,
      };
    });
  }, []);

  return (
    <group>
      {/* Ovaya hâkim kaya kütlesi */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[5.2, 6.4, 2.8, 7, 1]} />
        <TasMalzeme renk="#33363c" />
      </mesh>

      {/* Kalenin kayayı izleyen blokları */}
      {bloklar.map((b, i) => (
        <mesh key={i} position={[b.p[0], b.p[1] - 0.2, b.p[2]]} rotation={[0, b.d, 0]}>
          <boxGeometry args={[b.o[0], b.o[1], b.o[2]]} />
          <TasMalzeme renk={i % 3 === 0 ? TAS_ACIK : TAS} />
        </mesh>
      ))}

      {/* Ulu Camii'nin eğik minaresi */}
      <group position={[3.4, 1.2, -1.6]} rotation={[0, 0, 0.11]}>
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.3, 0.38, 5, 10]} />
          <TasMalzeme renk={TAS_ACIK} />
        </mesh>
        <mesh position={[0, 5.2, 0]}>
          <coneGeometry args={[0.44, 0.9, 10]} />
          <TasMalzeme renk="#5c6069" />
        </mesh>
      </group>
    </group>
  );
}

/* ----------------------------------------------------------- Hazar Gölü */

export function HazarGolu() {
  const sutunlar = useMemo(() => {
    const r = rastgele(23);
    const liste: { p: readonly [number, number, number]; h: number }[] = [];
    for (let sira = 0; sira < 2; sira++) {
      for (let i = 0; i < 6; i++) {
        liste.push({
          p: [-3.4 + i * 1.36, 0, sira === 0 ? -1.1 : 1.1] as const,
          h: 1.5 + r() * 1.4,
        });
      }
    }
    return liste;
  }, []);

  return (
    <group>
      {/* Çevreleyen tektonik çanak */}
      <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.4, 9.6, 9]} />
        <TasMalzeme renk="#2f3238" />
      </mesh>

      {/* Suyun yüzeyi */}
      <mesh position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.2, 48]} />
        <meshStandardMaterial
          color={SU}
          transparent
          opacity={0.42}
          roughness={0.12}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Suyun altında kalan yerleşimin izleri */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[6.6, 7, 0.5, 9]} />
        <TasMalzeme renk="#272a2f" />
      </mesh>
      {sutunlar.map((s, i) => (
        <mesh key={i} position={[s.p[0], -1.95 + s.h / 2, s.p[2]]}>
          <cylinderGeometry args={[0.2, 0.24, s.h, 8]} />
          <TasMalzeme renk="#4a4e57" />
        </mesh>
      ))}
      <mesh position={[0, -1.6, 2.9]}>
        <boxGeometry args={[8.2, 0.7, 0.4]} />
        <TasMalzeme renk="#44474f" />
      </mesh>
    </group>
  );
}

/* --------------------------------------------------------- Keban Barajı */

export function KebanBaraji() {
  const govde = useMemo(() => {
    const sekil = new THREE.Shape();
    sekil.absarc(0, 0, 6.2, Math.PI * 0.18, Math.PI * 0.82, false);
    sekil.absarc(0, 0, 5.3, Math.PI * 0.82, Math.PI * 0.18, true);
    sekil.closePath();
    return new THREE.ExtrudeGeometry(sekil, { depth: 4.6, bevelEnabled: false });
  }, []);

  return (
    <group>
      {/* Vadi duvarları */}
      <mesh position={[-6.6, -0.4, 0]} rotation={[0, 0, -0.24]}>
        <boxGeometry args={[3.4, 6.4, 9]} />
        <TasMalzeme renk="#34373d" />
      </mesh>
      <mesh position={[6.6, -0.4, 0]} rotation={[0, 0, 0.24]}>
        <boxGeometry args={[3.4, 6.4, 9]} />
        <TasMalzeme renk="#34373d" />
      </mesh>

      {/* Kavisli baraj gövdesi */}
      <mesh geometry={govde} position={[0, -2.3, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <TasMalzeme renk="#565a63" />
      </mesh>

      {/* Gövdenin ardında biriken su */}
      <mesh position={[0, 1.5, -4.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.4, 8.4]} />
        <meshStandardMaterial
          color={SU}
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Suyun örttüğü eski vadi tabanı */}
      <mesh position={[0, -2.5, -4.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.4, 8.4]} />
        <TasMalzeme renk="#282b30" />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------- Buzluk Mağarası */

export function BuzlukMagarasi() {
  const kristaller = useMemo(() => {
    const r = rastgele(91);
    return Array.from({ length: 16 }, () => ({
      p: [-2.6 + r() * 5.2, -1.6 + r() * 3.1, -1.2 + r() * 2.2] as const,
      o: 0.18 + r() * 0.42,
      d: [r() * 3, r() * 3, r() * 3] as const,
    }));
  }, []);

  return (
    <group>
      {/* Kayanın kesiti */}
      <mesh position={[-4.4, 0, 0]}>
        <boxGeometry args={[3.6, 7.2, 5.4]} />
        <TasMalzeme renk="#34373d" />
      </mesh>
      <mesh position={[4.4, 0, 0]}>
        <boxGeometry args={[3.6, 7.2, 5.4]} />
        <TasMalzeme renk="#34373d" />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[12.4, 1.6, 5.4]} />
        <TasMalzeme renk="#3d4047" />
      </mesh>
      <mesh position={[0, -2.9, 0]}>
        <boxGeometry args={[12.4, 1.6, 5.4]} />
        <TasMalzeme renk="#2c2f34" />
      </mesh>

      {/* Yer altı hava akımının soğuttuğu iç boşluk */}
      <mesh position={[0, 0.1, -1.9]}>
        <boxGeometry args={[5.2, 4.4, 1.6]} />
        <TasMalzeme renk="#212428" />
      </mesh>

      {/* Buz katmanları */}
      {kristaller.map((k, i) => (
        <mesh key={i} position={[k.p[0], k.p[1], k.p[2]]} rotation={[k.d[0], k.d[1], k.d[2]]}>
          <octahedronGeometry args={[k.o, 0]} />
          <meshStandardMaterial
            color={BUZ}
            transparent
            opacity={0.72}
            roughness={0.08}
            metalness={0.1}
            emissive={BUZ}
            emissiveIntensity={0.22}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------ Bağ (son) */

export function Bag() {
  const asmalar = useMemo(() => {
    const r = rastgele(55);
    const liste: { p: readonly [number, number, number]; salkim: number }[] = [];
    for (let x = 0; x < 5; x++) {
      for (let z = 0; z < 4; z++) {
        liste.push({
          p: [-4 + x * 2, 0, -3 + z * 2] as const,
          salkim: 2 + Math.floor(r() * 3),
        });
      }
    }
    return liste;
  }, []);

  return (
    <group>
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[7.4, 7.8, 1.2, 8]} />
        <TasMalzeme renk="#35332c" />
      </mesh>
      {asmalar.map((a, i) => (
        <group key={i} position={[a.p[0], a.p[1], a.p[2]]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 1.5, 6]} />
            <TasMalzeme renk="#4e4639" />
          </mesh>
          {Array.from({ length: a.salkim }, (_, j) => (
            <mesh key={j} position={[(j - 1) * 0.34, 0.55, 0.1]}>
              <icosahedronGeometry args={[0.26, 0]} />
              <meshStandardMaterial color={UZUM} roughness={0.5} metalness={0.1} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
