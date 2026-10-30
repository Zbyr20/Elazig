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

/* Palet — bölgenin malzemesinden: açık kireçtaşı surlar, okra kayalık,
   tuğla minare, Hazar'ın turkuazı, Öküzgözü'nün moru. */
const KALE = "#cbb594";
const KALE_ACIK = "#dccaab";
const KALE_KOYU = "#ab9170";
const KAYA = "#8d7351";
const KAYA_KOYU = "#6b563b";
const TUGLA = "#a4573d";
const SU = "#4fa3a0";
const BUZ = "#a8dce6";
const UZUM = "#6b2639";
const YAPRAK = "#5b7733";
const BETON = "#938f85";

type MalzemeProps = { renk?: string };

function TasMalzeme({ renk = KALE }: MalzemeProps) {
  return <meshStandardMaterial color={renk} roughness={0.9} metalness={0.02} flatShading />;
}

/* ---------------------------------------------------------------- Harput

   Kale dikdörtgen planlıdır ve iç kale / dış kale olmak üzere iki
   bölümden oluşur. Model bu plana göre kurulur: kayalık bir çıkıntının
   üstünde, burçlarla bölünmüş dikdörtgen bir dış sur ve onun içinde
   daha yüksek bir iç kale. Sur üstleri düzensizdir — yapı bir harabedir.
------------------------------------------------------------------------ */

const DIS_EN = 12.4;
const DIS_BOY = 7.6;
const IC_EN = 5.4;
const IC_BOY = 3.6;

type Parca = { kaydir: number; uzunluk: number; yukseklik: number };

/** Bir sur hattını, üst hizası düzensiz parçalara böler. */
function surParcalari(uzunluk: number, adet: number, r: () => number): Parca[] {
  const birim = uzunluk / adet;
  return Array.from({ length: adet }, (_, i) => ({
    kaydir: -uzunluk / 2 + birim * (i + 0.5),
    uzunluk: birim * 1.02,
    // Bazı parçalar neredeyse yıkılmış, bazıları ayakta.
    yukseklik: r() < 0.22 ? 0.5 + r() * 0.5 : 1.5 + r() * 1.5,
  }));
}

function SurHatti({
  parcalar,
  eksen,
  sabit,
  taban,
  kalinlik = 0.62,
}: {
  parcalar: Parca[];
  eksen: "x" | "z";
  sabit: number;
  taban: number;
  kalinlik?: number;
}) {
  return (
    <>
      {parcalar.map((p, i) => {
        const konum: [number, number, number] =
          eksen === "x"
            ? [p.kaydir, taban + p.yukseklik / 2, sabit]
            : [sabit, taban + p.yukseklik / 2, p.kaydir];
        const olcu: [number, number, number] =
          eksen === "x"
            ? [p.uzunluk, p.yukseklik, kalinlik]
            : [kalinlik, p.yukseklik, p.uzunluk];
        return (
          <mesh key={i} position={konum}>
            <boxGeometry args={olcu} />
            <TasMalzeme renk={i % 3 === 0 ? KALE_ACIK : KALE} />
          </mesh>
        );
      })}
    </>
  );
}

function Burc({
  konum,
  yukseklik,
  yaricap = 0.85,
}: {
  konum: [number, number, number];
  yukseklik: number;
  yaricap?: number;
}) {
  return (
    <group position={konum}>
      <mesh position={[0, yukseklik / 2, 0]}>
        <cylinderGeometry args={[yaricap * 0.9, yaricap, yukseklik, 12]} />
        <TasMalzeme renk={KALE} />
      </mesh>
      {/* Burç üstündeki taç silmesi */}
      <mesh position={[0, yukseklik + 0.12, 0]}>
        <cylinderGeometry args={[yaricap * 1.08, yaricap * 1.02, 0.24, 12]} />
        <TasMalzeme renk={KALE_ACIK} />
      </mesh>
    </group>
  );
}

