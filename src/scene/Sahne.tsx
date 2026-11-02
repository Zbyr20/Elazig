import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { duvarlar } from "../data/icerik";
import { scrollState } from "../scroll";

/* ===================================================== kamera yolu

   Sekiz niş iki tam tur boyunca spiral iner. Kamera her durakta o nişin
   tam karşısındadır; duraklar arasında hem döner hem alçalır.
=================================================================== */

type Durak = { aci: number; yuk: number; uzak: number; bakY: number };

const DURAKLAR: Durak[] = [
  { aci: -40, yuk: 30, uzak: 88, bakY: 17 },              // giriş: bütün kule
  ...duvarlar.map((d) => ({
    aci: d.aci,
    yuk: d.kot - 0.2,
    uzak: 19.0,
    bakY: d.kot - 0.5,
  })),
  { aci: 700, yuk: 10, uzak: 66, bakY: 14 },               // kapanış: geri çekil
];

const yumusat = (t: number) => t * t * (3 - 2 * t);

function araDeger(p: number) {
  const n = DURAKLAR.length - 1;
  const x = Math.min(Math.max(p, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  const t = yumusat(x - i);
  const a = DURAKLAR[i], b = DURAKLAR[i + 1];
  return {
    aci: a.aci + (b.aci - a.aci) * t,
    yuk: a.yuk + (b.yuk - a.yuk) * t,
    uzak: a.uzak + (b.uzak - a.uzak) * t,
    bakY: a.bakY + (b.bakY - a.bakY) * t,
    derinlik: Math.min(Math.max(i === 0 ? t * 0.1 : (i - 1 + t) / 8, 0), 1),
  };
}

/* ===================================================== kule + kitabeler */

/** Niş yüzeyinin kuleden uzaklığı: tek sayılı nişler geniş yüzde. */
const yuzey = (i: number) => (i % 2 === 0 ? 3.3 : 4.0);

/** Niş üstündeki taş levhaya kazınmış ad. */
function levhaDokusu(ad: string) {
  const cv = document.createElement("canvas");
  cv.width = 1400; cv.height = 112;
  const c = cv.getContext("2d")!;
  c.fillStyle = "#c2ad87";
  c.fillRect(0, 0, 1400, 112);
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1400, y = Math.random() * 112, r = 8 + Math.random() * 34;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, Math.random() > 0.5 ? "rgba(120,100,70,0.10)" : "rgba(240,228,200,0.10)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }
  c.textAlign = "center"; c.textBaseline = "middle";
  c.font = '600 74px "Fraunces", Georgia, serif';
  c.fillStyle = "#f2e7cc"; c.fillText(ad, 702, 60);          // oyuğun ışıklı kenarı
  c.fillStyle = "#463720"; c.fillText(ad, 700, 57);          // oyuğun gölgesi
  const d = new THREE.CanvasTexture(cv);
  d.colorSpace = THREE.SRGBColorSpace;
  d.anisotropy = 8;
  return d;
}

function Kule() {
  const gltf = useLoader(GLTFLoader, `${import.meta.env.BASE_URL}kule.glb`);
  const sahne = useMemo(() => {
    const s = gltf.scene.clone(true);
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      // Niş içindeki sahneler güçlü ışıkta patlıyor; tonu kırıp matlaştır.
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mm of mats) {
        const sm = mm as THREE.MeshStandardMaterial;
        if (sm?.name?.startsWith("d_")) {
          sm.color.multiplyScalar(0.62);
          sm.roughness = Math.min(1, (sm.roughness ?? 0.8) + 0.12);
        }
      }
    });
    return s;
  }, [gltf]);

  const levhalar = useMemo(
    () => duvarlar.map((d, i) => {
      const a = (d.aci * Math.PI) / 180;
      const r = yuzey(i) + 0.27;          // söve taşının ön yüzü
      const y = d.kot - 1.9;
      return {
        id: d.id,
        konum: [Math.sin(a) * r, y, Math.cos(a) * r] as [number, number, number],
        donus: [0, a, 0] as [number, number, number],
        doku: levhaDokusu(d.ad),
      };
    }),
    [],
  );

  return (
    <group>
      <primitive object={sahne} />
      {levhalar.map((l) => (
        <mesh key={l.id} position={l.konum} rotation={l.donus} receiveShadow>
          <planeGeometry args={[4.86, 0.40]} />
          <meshStandardMaterial map={l.doku} roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ===================================================== ışık

   Tepede alçak ikindi güneşi; aşağı indikçe ışık çekilir, mangal ve
   mum ışığı devralır. Güneş kamerayla birlikte döner ki hangi duvara
   bakarsak bakalım taş yandan ışık alsın.
=================================================================== */

const GUNDUZ = new THREE.Color("#ffd9a0");
const AKSAM = new THREE.Color("#e07a32");
const GOK_UST = new THREE.Color("#b8cde0");
const GOK_ALT = new THREE.Color("#2a1d12");

function Isiklar() {
  const gunes = useRef<THREE.DirectionalLight>(null);
  const gok = useRef<THREE.HemisphereLight>(null);
  const mesale = useRef<THREE.PointLight>(null);
  const renk = useRef(new THREE.Color());

  useFrame(({ clock }) => {
    const d = araDeger(scrollState.progress);
    const k = d.derinlik;                       // 0 tepe, 1 dip
    const a = ((d.aci - 29) * Math.PI) / 180;

    if (gunes.current) {
      gunes.current.position.set(Math.sin(a) * 40, 44 - k * 30, Math.cos(a) * 40);
      gunes.current.intensity = 5.0 * (1 - k * 0.70);
      renk.current.copy(GUNDUZ).lerp(AKSAM, k);
      gunes.current.color.copy(renk.current);
      gunes.current.target.position.set(0, d.bakY, 0);
      gunes.current.target.updateMatrixWorld();
    }
    if (gok.current) {
      gok.current.intensity = 1.9 * (1 - k * 0.54);
    }
    if (mesale.current) {
      // Mangal: aşağı indikçe güçlenir, alev gibi titrer
      const t = clock.elapsedTime;
      const titrek = 0.82 + Math.sin(t * 11.3) * 0.1 + Math.sin(t * 27.7) * 0.06;
      const ac = ((d.aci - 18) * Math.PI) / 180;
      mesale.current.position.set(Math.sin(ac) * 6.4, d.bakY - 1.4, Math.cos(ac) * 6.4);
      mesale.current.intensity = (6 + k * 46) * titrek;
    }
  });

  return (
    <>
      <hemisphereLight ref={gok} args={[GOK_UST, GOK_ALT, 1.5]} />
      <directionalLight
        ref={gunes}
        intensity={4.4}
        color={GUNDUZ}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={2}
        shadow-camera-far={140}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0013}
        shadow-normalBias={0.03}
      />
      <pointLight ref={mesale} color="#ff8a2e" distance={34} decay={1.8} intensity={6} />
      <directionalLight position={[-20, -10, -16]} intensity={0.3} color="#7fa8bf" />
    </>
  );
}

/* ===================================================== parçacıklar

   Toz ve kıvılcımlar kule çevresinde bir silindir hacminde durur ve
   kameranın dönüşüyle birlikte sürüklenir: kule döndükçe onlar da
   çerçevede kayar, sahne tek parça hareket ediyormuş gibi okunur.
=================================================================== */

function benek(renk1: string, renk2: string) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const c = cv.getContext("2d")!;
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, renk1);
  g.addColorStop(0.45, renk2);
  g.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function bulut(adet: number, icR: number, disR: number, y0: number, y1: number, tohum: number) {
  const p = new Float32Array(adet * 3);
  const hiz = new Float32Array(adet);
  let s = tohum;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  for (let i = 0; i < adet; i++) {
    const a = rnd() * Math.PI * 2;
    const r = icR + rnd() * (disR - icR);
    p[i * 3] = Math.sin(a) * r;
    p[i * 3 + 1] = y0 + rnd() * (y1 - y0);
    p[i * 3 + 2] = Math.cos(a) * r;
    hiz[i] = 0.25 + rnd() * 1.1;
  }
  return { p, hiz, y0, y1 };
}

function Parcaciklar() {
  const toz = useRef<THREE.Points>(null);
  const kiv = useRef<THREE.Points>(null);
  const grup = useRef<THREE.Group>(null);

  const tozV = useMemo(() => bulut(1100, 7, 30, -8, 50, 7), []);
  const kivV = useMemo(() => bulut(220, 5, 16, -6, 30, 23), []);
  const tozD = useMemo(() => benek("rgba(255,244,222,0.95)", "rgba(226,206,168,0.42)"), []);
  const kivD = useMemo(() => benek("rgba(255,226,168,1)", "rgba(255,126,32,0.55)"), []);

  const tozGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(tozV.p, 3));
    return g;
  }, [tozV]);
  const kivGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(kivV.p, 3));
    return g;
  }, [kivV]);

  useFrame((_, delta) => {
    const d = araDeger(scrollState.progress);
    const dt = Math.min(delta, 0.05);

    // Kulenin dönüşüyle sürüklenme
    if (grup.current) grup.current.rotation.y = (-d.aci * Math.PI) / 180 * 0.34;

    const yukselt = (v: typeof tozV, geo: THREE.BufferGeometry, carpan: number) => {
      const a = geo.getAttribute("position") as THREE.BufferAttribute;
      const dizi = a.array as Float32Array;
      for (let i = 0; i < v.hiz.length; i++) {
        dizi[i * 3 + 1] += v.hiz[i] * carpan * dt;
        if (dizi[i * 3 + 1] > v.y1) dizi[i * 3 + 1] = v.y0;
      }
      a.needsUpdate = true;
    };
    yukselt(tozV, tozGeo, 1);
    yukselt(kivV, kivGeo, 3.4);

    // Kıvılcımlar yalnızca aşağı inildikçe görünür
    if (kiv.current) {
      const m = kiv.current.material as THREE.PointsMaterial;
      m.opacity = 0.12 + d.derinlik * 0.82;
    }
    if (toz.current) {
      const m = toz.current.material as THREE.PointsMaterial;
      m.opacity = 0.5 - d.derinlik * 0.24;
    }
  });

  return (
    <group ref={grup}>
      <points ref={toz} geometry={tozGeo}>
        <pointsMaterial
          map={tozD}
          size={0.26}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
      <points ref={kiv} geometry={kivGeo}>
        <pointsMaterial
          map={kivD}
          size={0.34}
          sizeAttenuation
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ===================================================== kamera */

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

    if (size.width > 900) {
      const sag = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a));
      hedef.current.addScaledVector(sag, -2.2);
      bak.current.addScaledVector(sag, -2.2);
    }

    const k = ilk.current || scrollState.reducedMotion ? 1 : 1 - Math.pow(0.0007, delta);
    ilk.current = false;
    camera.position.lerp(hedef.current, k);
    camera.lookAt(bak.current);
  });
  return null;
}

/** Sisin rengi ve yoğunluğu da inişle birlikte koyulaşır. */
function Atmosfer() {
  const { scene } = useThree();
  const sis = useMemo(() => new THREE.Fog("#1b1510", 26, 110), []);
  const ust = useMemo(() => new THREE.Color("#2a2118"), []);
  const alt = useMemo(() => new THREE.Color("#120c07"), []);
  const g = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const k = araDeger(scrollState.progress).derinlik;
    g.copy(ust).lerp(alt, k);
    sis.color.copy(g);
    sis.near = 26 - k * 10;
    sis.far = 110 - k * 48;
    scene.fog = sis;
    (scene.background as THREE.Color)?.copy(g);
  });
  return null;
}

export default function Sahne() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 1.8]}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 40, near: 0.5, far: 260, position: [0, 34, 62] }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.32;
          scene.background = new THREE.Color("#2a2118");
        }}
      >
        <Atmosfer />
        <Isiklar />
        <Kamera />
        <Parcaciklar />
        <Suspense fallback={null}>
          <Kule />
        </Suspense>
      </Canvas>
    </div>
  );
}
