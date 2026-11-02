/**
 * Kulenin sekiz nişi. Kaydırma bu sırayla iner: kamera her nişte 90°
 * döner, yani kule boyunca iki tam tur atılır.
 */
export type Duvar = {
  id: string;
  ad: string;
  tur: string;
  /** Kameranın bu nişe bakarken durduğu açı (derece) ve kot (metre) */
  aci: number;
  kot: number;
  giris: string;
  govde: string;
  not: string;
};

const KOT = (i: number) => 39.0 - i * 4.6;

export const duvarlar: Duvar[] = [
  {
    id: "harput",
    ad: "Harput",
    tur: "Taş yayla ve kale",
    aci: 0,
    kot: KOT(0),
    giris:
      "Elazığ'ın bugünkü merkezi ovadadır; şehrin hafızası ise yukarıda, Harput'ta durur.",
    govde:
      "Kale, ovaya hâkim bir kaya kütlesinin üstüne kurulmuştur. Planı dikdörtgendir ve iç kale ile dış kale olmak üzere iki bölümden oluşur. Surlar kayanın kendi hattını izler; nerede taşın bittiği, nerede duvarın başladığı ilk bakışta anlaşılmaz.",
    not: "Rivayete göre yapım sırasında su kıt, süt boldu; harca süt katıldığı için kaleye Süt Kalesi de denir.",
  },
  {
    id: "hazar",
    ad: "Hazar Gölü",
    tur: "Tektonik göl",
    aci: 90,
    kot: KOT(1),
    giris: "Yer kabuğunun kırılmasıyla açılmış bir çukurda duran, olağanüstü berrak bir su.",
    govde:
      "Hazar, yağmur sularının toplandığı sıradan bir göl değil; Doğu Anadolu Fay Hattı boyunca oluşmuş derin bir tektonik çanaktır. Kıyıya yakın sığlıklarda, su seviyesi çekildiğinde taş duvar kalıntıları görünür hale gelir.",
    not: "Yörede \"batık şehir\" diye anılan bu izler, gölün altında kalmış eski bir yerleşime işaret eder.",
  },
  {
    id: "keban",
    ad: "Keban Barajı",
    tur: "Fırat üzerinde baraj",
    aci: 180,
    kot: KOT(2),
    giris: "Bir vadinin su tutarak iç denize dönüşmesi.",
    govde:
      "Fırat'ın önüne kurulan Keban, Türkiye'nin en büyük barajlarından biridir ve 1970'lerden bu yana bölgenin manzarasını tanımlar. Gövdenin ardında biriken su, eski vadi tabanını, köy yollarını ve tarlaları örttü.",
    not: "Bugün kıyıdan görülen geniş su yüzeyi, bir zamanlar üstünde yürünen bir coğrafyanın üzerinde durur.",
  },
  {
    id: "buzluk",
    ad: "Buzluk Mağarası",
    tur: "Doğal buzluk",
    aci: 270,
    kot: KOT(3),
    giris: "Yazın buz tutan, kışın ısınan bir mağara.",
    govde:
      "Harput'ta, şehir merkezine yaklaşık 11 kilometre uzaklıkta. Mağaranın jeomorfolojik yapısı yer altında bir hava akımı oluşturur; iç kısım yaz aylarında soğuyarak buz tutar, kışın ise dışarıya göre ılık kalır. Derinlere inildikçe sıcaklık eksi değerlere düşer.",
    not: "Mağaranın tam derinliği kesin olarak bilinmiyor.",
  },
  {
    id: "ulucami",
    ad: "Ulu Camii",
    tur: "Harput'un eğri minaresi",
    aci: 360,
    kot: KOT(4),
    giris: "Yayla siluetinin değişmez parçası: yana eğilmiş ama ayakta duran bir minare.",
    govde:
      "Harput'un en eski yapılarından biri olan Ulu Camii, kalenin hemen yanında durur. Tuğla minaresi yıllar içinde belirgin biçimde eğilmiştir; buna rağmen bölgeyi sarsan depremleri atlatmış ve ayakta kalmıştır. Eğim, yapının kendisi kadar hikâyesinin de parçası olmuştur.",
    not: "Yöre halkı minareyi çoğu zaman adıyla değil, eğikliğiyle tarif eder.",
  },
  {
    id: "okuzgozu",
    ad: "Öküzgözü",
    tur: "Bağlar ve asma",
    aci: 450,
    kot: KOT(5),
    giris: "Adını iri ve koyu tanelerinden alan, yöreyle özdeşleşmiş üzüm.",
    govde:
      "Yüksek rakım ve sert karasal iklim, taneye belirgin bir asit dengesi kazandırır. Bu yüzden Elazığ bağcılığı yalnızca yerel bir uğraş değil, Türkiye şarapçılığının ana damarlarından biridir. Bağ bozumu yörenin kendi takvimini kurar.",
    not: "Üzümün bir bölümü şaraba değil, pekmeze ve ondan yapılan orcike gider.",
  },
  {
    id: "firat",
    ad: "Fırat ve ova",
    tur: "Su, toprak, yol",
    aci: 540,
    kot: KOT(6),
    giris: "Yaylanın altında uzanan geniş ova ve onu kesen nehir.",
    govde:
      "Elazığ'ı çevreleyen coğrafya suyla tanımlanır: kuzeyde Keban'ın tuttuğu Fırat, güneyde Hazar'ın çanağı, arada tarıma açılmış ova. Yerleşimin yukarıdan aşağıya, Harput'tan ovaya inişi de bu suyun ve toprağın hikâyesidir.",
    not: "Şehrin merkezi 19. yüzyılda yayladan ovaya indi; Harput yukarıda kaldı.",
  },
  {
    id: "caydacira",
    ad: "Çayda Çıra",
    tur: "Halk oyunu",
    aci: 630,
    kot: KOT(7),
    giris: "Karanlıkta, ellerde taşınan mumlarla oynanan yöresel bir oyun.",
    govde:
      "Oyuncular ellerindeki mumlarla karanlıkta halka olur; ışığın çizdiği hat, oyunun kendisi kadar seyrin de konusudur. Elazığ denince akla gelen ilk görüntülerden biridir ve yörenin kendini anlatma biçimini özetler.",
    not: "Kulenin dibine geldiğinde ışık artık güneşten değil, bu mumlardan gelir.",
  },
];

