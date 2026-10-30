export type Mekan = {
  id: string;
  ad: string;
  tur: string;
  /** Sahnedeki modelin indeksi — kamera inişinde bu sırayla görünürler. */
  modelIndex: number;
  giris: string;
  govde: string;
};

export const mekanlar: Mekan[] = [
  {
    id: "harput",
    ad: "Harput",
    tur: "Taş yayla ve kale",
    modelIndex: 0,
    giris:
      "Elazığ'ın bugünkü merkezi ovadadır; ama şehrin hafızası yukarıda, Harput'ta durur.",
    govde:
      "Ovaya hâkim bir kaya kütlesinin üstüne kurulan Harput, yüzyıllarca bölgenin idari ve kültürel merkeziydi. Kalenin surları kayanın kendi hattını izler — nerede taşın bittiği, nerede duvarın başladığı ilk bakışta anlaşılmaz. Hemen yanında, Artuklu döneminden kalan Ulu Camii'nin eğik minaresi yayla siluetinin değişmez parçasıdır.",
  },
  {
    id: "hazar",
    ad: "Hazar Gölü",
    tur: "Tektonik göl",
    modelIndex: 1,
    giris: "Doğu Anadolu Fay Hattı'nın açtığı çukurda duran, olağanüstü berrak bir su.",
    govde:
      "Hazar, yağmur sularının toplandığı sıradan bir göl değil; yer kabuğunun kırılmasıyla oluşmuş derin bir tektonik çanaktır. Suyun berraklığı bölgede bilinir. Kıyıya yakın sığlıklarda, su seviyesi çekildiğinde taş duvar kalıntıları görünür hale gelir — yörede \"batık şehir\" diye anılan bu izler gölün altında kalmış eski bir yerleşime işaret eder.",
  },
  {
    id: "keban",
    ad: "Keban Barajı",
    tur: "Fırat üzerinde baraj",
    modelIndex: 2,
    giris: "Bir vadinin su tutarak iç denize dönüşmesi.",
    govde:
      "Fırat'ın önüne kurulan Keban, Türkiye'nin en büyük barajlarından biridir ve 1970'lerden bu yana bölgenin manzarasını tanımlar. Gövdenin ardında biriken su, eski vadi tabanını, köy yollarını ve tarlaları örttü. Bugün kıyıdan bakıldığında görülen geniş su yüzeyi, bir zamanlar üstünde yürünen bir coğrafyanın üzerinde durur.",
  },
  {
    id: "buzluk",
    ad: "Buzluk Mağarası",
    tur: "Doğal buzluk",
    modelIndex: 3,
    giris: "Yazın buz tutan, kışın ısınan bir mağara.",
    govde:
      "Harput'ta, şehir merkezine yaklaşık 11 kilometre uzaklıkta. Mağaranın jeomorfolojik yapısı yer altında bir hava akımı oluşturur; bunun sonucunda iç kısım yaz aylarında soğuyarak buz tutar, kışın ise dışarıya göre ılık kalır. Derinlere inildikçe sıcaklık eksi değerlere düşer ve duvarlarda buz katmanları görünür. Mağaranın tam derinliği kesin olarak bilinmiyor.",
  },
];

export type Lezzet = { ad: string; aciklama: string };

export const sofra: Lezzet[] = [
  {
    ad: "İçli köfte",
    aciklama:
      "İnce bulgur hamurunun cevizli iç harçla doldurulup elde kapatılması. Hamurun inceliği ustalığın ölçüsü sayılır.",
  },
  {
    ad: "Harput köftesi",
    aciklama: "Adını yayladan alan, sulu olarak pişirilen küçük köftelerden kurulu bir tencere yemeği.",
  },
  {
    ad: "Gömme",
    aciklama: "Közün altına gömülerek pişirildiği için bu adı alan, kalın ve yumuşak bir yöresel ekmek.",
  },
  {
    ad: "Orcik",
    aciklama: "Ceviz dizisinin üzüm pekmezinden yapılan kıvamlı harca defalarca batırılmasıyla elde edilen tatlı.",
  },
];

export const uzum = {
  ad: "Öküzgözü",
  metin:
    "Adını iri ve koyu tanelerinden alan Öküzgözü, Elazığ yöresiyle özdeşleşmiş bir üzüm çeşididir. Yüksek rakım ve sert karasal iklim, taneye belirgin bir asit dengesi kazandırır; bu yüzden bölgenin bağcılığı yalnızca yerel bir uğraş değil, Türkiye şarapçılığının ana damarlarından biridir.",
};

export const cayda = {
  ad: "Çayda Çıra",
  metin:
    "Karanlıkta, ellerde taşınan mumlarla oynanan yöresel bir halk oyunu. Işığın karanlıkta çizdiği hat, oyunun kendisi kadar seyrin de konusudur.",
};

export const ziyaret = [
  {
    baslik: "Ne zaman gidilir",
    metin:
      "İlkbahar sonu ve sonbahar başı en dengeli dönem. Yaz ortasında ova ısınır; o günlerde yaylaya ve Buzluk Mağarası'na çıkmak serinlemenin yolu olur.",
  },
  {
    baslik: "Nasıl dolaşılır",
    metin:
      "Merkez ile Harput arasındaki mesafe kısa, ama Hazar ve Keban ayrı yönlerde. İki yakayı aynı güne sıkıştırmak yerine birini sabaha, diğerini ertesi güne bırakmak daha rahat.",
  },
  {
    baslik: "Neyi kaçırma",
    metin:
      "Harput'ta gün batımını yayladan izlemek, Hazar kıyısında suyun rengi değişirken beklemek ve dönüşte sofrada içli köfteye yer bırakmak.",
  },
];