export function Harput() {
  const { disX, disZ, icX, icZ, kayalar } = useMemo(() => {
    const r = rastgele(7);
    return {
      disX: [surParcalari(DIS_EN, 7, r), surParcalari(DIS_EN, 7, r)],
      disZ: [surParcalari(DIS_BOY, 4, r), surParcalari(DIS_BOY, 4, r)],
      icX: [surParcalari(IC_EN, 3, r), surParcalari(IC_EN, 3, r)],
      icZ: [surParcalari(IC_BOY, 2, r), surParcalari(IC_BOY, 2, r)],
      // Kaleyi taşıyan düzensiz kaya çıkıntısı
      kayalar: Array.from({ length: 9 }, () => ({
        p: [-6 + r() * 12, -1.1 - r() * 1.5, -4 + r() * 8] as const,
        o: [2 + r() * 3, 1.4 + r() * 2.2, 2 + r() * 2.6] as const,
        d: r() * 0.7,
      })),
    };
  }, []);

  return (
    <group>
      {/* Ovadan yükselen kayalık */}
      <mesh position={[0, -2.6, 0]}>
        <cylinderGeometry args={[7.6, 9.2, 3.4, 6, 1]} />
        <TasMalzeme renk={KAYA_KOYU} />
      </mesh>
      {kayalar.map((k, i) => (
        <mesh key={i} position={[k.p[0], k.p[1], k.p[2]]} rotation={[0, k.d, 0]}>
          <boxGeometry args={[k.o[0], k.o[1], k.o[2]]} />
          <TasMalzeme renk={i % 2 === 0 ? KAYA : KAYA_KOYU} />
        </mesh>
      ))}

      {/* Kalenin oturduğu düzlük */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[DIS_EN + 1.4, 0.5, DIS_BOY + 1.4]} />
        <TasMalzeme renk={KALE_KOYU} />
      </mesh>

      {/* Dış sur — dikdörtgen plan */}
      <SurHatti parcalar={disX[0]} eksen="x" sabit={-DIS_BOY / 2} taban={0} />
      <SurHatti parcalar={disX[1]} eksen="x" sabit={DIS_BOY / 2} taban={0} />
      <SurHatti parcalar={disZ[0]} eksen="z" sabit={-DIS_EN / 2} taban={0} />
      <SurHatti parcalar={disZ[1]} eksen="z" sabit={DIS_EN / 2} taban={0} />

      {/* Köşe ve ara burçları */}
      <Burc konum={[-DIS_EN / 2, 0, -DIS_BOY / 2]} yukseklik={3.2} />
      <Burc konum={[DIS_EN / 2, 0, -DIS_BOY / 2]} yukseklik={2.9} />
      <Burc konum={[-DIS_EN / 2, 0, DIS_BOY / 2]} yukseklik={3.4} />
      <Burc konum={[DIS_EN / 2, 0, DIS_BOY / 2]} yukseklik={2.6} />
      <Burc konum={[0, 0, -DIS_BOY / 2]} yukseklik={2.4} yaricap={0.7} />
      <Burc konum={[0, 0, DIS_BOY / 2]} yukseklik={2.2} yaricap={0.7} />

      {/* İç kale — daha yüksek bir sekinin üstünde */}
      <group position={[-2.4, 0, 0]}>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[IC_EN + 1, 1.7, IC_BOY + 1]} />
          <TasMalzeme renk={KALE_KOYU} />
        </mesh>
        <SurHatti parcalar={icX[0]} eksen="x" sabit={-IC_BOY / 2} taban={1.7} kalinlik={0.5} />
        <SurHatti parcalar={icX[1]} eksen="x" sabit={IC_BOY / 2} taban={1.7} kalinlik={0.5} />
        <SurHatti parcalar={icZ[0]} eksen="z" sabit={-IC_EN / 2} taban={1.7} kalinlik={0.5} />
        <SurHatti parcalar={icZ[1]} eksen="z" sabit={IC_EN / 2} taban={1.7} kalinlik={0.5} />
        <Burc konum={[-IC_EN / 2, 1.7, -IC_BOY / 2]} yukseklik={3} yaricap={0.72} />
        <Burc konum={[IC_EN / 2, 1.7, IC_BOY / 2]} yukseklik={2.7} yaricap={0.72} />
      </group>

      {/* Ulu Camii'nin tuğladan eğik minaresi */}
      <group position={[4.6, 0.1, 2.3]} rotation={[0, 0, 0.13]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.1, 1, 1.1]} />
          <TasMalzeme renk={KALE_KOYU} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <cylinderGeometry args={[0.3, 0.37, 4.4, 12]} />
          <TasMalzeme renk={TUGLA} />
        </mesh>
        <mesh position={[0, 5.45, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.3, 12]} />
          <TasMalzeme renk={KALE_ACIK} />
        </mesh>
        <mesh position={[0, 6.1, 0]}>
          <coneGeometry args={[0.4, 1, 12]} />
          <TasMalzeme renk="#7d4a36" />
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
        <TasMalzeme renk={KAYA_KOYU} />
      </mesh>

      {/* Suyun yüzeyi */}
      <mesh position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.2, 48]} />
        <meshStandardMaterial
          color={SU}
          transparent
          opacity={0.44}
          roughness={0.1}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Suyun altında kalan yerleşimin izleri */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[6.6, 7, 0.5, 9]} />
        <TasMalzeme renk="#5d4f3c" />
      </mesh>
      {sutunlar.map((s, i) => (
        <mesh key={i} position={[s.p[0], -1.95 + s.h / 2, s.p[2]]}>
          <cylinderGeometry args={[0.2, 0.24, s.h, 8]} />
          <TasMalzeme renk={KALE_KOYU} />
        </mesh>
      ))}
      <mesh position={[0, -1.6, 2.9]}>
        <boxGeometry args={[8.2, 0.7, 0.4]} />
        <TasMalzeme renk={KALE_KOYU} />
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
        <TasMalzeme renk={KAYA} />
      </mesh>
      <mesh position={[6.6, -0.4, 0]} rotation={[0, 0, 0.24]}>
        <boxGeometry args={[3.4, 6.4, 9]} />
        <TasMalzeme renk={KAYA} />
      </mesh>

      {/* Kavisli baraj gövdesi */}
      <mesh geometry={govde} position={[0, -2.3, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <TasMalzeme renk={BETON} />
      </mesh>

      {/* Gövdenin ardında biriken su */}
      <mesh position={[0, 1.5, -4.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.4, 8.4]} />
        <meshStandardMaterial
          color={SU}
          transparent
          opacity={0.55}
          roughness={0.08}
          metalness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Suyun örttüğü eski vadi tabanı */}
      <mesh position={[0, -2.5, -4.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.4, 8.4]} />
        <TasMalzeme renk={KAYA_KOYU} />
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
        <TasMalzeme renk={KAYA} />
      </mesh>
      <mesh position={[4.4, 0, 0]}>
        <boxGeometry args={[3.6, 7.2, 5.4]} />
        <TasMalzeme renk={KAYA} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[12.4, 1.6, 5.4]} />
        <TasMalzeme renk="#9c8059" />
      </mesh>
      <mesh position={[0, -2.9, 0]}>
        <boxGeometry args={[12.4, 1.6, 5.4]} />
        <TasMalzeme renk={KAYA_KOYU} />
      </mesh>

      {/* Yer altı hava akımının soğuttuğu iç boşluk */}
      <mesh position={[0, 0.1, -1.9]}>
        <boxGeometry args={[5.2, 4.4, 1.6]} />
        <TasMalzeme renk="#3a2f22" />
      </mesh>

      {/* Buz katmanları */}
      {kristaller.map((k, i) => (
        <mesh key={i} position={[k.p[0], k.p[1], k.p[2]]} rotation={[k.d[0], k.d[1], k.d[2]]}>
          <octahedronGeometry args={[k.o, 0]} />
          <meshStandardMaterial
            color={BUZ}
            transparent
            opacity={0.74}
            roughness={0.06}
            metalness={0.1}
            emissive={BUZ}
            emissiveIntensity={0.3}
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
        <TasMalzeme renk="#7a6240" />
      </mesh>
      {asmalar.map((a, i) => (
        <group key={i} position={[a.p[0], a.p[1], a.p[2]]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 1.5, 6]} />
            <TasMalzeme renk="#6b5536" />
          </mesh>
          {/* Asma yaprakları */}
          <mesh position={[0, 0.95, -0.15]} rotation={[0.5, i * 0.7, 0]}>
            <icosahedronGeometry args={[0.52, 0]} />
            <meshStandardMaterial color={YAPRAK} roughness={0.75} flatShading />
          </mesh>
          {Array.from({ length: a.salkim }, (_, j) => (
            <mesh key={j} position={[(j - 1) * 0.34, 0.5, 0.18]}>
              <icosahedronGeometry args={[0.26, 0]} />
              <meshStandardMaterial color={UZUM} roughness={0.45} metalness={0.1} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
