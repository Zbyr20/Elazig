import * as THREE from "three";

/**
 * Kule duvarındaki kitabe panelinin içeriğini çizer.
 *
 * Varsayılan olarak konuyu taşa oyulmuş gibi çizer: her çizgi önce açık
 * tonda bir piksel kaydırılıp, sonra koyu tonda üstüne geçilir — ışığın
 * oyuğun bir kenarına vurup diğerini gölgede bırakması böyle taklit edilir.
 *
 * `public/foto/<id>.jpg` varsa onun yerine o fotoğraf kullanılır; yani
 * kendi çektiğin fotoğrafları klasöre atman yeterli.
 */

const W = 1024;
const H = 792;

const TAS = "#d8c7a4";
const TAS_KOYU = "#b9a480";
const OYUK = "#5d4c33";
const ISIK = "#efe3c6";
const SU = "#4a7f86";

type Ciz = (c: CanvasRenderingContext2D) => void;

function zemin(c: CanvasRenderingContext2D) {
  c.fillStyle = TAS;
  c.fillRect(0, 0, W, H);

  // taş damarı: yumuşak lekeler
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 18 + Math.random() * 90;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    const koyu = Math.random() > 0.5;
    g.addColorStop(0, koyu ? "rgba(140,120,88,0.07)" : "rgba(246,236,214,0.07)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }
  // kenarlarda koyulaşma — oyuğun içine düşen gölge
  const kenar = c.createLinearGradient(0, 0, 0, H);
  kenar.addColorStop(0, "rgba(60,46,28,0.34)");
  kenar.addColorStop(0.18, "rgba(60,46,28,0)");
  kenar.addColorStop(0.85, "rgba(60,46,28,0)");
  kenar.addColorStop(1, "rgba(60,46,28,0.2)");
  c.fillStyle = kenar;
  c.fillRect(0, 0, W, H);
}

/** Bir yolu önce ışık, sonra oyuk renginde çizerek kabartma etkisi verir. */
function oyarak(c: CanvasRenderingContext2D, kalinlik: number, yol: Ciz, renk = OYUK) {
  c.save();
  c.lineWidth = kalinlik;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.translate(2, 2.5);
  c.strokeStyle = ISIK;
  yol(c);
  c.restore();

  c.save();
  c.lineWidth = kalinlik;
  c.lineJoin = "round";
  c.lineCap = "round";
  c.strokeStyle = renk;
  yol(c);
  c.restore();
}

function doldurOyarak(c: CanvasRenderingContext2D, yol: Ciz, renk: string) {
  c.save();
  c.translate(2, 2.5);
  c.fillStyle = ISIK;
  yol(c);
  c.fill();
  c.restore();
  c.save();
  c.fillStyle = renk;
  yol(c);
  c.fill();
  c.restore();
}

/* ------------------------------------------------------------ çizimler */

const cizimler: Record<string, Ciz> = {
  harput(c) {
    const y0 = 560;
    // kaya kütlesi
    doldurOyarak(c, (x) => {
      x.beginPath();
      x.moveTo(90, y0 + 120);
      x.lineTo(150, y0 + 20);
      x.lineTo(280, y0 - 20);
      x.lineTo(430, y0 - 36);
      x.lineTo(640, y0 - 28);
      x.lineTo(820, y0 + 6);
      x.lineTo(930, y0 + 120);
      x.closePath();
    }, TAS_KOYU);

    // dış sur
    oyarak(c, 7, (x) => {
      x.beginPath();
      x.rect(250, y0 - 190, 470, 158);
      x.stroke();
    });
    // mazgal dişleri
    for (let i = 0; i < 8; i++) {
      const bx = 254 + i * 58;
      oyarak(c, 6, (x) => {
        x.beginPath();
        x.rect(bx, y0 - 222, 34, 34);
        x.stroke();
      });
    }
    // büyük yuvarlak burç
    oyarak(c, 7, (x) => {
      x.beginPath();
      x.rect(190, y0 - 250, 86, 220);
      x.moveTo(190, y0 - 250);
      x.quadraticCurveTo(233, y0 - 272, 276, y0 - 250);
      x.stroke();
    });
    // kare payanda kuleleri
    [360, 470, 600].forEach((bx, i) => {
      oyarak(c, 6, (x) => {
        x.beginPath();
        x.rect(bx, y0 - 232 - i * 8, 56, 200 + i * 8);
        x.stroke();
      });
    });
    // eğik minare
    oyarak(c, 6, (x) => {
      x.beginPath();
      x.moveTo(790, y0 - 40);
      x.lineTo(806, y0 - 300);
      x.moveTo(812, y0 - 40);
      x.lineTo(826, y0 - 300);
      x.moveTo(800, y0 - 232);
      x.lineTo(836, y0 - 236);
      x.moveTo(806, y0 - 300);
      x.lineTo(818, y0 - 348);
      x.lineTo(830, y0 - 300);
      x.stroke();
    });
    // taş sıraları
    for (let i = 0; i < 5; i++) {
      oyarak(c, 2, (x) => {
        x.beginPath();
        x.moveTo(256, y0 - 160 + i * 30);
        x.lineTo(714, y0 - 160 + i * 30);
        x.stroke();
      });
    }
  },

  hazar(c) {
    // uzak kıyı
    oyarak(c, 5, (x) => {
      x.beginPath();
      x.moveTo(80, 400);
      x.lineTo(240, 320);
      x.lineTo(380, 384);
      x.lineTo(520, 300);
      x.lineTo(700, 372);
      x.lineTo(944, 332);
      x.stroke();
    });
    // su yüzeyi
    doldurOyarak(c, (x) => {
      x.beginPath();
      x.rect(80, 430, 864, 14);
    }, SU);
    for (let i = 0; i < 4; i++) {
      oyarak(c, 3, (x) => {
        x.beginPath();
        const y = 470 + i * 26;
        x.moveTo(90, y);
        for (let k = 0; k <= 8; k++) {
          x.quadraticCurveTo(90 + k * 107 + 54, y + (k % 2 ? 9 : -9), 90 + (k + 1) * 107, y);
        }
        x.stroke();
      }, SU);
    }
    // suyun altındaki sütunlar
    [210, 360, 510, 660, 800].forEach((bx, i) => {
      const h = 120 + (i % 3) * 36;
      oyarak(c, 6, (x) => {
        x.beginPath();
        x.rect(bx, 600 - h, 34, h);
        x.moveTo(bx - 10, 600 - h);
        x.lineTo(bx + 44, 600 - h);
        x.stroke();
      });
    });
    // göl tabanı
    oyarak(c, 7, (x) => {
      x.beginPath();
      x.moveTo(80, 602);
      x.lineTo(944, 602);
      x.stroke();
    });
  },

  keban(c) {
    // vadi duvarları
    doldurOyarak(c, (x) => {
      x.beginPath();
      x.moveTo(60, 250);
      x.lineTo(210, 300);
      x.lineTo(210, 660);
      x.lineTo(60, 660);
      x.closePath();
    }, TAS_KOYU);
    doldurOyarak(c, (x) => {
      x.beginPath();
      x.moveTo(964, 250);
      x.lineTo(814, 300);
      x.lineTo(814, 660);
      x.lineTo(964, 660);
      x.closePath();
    }, TAS_KOYU);
    // biriken su
    for (let i = 0; i < 3; i++) {
      oyarak(c, 3, (x) => {
        const y = 300 + i * 30;
        x.beginPath();
        x.moveTo(220, y);
        for (let k = 0; k <= 5; k++) {
          x.quadraticCurveTo(220 + k * 119 + 60, y + (k % 2 ? 8 : -8), 220 + (k + 1) * 119, y);
        }
        x.stroke();
      }, SU);
    }
    // kavisli baraj gövdesi
    oyarak(c, 9, (x) => {
      x.beginPath();
      x.moveTo(214, 430);
      x.quadraticCurveTo(512, 560, 810, 430);
      x.lineTo(810, 660);
      x.quadraticCurveTo(512, 690, 214, 660);
      x.closePath();
      x.stroke();
    });
    // gövdedeki dikey derzler
    for (let i = 1; i < 10; i++) {
      const t = i / 10;
      const bx = 214 + t * 596;
      const uy = 430 + Math.sin(Math.PI * t) * 108;
      oyarak(c, 2, (x) => {
        x.beginPath();
        x.moveTo(bx, uy);
        x.lineTo(bx, 660 + Math.sin(Math.PI * t) * 24);
        x.stroke();
      });
    }
  },

  buzluk(c) {
    // kaya kesiti
    doldurOyarak(c, (x) => {
      x.beginPath();
      x.rect(70, 230, 884, 110);
    }, TAS_KOYU);
    doldurOyarak(c, (x) => {
      x.beginPath();
      x.rect(70, 600, 884, 110);
    }, TAS_KOYU);
    doldurOyarak(c, (x) => {
      x.beginPath();
      x.moveTo(70, 340);
      x.lineTo(250, 400);
      x.lineTo(250, 560);
      x.lineTo(70, 600);
      x.closePath();
    }, TAS_KOYU);
    doldurOyarak(c, (x) => {
      x.beginPath();
      x.moveTo(954, 340);
      x.lineTo(774, 400);
      x.lineTo(774, 560);
      x.lineTo(954, 600);
      x.closePath();
    }, TAS_KOYU);

    // iç boşluk çizgisi
    oyarak(c, 5, (x) => {
      x.beginPath();
      x.moveTo(250, 400);
      x.lineTo(430, 372);
      x.lineTo(620, 392);
      x.lineTo(774, 400);
      x.moveTo(250, 560);
      x.lineTo(450, 586);
      x.lineTo(640, 566);
      x.lineTo(774, 560);
      x.stroke();
    });

    // buz kristalleri
    const kris: [number, number, number][] = [
      [330, 470, 44], [430, 440, 30], [520, 500, 50],
      [610, 450, 34], [690, 510, 28], [390, 530, 26], [560, 420, 22],
    ];
    kris.forEach(([bx, by, r]) => {
      doldurOyarak(c, (x) => {
        x.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const rr = i % 2 ? r * 0.52 : r;
          const px = bx + Math.cos(a) * rr;
          const py = by + Math.sin(a) * rr;
          i === 0 ? x.moveTo(px, py) : x.lineTo(px, py);
        }
        x.closePath();
      }, "#7fb6c2");
    });
    // yer altı hava akımı
    oyarak(c, 3, (x) => {
      x.beginPath();
      x.moveTo(280, 620);
      x.bezierCurveTo(420, 560, 560, 660, 740, 600);
      x.stroke();
    }, "#6c8e96");
  },
};

