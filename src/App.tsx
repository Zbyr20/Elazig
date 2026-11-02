import { Suspense, lazy, useEffect, useState } from "react";
import { DuvarBolumu, Hero, Ray, Ustbar } from "./components/Arayuz";
import { duvarlar, sofra, ziyaret } from "./data/icerik";
import { scrollDinleyiciBasla } from "./scroll";

// Three.js paketin büyük bölümünü oluşturur; metin onu beklemesin.
const Sahne = lazy(() => import("./scene/Sahne"));

export default function App() {
  const [etkin, setEtkin] = useState(duvarlar[0].id);

  useEffect(() => scrollDinleyiciBasla(), []);

  useEffect(() => {
    const g = new IntersectionObserver(
      (girisler) => {
        for (const x of girisler) if (x.isIntersecting) setEtkin(x.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const d of duvarlar) {
      const el = document.getElementById(d.id);
      if (el) g.observe(el);
    }
    return () => g.disconnect();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Sahne />
      </Suspense>
      <Ustbar />
      <Ray etkin={etkin} />

      {/* Metnin okunurluğunu sağlayan tek parça perde */}
      <div
        className="metin-perdesi pointer-events-none fixed inset-0 z-[5] md:right-auto md:w-[66%]"
        aria-hidden="true"
      />

      <main className="relative z-10 mx-auto max-w-6xl">
        <Hero />

        {duvarlar.map((d, i) => (
          <DuvarBolumu key={d.id} duvar={d} sira={i} />
        ))}

        <section id="sofra" className="relative px-5 py-28 sm:px-8">
          <div className="max-w-3xl py-12">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.1rem)] leading-tight text-tas-acik">
              Sofrada ne var
            </h2>
            <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {sofra.map((l) => (
                <div key={l.ad}>
                  <h3 className="font-display text-xl text-okra">{l.ad}</h3>
                  <p className="mt-2 max-w-[46ch] leading-relaxed text-tas-acik/65">
                    {l.aciklama}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ziyaret" className="relative px-5 pb-28 sm:px-8">
          <div className="max-w-3xl py-12">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.1rem)] leading-tight text-tas-acik">
              Gitmeden önce
            </h2>
            <div className="mt-12 grid gap-9 sm:grid-cols-3">
              {ziyaret.map((z) => (
                <div key={z.baslik}>
                  <h3 className="font-display text-lg text-hazar">{z.baslik}</h3>
                  <p className="mt-2 leading-relaxed text-tas-acik/65">{z.metin}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="relative px-5 pb-16 sm:px-8">
          <div className="max-w-3xl py-10 text-sm text-tas-acik/45">
            <p className="max-w-[62ch]">
              Kule, Elazığ yöresini anlatmak için tasarlanmış bir yapıdır; belirli
              bir tarihi binanın ölçekli kopyası değildir. Nişlerdeki sahneler
              konuların taştan yorumlarıdır.
            </p>
            <p className="mt-4">Elazığ yöresini tanıtmak için hazırlandı.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
