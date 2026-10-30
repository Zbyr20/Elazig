import { Suspense, lazy, useEffect, useState } from "react";
import { Hero, MekanBolumu, Ray, Ustbar } from "./components/Arayuz";
import { cayda, mekanlar, sofra, uzum, ziyaret } from "./data/icerik";
import { scrollDinleyiciBasla } from "./scroll";

// Three.js paketin büyük bölümünü oluşturur; metin içeriği onu beklemesin.
const Sahne = lazy(() => import("./scene/Sahne"));

const izlenen = ["harput", "hazar", "keban", "buzluk", "bag"];

export default function App() {
  const [etkin, setEtkin] = useState("harput");

  useEffect(() => scrollDinleyiciBasla(), []);

  useEffect(() => {
    const gozlemci = new IntersectionObserver(
      (girisler) => {
        for (const g of girisler) {
          if (g.isIntersecting) setEtkin(g.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const id of izlenen) {
      const el = document.getElementById(id);
      if (el) gozlemci.observe(el);
    }
    return () => gozlemci.disconnect();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Sahne />
      </Suspense>
      <Ustbar />
      <Ray etkin={etkin} />

      <main className="relative z-10 mx-auto max-w-6xl">
        <Hero />

        {mekanlar.map((m) => (
          <MekanBolumu key={m.id} mekan={m} />
        ))}

        {/* Bağ ve Öküzgözü */}
        <section id="bag" className="relative flex min-h-screen items-center px-5 sm:px-8">
          <div className="yazi-zemini -mx-5 max-w-xl px-5 py-10 sm:-mx-8 sm:px-8">
            <p className="text-sm text-hazar">Üzüm</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-tight text-kirec">
              {uzum.ad}
            </h2>
            <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-kirec/75">{uzum.metin}</p>
          </div>
        </section>

        {/* Sofra */}
        <section id="sofra" className="relative px-5 py-28 sm:px-8">
          <div className="yazi-zemini -mx-5 px-5 py-12 sm:-mx-8 sm:px-8">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-tight text-kirec">
              Sofrada ne var
            </h2>
            <div className="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-2">
              {sofra.map((l) => (
                <div key={l.ad}>
                  <h3 className="font-display text-xl text-bugday">{l.ad}</h3>
                  <p className="mt-2 max-w-[46ch] leading-relaxed text-kirec/65">{l.aciklama}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 max-w-xl border-t border-kirec/10 pt-10">
              <h3 className="font-display text-xl text-kirec">{cayda.ad}</h3>
              <p className="mt-2 leading-relaxed text-kirec/65">{cayda.metin}</p>
            </div>
          </div>
        </section>

        {/* Ziyaret */}
        <section id="ziyaret" className="relative px-5 pb-28 sm:px-8">
          <div className="yazi-zemini -mx-5 px-5 py-12 sm:-mx-8 sm:px-8">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-tight text-kirec">
              Gitmeden önce
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              {ziyaret.map((z) => (
                <div key={z.baslik}>
                  <h3 className="font-display text-lg text-hazar">{z.baslik}</h3>
                  <p className="mt-2 leading-relaxed text-kirec/65">{z.metin}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="relative px-5 pb-16 sm:px-8">
          <div className="yazi-zemini -mx-5 px-5 py-10 text-sm text-kirec/45 sm:-mx-8 sm:px-8">
            <p className="max-w-[60ch]">
              Sayfadaki üç boyutlu görseller, anlatılan mekânların ölçekli temsilleri değil;
              biçimlerinden yola çıkan stilize yorumlardır.
            </p>
            <p className="mt-4">Elazığ yöresini tanıtmak için hazırlandı.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