/* ------------------------------------------------------------ başlık */

function basliklar(c: CanvasRenderingContext2D, ad: string, tur: string) {
  c.textAlign = "center";
  c.font = '600 30px "Fraunces", Georgia, serif';
  oyarak(c, 1, (x) => {
    x.strokeText(tur.toLocaleUpperCase("tr"), W / 2, 96);
  });
  c.fillStyle = OYUK;
  c.fillText(tur.toLocaleUpperCase("tr"), W / 2, 96);

  c.font = '600 92px "Fraunces", Georgia, serif';
  c.save();
  c.translate(2.5, 3);
  c.fillStyle = ISIK;
  c.fillText(ad, W / 2, 190);
  c.restore();
  c.fillStyle = OYUK;
  c.fillText(ad, W / 2, 190);

  oyarak(c, 3, (x) => {
    x.beginPath();
    x.moveTo(W / 2 - 150, 224);
    x.lineTo(W / 2 + 150, 224);
    x.stroke();
  });
}

function fotografCiz(c: CanvasRenderingContext2D, img: HTMLImageElement) {
  const x0 = 86, y0 = 258, gw = W - 172, gh = H - 330;
  // fotoğrafı alanı kaplayacak şekilde kırp
  const o = Math.max(gw / img.width, gh / img.height);
  const w = img.width * o, h = img.height * o;
  c.save();
  c.beginPath();
  c.rect(x0, y0, gw, gh);
  c.clip();
  c.drawImage(img, x0 + (gw - w) / 2, y0 + (gh - h) / 2, w, h);
  c.restore();
  // taş çerçeve gölgesi
  oyarak(c, 6, (x) => {
    x.beginPath();
    x.rect(x0, y0, gw, gh);
    x.stroke();
  });
}

/** Panel dokusunu üretir; fotoğraf varsa yüklenince kendini tazeler. */
export function kitabeDokusu(id: string, ad: string, tur: string): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d")!;

  const ciz = (fotograf?: HTMLImageElement) => {
    zemin(c);
    if (fotograf) fotografCiz(c, fotograf);
    else cizimler[id]?.(c);
    basliklar(c, ad, tur);
  };

  ciz();
  const doku = new THREE.CanvasTexture(cv);
  doku.colorSpace = THREE.SRGBColorSpace;
  doku.anisotropy = 8;

  // public/foto/<id>.jpg varsa onu kullan
  const img = new Image();
  img.onload = () => {
    ciz(img);
    doku.needsUpdate = true;
  };
  img.onerror = () => {};
  img.src = `${import.meta.env.BASE_URL}foto/${id}.jpg`;

  return doku;
}
