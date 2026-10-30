# Elazığ

Elazığ yöresini tanıtan tek sayfalık bir site. Sayfa kaydırıldıkça kamera
Harput'un taş platosundan Hazar Gölü'nün dibine, oradan Keban'a, Buzluk
Mağarası'na ve bağlara iner; üç boyutlu modeller bu inişle birlikte açı
değiştirir.

## Çalıştırma

```bash
npm install
npm run dev
```

Derleme ve önizleme:

```bash
npm run build
npm run preview
```

## Kullanılan araçlar

| Araç | İş |
| --- | --- |
| Vite + React 19 + TypeScript | Uygulama iskeleti |
| Three.js + @react-three/fiber | 3B sahne |
| Tailwind CSS v4 | Stil |

Hepsi açık kaynak ve ücretsizdir.

## Yapı

```
src/
  App.tsx              Sayfa düzeni ve bölümler
  scroll.ts            Kaydırma ilerlemesini React dışında tutar
  components/Arayuz.tsx  Üstbar, ray, hero, mekân bölümü
  data/icerik.ts       Bütün metin içeriği
  scene/Sahne.tsx      Canvas, ışıklar, kaydırmaya bağlı kamera
  scene/Modeller.tsx   Kodla üretilen stilize low-poly modeller
```

Metni değiştirmek için yalnızca `src/data/icerik.ts` yeterlidir.

## Notlar

- Modeller dışarıdan dosya olarak yüklenmez; `Modeller.tsx` içinde
  geometriden üretilir. Bu yüzden depo hafiftir ve ek varlık gerekmez.
- `prefers-reduced-motion` açıksa kamera dönüşü belirgin şekilde azaltılır.
- Üç boyutlu görseller ölçekli temsiller değil, stilize yorumlardır.
