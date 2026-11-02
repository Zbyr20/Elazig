# Elazığ — taşın dört yüzü

Elazığ yöresini tanıtan tek sayfalık site. Ana sayfada Harput kesme taşından
bir kule durur; sayfa kaydırıldıkça kamera kulenin çevresinde döner ve her
duvarda bir kat aşağı iner. Dört duvarın her birinde bir kitabe paneli vardır:

| Duvar | Konu | Kot |
| --- | --- | --- |
| Ön (+Z) | Harput ve kalesi | +5.4 m |
| Sağ (+X) | Hazar Gölü | +1.0 m |
| Arka (−Z) | Keban Barajı | −3.4 m |
| Sol (−X) | Buzluk Mağarası | −7.8 m |

## Çalıştırma

```bash
npm install
npm run dev
```

Derleme ve önizleme: `npm run build` ardından `npm run preview`.

## Kullanılan araçlar

| Araç | İş |
| --- | --- |
| Vite + React 19 + TypeScript | Uygulama iskeleti |
| Three.js + @react-three/fiber | 3B sahne |
| Tailwind CSS v4 | Stil |
| Blender 5.2 | Kule modeli ve taş dokusu |

Hepsi açık kaynak ve ücretsizdir.

## Kule modeli

`public/kule.glb` (0,43 MB) Blender'da prosedürel olarak modellendi:
dikdörtgen prizma gövde, şevli taban, silme kuşakları, kitabe çerçeveleri,
mazgal pencereler, konsollu korniş ve mazgallı taç.

Taş dokusu Blender'da düğüm tabanlı olarak üretildi (kesme taş sıraları,
derzler, yıpranma lekeleri, yağmur akıntısı) ve üç haritaya pişirildi:
renk 1024², normal 1024², pürüzlülük 512². Haritalar GLB'nin içine gömülüdür;
ayrı dosya gerekmez.

Modeli değiştirmek istersen Blender betiği depoda tutulmuyor; kule tek bir
mesh olarak GLB'de durur ve doğrudan Blender'a alınabilir.

## Kitabe panellerine fotoğraf koymak

Paneller varsayılan olarak konuyu **taşa oyulmuş çizim** gibi gösterir
(`src/scene/kitabe.ts` içinde canvas ile çizilir). Kendi fotoğrafını koymak
için dosyayı şu adla ekle:

```
public/foto/harput.jpg
public/foto/hazar.jpg
public/foto/keban.jpg
public/foto/buzluk.jpg
```

Dosya varsa panel otomatik olarak fotoğrafı kullanır, yoksa çizime düşer.
Kod değişikliği gerekmez.

> Depo herkese açıksa yalnızca kendi çektiğin ya da açık lisanslı
> fotoğrafları koy.

## Yapı

```
public/kule.glb          Blender'da modellenen kule (dokular gömülü)
public/foto/             İsteğe bağlı kitabe fotoğrafları
src/data/icerik.ts       Bütün metin + panel ve kamera koordinatları
src/scene/Sahne.tsx      Canvas, kaydırmaya bağlı kamera yolu, ışık
src/scene/kitabe.ts      Panel içeriklerini canvas'ta çizer
src/components/Arayuz.tsx  Üstbar, ray, hero, duvar bölümü
src/App.tsx              Sayfa düzeni
```

Metni değiştirmek için `src/data/icerik.ts` yeterlidir. Bir duvarın kamera
durağı da aynı dosyadaki `kamera` alanından ayarlanır.

## Notlar

- Kule, Elazığ yöresini anlatmak için tasarlanmış bir yapıdır; belirli bir
  tarihi binanın ölçekli kopyası değildir.
- `prefers-reduced-motion` açıksa kamera yumuşatması kapanır.
- Three.js ayrı pakete alınır; ilk yük ~74 KB (gzip), 3B katman sonra gelir.
