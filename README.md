# Elazığ — taşa kazınmış bir Elazığ

Elazığ yöresini tanıtan tek sayfalık site. Ana sayfada Harput kesme taşından
44 metrelik bir kule durur; sayfa kaydırıldıkça kamera kulenin çevresinde
**iki tam tur** döner ve her nişte bir kat aşağı iner. Işık yukarıda ikindi
güneşiyle başlar, aşağı indikçe çekilir ve yerini mangal ışığına bırakır.

## Sekiz niş

| # | Niş | Konu | Kot | Açı |
| --- | --- | --- | --- | --- |
| 1 | Harput | Taş yayla ve kale | 39,0 m | 0° |
| 2 | Hazar Gölü | Tektonik göl | 34,4 m | 90° |
| 3 | Keban Barajı | Fırat üzerinde baraj | 29,8 m | 180° |
| 4 | Buzluk Mağarası | Doğal buzluk | 25,2 m | 270° |
| 5 | Ulu Camii | Eğri minare | 20,6 m | 360° |
| 6 | Öküzgözü | Bağlar ve asma | 16,0 m | 450° |
| 7 | Fırat ve ova | Su, toprak, yol | 11,4 m | 540° |
| 8 | Çayda Çıra | Halk oyunu | 6,8 m | 630° |

## Çalıştırma

```bash
npm install
npm run dev
```

Derleme: `npm run build`, önizleme: `npm run preview`.

## Kullanılan araçlar

| Araç | İş |
| --- | --- |
| Vite + React 19 + TypeScript | Uygulama iskeleti |
| Three.js + @react-three/fiber | 3B sahne |
| Tailwind CSS v4 | Stil |
| Blender 5.2 | Kule, dioramalar, taş dokusu |

Hepsi açık kaynak ve ücretsizdir.

## Kule modeli

`public/kule.glb` (0,77 MB) Blender'da prosedürel olarak modellendi.
İki mesh içerir:

- **Kule** (2 126 poligon) — dikdörtgen prizma gövde, köşe taşları, taban
  payandaları, sekiz silme kuşağı, kitabe söveleri, kemerli pencereler,
  köşeye bitişik merdiven kulesi, konsollu çıkma balkonu, kırık mazgallı
  taç ve üzerinde durduğu kaya.
- **Dioramalar** (942 poligon) — nişlerin içindeki katmanlı sahneler.
  Çizim değil, gerçek geometri: sahnenin ışığıyla aydınlanır, gölge alır.

Taş dokusu Blender'da düğüm tabanlı üretildi (kesme taş sıraları, derz,
yıpranma, yağmur akıntısı) ve renk 1024², normal 1024², pürüzlülük 512²
haritalarına pişirildi. Haritalar GLB'ye gömülüdür.

## Işık ve atmosfer

Kaydırma ilerledikçe (`derinlik` değeri 0 → 1):

- Güneş ikindi sarısından akşam turuncusuna döner, alçalır ve söner.
- Gökyüzü ışığı kısılır.
- Mangal ışığı güçlenir ve alev gibi titrer.
- Sis koyulaşıp yaklaşır, arka plan kararır.

Güneş kamerayla birlikte döner; böylece hangi duvara bakılırsa bakılsın taş
yandan ışık alır ve derzler gölge verir.

## Parçacıklar

Kule çevresinde silindir bir hacimde 1 100 toz zerresi ve 220 kıvılcım
durur. Yavaşça yükselirler ve kameranın dönüşüyle birlikte sürüklenirler
(`grup.rotation.y = -açı × 0,34`), böylece kule döndükçe çerçevede kayarlar.
Kıvılcımlar yalnızca aşağı inildikçe görünür hale gelir.

## Yapı

```
public/kule.glb            Kule + dioramalar (dokular gömülü)
src/data/icerik.ts         Bütün metin + niş kot ve açıları
src/scene/Sahne.tsx        Kamera yolu, ışık, parçacıklar, kitabe levhaları
src/components/Arayuz.tsx  Üstbar, ray, hero, niş bölümü
src/App.tsx                Sayfa düzeni
```

Metni değiştirmek için `src/data/icerik.ts` yeterlidir; oradaki `aci` ve
`kot` alanları kameranın durağını da belirler.

## Notlar

- Kule, Elazığ yöresini anlatmak için tasarlanmış bir yapıdır; belirli bir
  tarihi binanın ölçekli kopyası değildir.
- `prefers-reduced-motion` açıksa kamera yumuşatması kapanır.
- İlk yük ~74 KB (gzip); 3B katman ayrı pakette sonra gelir.
