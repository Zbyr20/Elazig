/**
 * Sayfa kaydırma ilerlemesini React render döngüsünün dışında tutar.
 * 3B sahne bu değeri her karede okur; böylece kaydırma sırasında
 * React yeniden render edilmez ve kare hızı düşmez.
 */
export const scrollState = {
  /** 0 = sayfa başı, 1 = sayfa sonu */
  progress: 0,
  /** Kullanıcı hareket azaltma tercihi belirtmişse true */
  reducedMotion: false,
};

function olc() {
  const h = document.documentElement;
  const kaydirilabilir = h.scrollHeight - h.clientHeight;
  scrollState.progress = kaydirilabilir > 0 ? h.scrollTop / kaydirilabilir : 0;
}

export function scrollDinleyiciBasla(): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  scrollState.reducedMotion = mq.matches;
  const mqDegisti = () => (scrollState.reducedMotion = mq.matches);

  olc();
  window.addEventListener("scroll", olc, { passive: true });
  window.addEventListener("resize", olc);
  mq.addEventListener("change", mqDegisti);

  return () => {
    window.removeEventListener("scroll", olc);
    window.removeEventListener("resize", olc);
    mq.removeEventListener("change", mqDegisti);
  };
}
