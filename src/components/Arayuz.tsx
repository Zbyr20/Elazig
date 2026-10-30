import { useEffect, useState } from "react";
import type { Mekan } from "../data/icerik";

const baglantilar = [
  { id: "harput", ad: "Harput" },
  { id: "hazar", ad: "Hazar" },
  { id: "keban", ad: "Keban" },
  { id: "buzluk", ad: "Buzluk" },
  { id: "bag", ad: "Bağ" },
  { id: "sofra", ad: "Sofra" },
];

export function Ustbar() {
  const [kucuk, setKucuk] = useState(false);

  useEffect(() => {
    const f = () => setKucuk(window.scrollY > 120);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-500 ${
        kucuk ? "bg-bazalt-derin/85 backdrop-blur-sm" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-baseline gap-6 px-5 py-4 sm:px-8">
        <a
          href="#ust"
          className="font-display text-lg font-medium tracking-tight text-kirec"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          Elazığ
        </a>
        <ul className="ml-auto hidden gap-6 text-sm text-kirec/55 sm:flex">
          {baglantilar.map((b) => (
            <li key={b.id}>
              <a href={`#${b.id}`} className="transition-colors hover:text-kirec">
                {b.ad}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** Sayfanın solunda inişin nerede olduğunu gösteren ince ray. */
export function Ray({ etkin }: { etkin: string }) {
  return (
    <div className="pointer-events-none fixed left-5 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col gap-3">
        {baglantilar.slice(0, 5).map((b) => {
          const aktif = b.id === etkin;
          return (
            <li key={b.id} className="flex items-center gap-3">
              <span
                className={`block h-px transition-all duration-500 ${
                  aktif ? "w-7 bg-bugday" : "w-3 bg-kirec/25"
                }`}
              />
              <span
                className={`text-xs transition-opacity duration-500 ${
                  aktif ? "text-bugday opacity-100" : "opacity-0"
                }`}
              >
                {b.ad}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="ust"
      className="relative flex min-h-screen items-center px-5 pt-24 sm:px-8"
    >
      <div className="yazi-zemini -mx-5 max-w-2xl px-5 py-10 sm:-mx-8 sm:px-8">
        <h1
          className="font-display text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.95] text-kirec"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          Taşın üstünde kurulmuş,
          <br />
          suyun çevrelediği
          <br />
          bir yayla
        </h1>
        <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-kirec/70 sm:text-lg">
          Elazığ'ı anlatmanın en kısa yolu, yukarıdan aşağı inmektir. Harput'un
          kaya platosundan başlayıp Hazar'ın dibine, oradan Fırat'ın önüne
          kurulmuş gövdeye ve yazın buz tutan bir mağaraya.
        </p>
        <p className="mt-10 text-sm text-kirec/40">
          Sayfayı kaydırdıkça iniş başlar.
        </p>
      </div>
    </section>
  );
}

export function MekanBolumu({ mekan }: { mekan: Mekan }) {
  const saga = mekan.modelIndex % 2 === 1;

  return (
    <section
      id={mekan.id}
      className={`relative flex min-h-screen items-center px-5 sm:px-8 ${
        saga ? "justify-end" : ""
      }`}
    >
      <div className="yazi-zemini -mx-5 max-w-xl px-5 py-10 sm:-mx-8 sm:px-8">
        <p className="text-sm text-hazar">{mekan.tur}</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-tight text-kirec">
          {mekan.ad}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-kirec/80">{mekan.giris}</p>
        <p className="mt-4 max-w-[60ch] leading-relaxed text-kirec/60">{mekan.govde}</p>
      </div>
    </section>
  );
}
