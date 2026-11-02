/** Kulenin dört duvarı. Sıra, kaydırma sırasında inilen sırayla aynıdır. */
export type Duvar = {
  id: string;
  ad: string;
  tur: string;
  /** Kule yüzeyindeki panelin konumu (metre, Three.js Y-yukarı düzeninde) */
  panel: { konum: [number, number, number]; donus: [number, number, number] };
  /** Kameranın o duvara bakarken durduğu açı (derece) ve yükseklik */
  kamera: { aci: number; yukseklik: number };
  giris: string;
  govde: string;
  not: string;
};

export const duvarlar: Duvar[] = [
  {
    id: "harput",
    ad: "Harput",
    tur: "Taş yayla ve kale",
    panel: { konum: [0, 5.4, 2.77], donus: [0, 0, 0] },
    kamera: { aci: 0, yukseklik: 5.4 },
    giris:
      "Elazığ'ın bugünkü merkezi ovadadır; şehrin hafızası ise yukarıda, Harput'ta durur.",
    govde:
      "Kale, ovaya hâkim bir kaya kütlesinin üstüne kurulmuştur. Planı dikdörtgendir ve iç kale ile dış kale olmak üzere iki bölümden oluşur. Surlar kayanın kendi hattını izler; nerede taşın bittiği, nerede duvarın başladığı ilk bakışta anlaşılmaz. Hemen yanında Ulu Camii'nin eğik minaresi yayla siluetinin değişmez parçasıdır.",
    not: "Rivayete göre yapım sırasında su kıt, süt boldu; harca süt katıldığı için kaleye Süt Kalesi de denir.",
  },
  {
    id: "hazar",
    ad: "Hazar Gölü",
    tur: "Tektonik göl",
    panel: { konum: [3.47, 1.0, 0], donus: [0, Math.PI / 2, 0] },
    kamera: { aci: 90, yukseklik: 1.0 },
    giris: "Yer kabuğunun kırılmasıyla açılmış bir çukurda duran, olağanüstü berrak bir su.",
    govde:
      "Hazar, yağmur sularının toplandığı sıradan bir göl değil; Doğu Anadolu Fay Hattı boyunca oluşmuş derin bir tektonik çanaktır. Suyun berraklığı bölgede bilinir. Kıyıya yakın sığlıklarda, su seviyesi çekildiğinde taş duvar kalıntıları görünür hale gelir.",
    not: "Yörede \"batık şehir\" diye anılan bu izler, gölün altında kalmış eski bir yerleşime işaret eder.",
  },
  {
    id: "keban",
    ad: "Keban Barajı",
    tur: "Fırat üzerinde baraj",
    panel: { konum: [0, -3.4, -2.77], donus: [0, Math.PI, 0] },
    kamera: { aci: 180, yukseklik: -3.4 },
    giris: "Bir vadinin su tutarak iç denize dönüşmesi.",
    govde:
      "Fırat'ın önüne kurulan Keban, Türkiye'nin en büyük barajlarından biridir ve 1970'lerden bu yana bölgenin manzarasını tanımlar. Gövdenin ardında biriken su, eski vadi tabanını, köy yollarını ve tarlaları örttü.",
    not: "Bugün kıyıdan görülen geniş su yüzeyi, bir zamanlar üstünde yürünen bir coğrafyanın üzerinde durur.",
  },
  {
    id: "buzluk",
    ad: "Buzluk Mağarası",
    tur: "Doğal buzluk",
    panel: { konum: [-3.47, -7.8, 0], donus: [0, -Math.PI / 2, 0] },
    kamera: { aci: 270, yukseklik: -7.8 },
    giris: "Yazın buz tutan, kışın ısınan bir mağara.",
    govde:
      "Harput'ta, şehir merkezine yaklaşık 11 kilometre uzaklıkta. Mağaranın jeomorfolojik yapısı yer altında bir hava akımı oluşturur; iç kısım yaz aylarında soğuyarak buz tutar, kışın ise dışarıya göre ılık kalır. Derinlere inildikçe sıcaklık eksi değerlere düşer ve duvarlarda buz katmanları görünür.",
    not: "Mağaranın tam derinliği kesin olarak bilinmiyor.",
  },
];

export const sofra = [
  { ad: "İçli köfte", aciklama: "İnce bulgur hamurunun cevizli iç harçla doldurulup elde kapatılması. Hamurun inceliği ustalığın ölçüsü sayılır." },
  { ad: "Harput köftesi", aciklama: "Adını yayladan alan, sulu olarak pişirilen küçük köftelerden kurulu bir tencere yemeği." },
  { ad: "Gömme", aciklama: "Közün altına gömülerek pişirildiği için bu adı alan, kalın ve yumuşak bir yöresel ekmek." },
  { ad: "Orcik", aciklama: "Ceviz dizisinin üzüm pekmezinden yapılan kıvamlı harca defalarca batırılmasıyla elde edilen tatlı." },
];

export const uzum = {
  ad: "Öküzgözü",
  metin:
    "Adını iri ve koyu tanelerinden alan Öküzgözü, Elazığ yöresiyle özdeşleşmiş bir üzüm çeşididir. Yüksek rakım ve sert karasal iklim taneye belirgin bir asit dengesi kazandırır; bölgenin bağcılığı bu yüzden yalnızca yerel bir uğraş değil, Türkiye şarapçılığının ana damarlarından biridir.",
};

export const cayda = {
  ad: "Çayda Çıra",
  metin:
    "Karanlıkta, ellerde taşınan mumlarla oynanan yöresel bir halk oyunu. Işığın karanlıkta çizdiği hat, oyunun kendisi kadar seyrin de konusudur.",
};

export const ziyaret = [
  { baslik: "Ne zaman gidilir", metin: "İlkbahar sonu ve sonbahar başı en dengeli dönem. Yaz ortasında ova ısınır; o günlerde yaylaya ve Buzluk Mağarası'na çıkmak serinlemenin yolu olur." },
  { baslik: "Nasıl dolaşılır", metin: "Merkez ile Harput arasındaki mesafe kısa, ama Hazar ve Keban ayrı yönlerde. İkisini aynı güne sıkıştırmak yerine birini ertesi güne bırakmak daha rahat." },
  { baslik: "Neyi kaçırma", metin: "Harput'ta gün batımını yayladan izlemek, Hazar kıyısında suyun rengi değişirken beklemek ve dönüşte sofrada içli köfteye yer bırakmak." },
];
