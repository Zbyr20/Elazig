import { useEffect, useState } from "react";
import type { Duvar } from "../data/icerik";
import { duvarlar } from "../data/icerik";

export function Ustbar() {
  const [koyu, setKoyu] = useState(false);
  useEffect(() => {
    const f = () => setKoyu(window.scrollY > 100);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-500 ${
        koyu ? "bg-gece/85 backdrop-blur-sm" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-baseline gap-6 px-5 py-4 sm:px-8">
        <a
          href="#ust"
          className="font-display text-lg text-tas-acik"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          Elazığ
        </a>
        <ul className="ml-auto hidden gap-6 text-sm text-tas-acik/55 sm:flex">
          {duvarlar.map((d) => (
            <li key={d.id}>
              <a href={`#${d.id}`} className="transition-colors hover:text-tas-acik">
                {d.ad}
              </a>
            </li>
          ))}
          <li>
            <a href="#sofra" className="transition-colors hover:text-tas-acik">
              Sofra
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

/** Kaç duvar döndüğümüzü gösteren, solda duran ince ray. */
export function Ray({ etkin }: { etkin: string }) {
  return (
    <div className="pointer-events-none fixed left-5 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col gap-3">
        {duvarlar.map((d) => {
          const aktif = d.id === etkin;
          return (
            <li key={d.id} className="flex items-center gap-3">
              <span
                className={`block h-px transition-all duration-500 ${
                  aktif ? "w-8 bg-okra" : "w-3 bg-tas-acik/25"
                }`}
              />
              <span
                className={`text-xs transition-opacity duration-500 ${
                  aktif ? "text-okra opacity-100" : "opacity-0"
                }`}
              >
                {d.ad}
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
    <section id="ust" className="relative flex min-h-screen items-center px-5 pt-24 sm:px-8">
      <div className="max-w-2xl py-10">
        <h1
          className="font-display text-[clamp(2.5rem,6.6vw,5rem)] leading-[0.95] text-tas-acik"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          Taşın dört yüzü
        </h1>
        <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-tas-acik/70 sm:text-lg">
          Harput'un kesme taşından bir kule. Dört duvarında Elazığ'ın dört ayrı
          yüzü kayıtlı: kayanın üstündeki kale, fayın açtığı göl, Fırat'ın önüne
          kurulan gövde ve yazın buz tutan mağara.
        </p>
        <p className="mt-10 text-sm text-tas-acik/40">
          Kaydırdıkça kule döner ve her duvarda bir kat aşağı inersin.
        </p>
      </div>
    </section>
  );
}

export function DuvarBolumu({ duvar, sira }: { duvar: Duvar; sira: number }) {
  return (
    <section id={duvar.id} className="relative flex min-h-screen items-center px-5 sm:px-8">
      <div className="max-w-xl py-10">
        <p className="font-display text-sm text-okra">
          {["Birinci", "İkinci", "Üçüncü", "Dördüncü"][sira]} duvar · {duvar.tur}
        </p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.1rem)] leading-tight text-tas-acik">
          {duvar.ad}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-tas-acik/80">{duvar.giris}</p>
        <p className="mt-4 max-w-[60ch] leading-relaxed text-tas-acik/62">{duvar.govde}</p>
        <p className="mt-6 max-w-[58ch] border-l-2 border-okra/50 pl-4 text-sm leading-relaxed text-tas-acik/55">
          {duvar.not}
        </p>
      </div>
    </section>
  );
}