export const sofra = [
  { ad: "İçli köfte", aciklama: "İnce bulgur hamurunun cevizli iç harçla doldurulup elde kapatılması. Hamurun inceliği ustalığın ölçüsü sayılır." },
  { ad: "Harput köftesi", aciklama: "Adını yayladan alan, sulu olarak pişirilen küçük köftelerden kurulu bir tencere yemeği." },
  { ad: "Gömme", aciklama: "Közün altına gömülerek pişirildiği için bu adı alan, kalın ve yumuşak bir yöresel ekmek." },
  { ad: "Orcik", aciklama: "Ceviz dizisinin üzüm pekmezinden yapılan kıvamlı harca defalarca batırılmasıyla elde edilen tatlı." },
];

export const ziyaret = [
  { baslik: "Ne zaman gidilir", metin: "İlkbahar sonu ve sonbahar başı en dengeli dönem. Yaz ortasında ova ısınır; o günlerde yaylaya ve Buzluk Mağarası'na çıkmak serinlemenin yolu olur." },
  { baslik: "Nasıl dolaşılır", metin: "Merkez ile Harput arasındaki mesafe kısa, ama Hazar ve Keban ayrı yönlerde. İkisini aynı güne sıkıştırmak yerine birini ertesi güne bırakmak daha rahat." },
  { baslik: "Neyi kaçırma", metin: "Harput'ta gün batımını yayladan izlemek, Hazar kıyısında suyun rengi değişirken beklemek ve dönüşte sofrada içli köfteye yer bırakmak." },
];
