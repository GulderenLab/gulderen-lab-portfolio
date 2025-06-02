---
# Dosya Adı: src/content/blog/cad-query-klavuzu-bolum-2.md

title: 'CAD Query ile Parametrik 3D Modelleme - 🧱 Bölüm 2: CadQuery Temelleri' # Başlık iyi, açıklayıcı.
description: 'CadQuery''de Workplane mantığını, temel şekil oluşturmayı (kutu, silindir, küre) ve temel operasyonları (extrude, cut, union, fillet vb.) öğrenin.' # Açıklamayı biraz daha genişletelim.
publishDate: 2025-04-22 # Tarih uygun.
tags: ['cadquery', 'python', '3d modelleme', 'parametrik tasarım', 'cadquery temelleri', 'workplane', 'box', 'cylinder', 'sphere', 'union', 'translate', 'sketch', 'extrude', 'cut', 'intersect', 'chamfer', 'fillet', 'seçiciler', 'lambda fonksiyonları', 'akıcı api', 'boolean operasyonları'] # 'boolean operasyonları' eklendi.
image:
  src: '/images/cadquery-python-3d-modeling-kapak.png'
  alt: 'CAD Query ve Python ile parametrik 3D modelleme konseptini gösteren kapak görseli'
isDraft: false

# --- Seri Bilgileri ---
part: 2                  # Bu, serinin 2. bölümü
totalPages: 8            # Toplam bölüm sayısı (Tüm bölümlerde aynı olmalı, gerekirse güncelleyin)
seriesSlug: 'cad-query-klavuzu'
prevPageSlug: 'cad-query-klavuzu-bolum-1' # <<< DİKKAT: Önceki bölümün slug'ının DOĞRU olduğundan emin olun!
nextPageSlug: 'cad-query-klavuzu-bolum-3' # <<< DİKKAT: Sonraki bölümün slug'ının DOĞRU olduğundan emin olun (yoksa null yapın)!
# --- Seri Bilgileri Sonu ---
---

# 🧱 Bölüm 2: CadQuery Temelleri

Bu bölümde CadQuery’nin temel yapı taşlarını öğreneceğiz. Modelleme sürecinin mantığını kavrayarak, akıcı bir şekilde 3D tasarım üretmeyi hedefleyeceğiz. Hazırsan başlayalım!

---

## 🧱 CadQuery'nin Temel Taşları

CadQuery ile sağlam bir model inşa etmek istiyorsan, önce temelin sağlam olmalı. Bu temel de **Workplane mantığı** ve **koordinat sistemleri** üzerine kurulu. Bu bölümü, bir binanın zemin katını döşer gibi düşün — her şey bunun üstüne inşa edilecek.

---

### ◦ Workplane Nedir? | Çalışma Düzlemiyle Tanış

CadQuery’de tüm çizimlerin ve 3D işlemlerin başladığı yer **Workplane**’dir. Bunu, geometriyi çizeceğimiz sanal bir masa gibi düşünebilirsin. Varsayılan olarak, eğer bir düzlem belirtmezseniz, genellikle "XY" düzlemi kullanılır.

🛠️ Örnek:
```python
import cadquery as cq

# XY düzlemini seçerek başla ve üzerine bir kutu oluştur
model = cq.Workplane("XY").box(10, 10, 10)

# show_object(model) # CQ-editor gibi bir ortamda göstermek için
```

Burada `"XY"` düzlemi, masa gibi düz bir yüzeydir. Bu yüzeyin merkezine kutunun tabanını çizeriz ve kutu Z yönünde (hem pozitif hem negatif) simetrik olarak genişler.

### ◦ Koordinat Sistemi | Hangi Yön Nereye Gidiyor?
CadQuery, standart bir sağ el XYZ koordinat sistemi kullanır:

*   **X ekseni**: Sağa (+) / Sola (-)
*   **Y ekseni**: İleri (+) / Geri (-)
*   **Z ekseni**: Yukarı (+) / Aşağı (-)

```txt
         Z (+)
         ↑
         |
         |
         +---------→ X (+)
        /
       /
     Y (+)
```

Düzlemler bu eksenlere göre adlandırılır:

*   `"XY"` → Yere paralel düzlem (en sık kullanılan)
*   `"YZ"` → Sağdan/Soldan görünüm düzlemi
*   `"XZ"` → Önden/Arkadan görünüm düzlemi

### ◦ Workplane’leri Akıllıca Kullan
Modelleme yaparken sık sık farklı düzlemlere geçiş yapmanız veya mevcut bir yüzeyi yeni bir çalışma düzlemi olarak kullanmanız gerekir. Mesela bir nesnenin *üstüne* başka bir şey çizmek için:

```python
# Gerekli kütüphaneleri içe aktarma
import cadquery as cq
from cadquery import exporters # Gerekirse dışa aktarma için

# 3D Modeli oluşturma süreci
model = (
    cq.Workplane("XY")  # Başlangıç olarak XY düzlemini (Z=0) seç
    .box(20, 20, 10)    # Merkezde 20x20x10 boyutlarında bir kutu oluştur (Z: -5 ile +5 arası)
    .faces(">Z")        # Kutunun pozitif Z yönündeki yüzeyini seç (yani üst yüzeyi, Z=5 düzleminde)
    .workplane()        # Seçilen yüzeyin merkezini yeni bir çalışma düzleminin orijini yap (merkezi 0,0,5 olur)
    .circle(5)          # Bu yeni çalışma düzlemine (kutunun üstüne) 5 birim yarıçapında bir daire çiz
    .cutThruAll()       # Çizilen daire profilini kullanarak, katı modelin tamamı boyunca (her iki yönde) keserek bir delik aç
)

# Modeli dışa aktarma (Örnek: STEP formatı)
# exporters.export(model, 'deliklikutu.step')

# Modeli görselleştirme (CQ-editor veya jupyter-cadquery gerektirir)
# show_object(model)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Delikli Kutu Modeli</h1>
  <model-viewer
    src="/models/workplane-1.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Ortasından delinmiş bir kutu modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

🔍 `faces(">Z")`: Pozitif Z yönüne (yukarı) bakan yüzeyi seçer.
🧩 `.workplane()`: Seçilen yüzeyi yeni bir çalışma düzlemi olarak ayarlar. Orijin, yüzeyin merkezine taşınır.
🛠️ `.circle(5).cutThruAll()`: Yeni düzleme 5 yarıçaplı bir daire çizer ve bu profili kullanarak tüm katıyı deler.

⛏ Bu örneğimizde önce bir kutu oluşturduk, sonra bu kutunun en üst yüzeyini yeni bir çalışma düzlemi (`workplane`) olarak tanımladık. Ardından bu tanımladığımız yüzeye `circle(5)` komutu ile 5 birim yarıçapında bir daire çizip, `cutThruAll()` komutu ile bir delik açtık.

🧠 Şimdi bir başka örnek yapalım. Bu örneğimizde yine bir kutumuz olsun. Bu kutunun üstünü yeni bir çalışma düzlemi olarak tanımlayarak üzerine bir daire yerleştirelim ve bu daireyi yukarı doğru uzatarak (`extrude`) silindirik bir şekil oluşturalım.

```python
# Gerekli kütüphaneleri içe aktarma
import cadquery as cq
from cadquery import exporters # Gerekirse dışa aktarma için

# 3D Modeli oluşturma süreci
# Ana gövde: bir kutu (taban parça) oluşturma
base = (
    cq.Workplane("XY")  # XY düzlemini seç
    .box(40, 40, 10)    # 40x40x10 boyutlarında bir kutu çiz (Z: -5 ile +5 arası)
)

# Tabanın üstüne silindir ekleme
model = (
    base                 # 'base' kutusu ile başla
    .faces(">Z")         # Kutunun üst yüzeyini seç (Z=5)
    .workplane()         # Seçilen yüzeyi yeni çalışma düzlemi yap (orijin 0,0,5)
    .circle(10)          # Yeni düzleme 10 yarıçaplı daire çiz
    .extrude(20)         # Daireyi çalışma düzleminin normali yönünde (pozitif Z) 20 birim uzatarak silindir oluştur ve 'base' ile birleştir (implicit union)
)

# Modeli dışa aktarma (Örnek: STEP formatı)
# exporters.export(model, 'kutu_ustu_silindir.step')

# Modeli görselleştirme
# show_object(model)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Kutu Üzerine Silindir Modeli</h1>
  <model-viewer
    src="/models/workplane-2.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Bir kutunun üzerine yerleştirilmiş silindir modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

✨ Yeni bir örnek yaparak çalışma düzlemi mantığını iyice pekiştirelim. Üstte görünen kutu üzerindeki silindirin en üst noktasını yeni bir çalışma düzlemi olarak belirtip bunun üzerine 5 birim yarıçapında bir daire tanımlayarak delik açalım. Kod şu şekilde olacak:

```python
# Gerekli kütüphaneleri içe aktarma
import cadquery as cq
from cadquery import exporters # Gerekirse dışa aktarma için

# 3D Modeli oluşturma süreci
# Ana gövde: bir kutu (taban parça) oluşturma
base = (
    cq.Workplane("XY")  # XY düzlemini seç
    .box(40, 40, 10)    # 40x40x10 boyutlarında bir kutu çiz (Z: -5 ile +5 arası)
)

# Kutuya silindir ekle ve sonra silindiri del
model = (
    base                 # 'base' kutusu ile başla
    .faces(">Z")         # Kutunun üst yüzeyini seç (Z=5)
    .workplane()         # Seçilen yüzeyi yeni çalışma düzlemi yap (orijin 0,0,5)
    .circle(10)          # Yeni düzleme 10 yarıçaplı daire çiz
    .extrude(20)         # Daireyi +Z yönünde 20 birim uzat (Silindir Z=5'ten Z=25'e uzanır)
    # Şimdi oluşan birleşik şekil (kutu + silindir) üzerinde devam ediyoruz:
    .faces(">Z")         # Mevcut şeklin en üst yüzeyini seç (Silindirin üstü, Z=25 düzlemi)
    .workplane()         # Seçilen bu silindir üst yüzeyini yeni bir çalışma düzlemi yap (orijin 0,0,25)
    .circle(5)           # Bu yeni çalışma düzlemine 5 yarıçaplı daire çiz
    .cutThruAll()        # Çizilen daireyi kullanarak, modelin tamamı boyunca (hem silindir hem de kutu) kesme işlemi uygula (delik aç)
)

# Modeli dışa aktarma (Örnek: STEP formatı)
# exporters.export(model, 'deliklikutu_ustu_silindir.step')

# Modeli görselleştirme
# show_object(model)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Delikli Silindirli Kutu Modeli</h1>
  <model-viewer
    src="/models/workplane-3.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Üzerinde delikli bir silindir bulunan kutu modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

✅ Bu örneklerle çalışma düzlemini bir yüzeyden başlatma konseptini iyice pekiştirdik.

### ◦ Neden Bu Kadar Önemli?
*   **Konumlandırma:** Geometriyi tam olarak nereye çizeceğinizi belirlemenizi sağlar. Karmaşık modellerde kaybolmazsınız.
*   **Yapı:** Workplane'ler sayesinde katmanlı ve düzenli tasarımlar oluşturursunuz.
*   **Tekrarlama ve Simetri:** Aynı parçanın farklı yerlerdeki veya simetrik kısımlarını kolayca üretirsiniz.
*   **Hata Ayıklama:** Adım adım ilerlediğiniz için karmaşık projelerde hataları bulmak çok daha kolay olur.

📌 Özetle: CadQuery'de her şey bir düzlemle başlar. Bu düzlemi doğru seçmek ve gerektiğinde değiştirmek, projenizin temelini sağlam atmak demektir. Artık bu temeli öğrendiğimize göre, bir üst kata çıkmaya hazırız. 🚀

---

## ◦ Akıcı API Kullanımı: Zincirleme Metodlar

CadQuery’nin en sevilen özelliklerinden biri, **akıcı (fluent) veya zincirleme (chained)** yazım tarzıdır. Bu tarz, hem kodun okunabilirliğini artırır hem de modelin nasıl adım adım oluştuğunu görmemizi sağlar.

🧠 **Akıcı API ne demek?**
Her metod (`.box()`, `.faces()`, `.workplane()`, `.circle()`, `.cutThruAll()` vb.) bir işlem yapar ve genellikle üzerinde çalışılabilecek bir sonuç (genellikle bir `Workplane` veya `Shape` nesnesi) döndürür. Bu sayede metodları `.` ile birbirine bağlayarak işlemleri mantıksal bir sırada yürütebiliriz.

---

### 🛠️ Örnek 1: Basitten Karmaşığa

```python
import cadquery as cq

model = (
    cq.Workplane("XY")      # 1. XY düzlemini seç
    .box(20, 20, 5)          # 2. 20x20x5 boyutunda bir kutu oluştur
    .faces(">Z")             # 3. Kutunun üst yüzeyini seç
    .workplane()             # 4. Seçilen yüzeyden yeni bir çalışma düzlemi başlat
    .circle(5)               # 5. Bu yeni düzleme 5 yarıçaplı bir daire çiz
    .cutThruAll()            # 6. Daireyi kullanarak tüm katıyı del
)

# show_object(model)
```

🧩 Bu kod, bir kutunun tam ortasına yukarıdan aşağıya bir delik açar. Her satır bir işlemi tanımlar ve bir öncekinin çıktısı üzerine eklenir. Çalışma düzlemini anlamak için yaptığımız önceki örnekler de bu akıcı stili kullanıyordu.

---

### 🧠 Neden Zincirleme Kullanım Önemlidir?
*   **Kod Mantığını Korur**: Her adım bir öncekinin üzerine inşa edilir, modelin oluşum süreci nettir.
*   **Okunabilirliği Artırır**: Nereden başlanıp nereye gidildiği kolayca takip edilir.
*   **Hataları Azaltır**: İşlemleri mantıksal adımlara ayırmak, test etmeyi ve hata ayıklamayı kolaylaştırır.
*   **Parametrik Düşünmeyi Kolaylaştırır**: Değerleri (parametreleri) değiştirdiğinizde, zincirdeki hangi adımların nasıl etkileneceğini daha net görürsünüz.

---

### 🎯 İpucu: Her Metod Bir Nesne Döndürür
CadQuery’nin çoğu metodu, üzerinde işlem yapılmış bir `Workplane` veya `Shape` nesnesi döndürür. Bu yüzden bir sonraki metod hemen bu döndürülen nesne üzerinde çalışabilir. Bu tasarım desenine yazılımda "**fluent interface**" (akıcı arayüz) denir.

🚀 Hadi bir örnek daha yapalım. Zincirleme mantığını kullanarak kenarları yuvarlatılmış bir blok oluşturalım.

```python
# Gerekli kütüphaneler
import cadquery as cq
from cadquery import exporters

# Model oluşturma zinciri
model = (
    cq.Workplane("XY")    # XY düzleminde çalışmaya başla
    .rect(30, 10)         # 30x10 boyutunda bir dikdörtgen çiz (2D eskiz)
    .extrude(10)          # Dikdörtgeni Z yönünde 10 birim uzatarak katı blok oluştur
    .edges("|Z")          # Z eksenine paralel olan dikey kenarları seç
    .fillet(2)            # Seçilen kenarları 2 birim yarıçapla yuvarlat (radius at)
)

# Dışa Aktarma
# exporters.export(model, 'yuvarlak_kenarli_blok.step')

# Görselleştirme (CQ-editor gibi bir ortamda)
# show_object(model)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Yuvarlatılmış Kenarlı Blok</h1>
  <model-viewer
    src="/models/workplane-4.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Dikey kenarları yuvarlatılmış dikdörtgen prizma"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

---

## ◦ Stack Mantığı: İşlem Sıraları ve Bağlam

CadQuery'de zincirleme metodlar çalışırken, arka planda bir **yığın (stack)** mantığı işler. Her `Workplane` nesnesi, üzerinde işlem yapılacak geometrileri (noktalar, kenarlar, yüzeyler, katılar) içeren bir yığına sahiptir. Yaptığınız işlemler (örn. `box`, `circle`, `faces`, `edges`) bu yığını değiştirir ve bir sonraki komut bu güncel yığın üzerinde çalışır.

🧠 **Stack (Yığın) nedir?**
Stack, genellikle "Son Giren İlk Çıkar" (LIFO - Last In First Out) prensibiyle çalışan bir veri yapısıdır. Ancak CadQuery'deki kullanımı biraz daha bağlamsaldır: Yığın, o anki *aktif geometrileri* veya *işlem yapılacak öğeleri* tutar. Bir yüzey seçtiğinizde (`faces(">Z")`), yığına o yüzey eklenir. Ardından `.workplane()` dediğinizde, o yüzey temel alınarak yeni bir düzlem oluşturulur ve yığın bu yeni düzlemle güncellenir. `.circle(5)` dediğinizde, o daire teli (wire) yığına eklenir. `.extrude(10)` dediğinizde, yığındaki tüm teller (bu durumda tek bir daire) kullanılarak katı oluşturulur ve yığın bu katı nesne(ler) ile güncellenir.

---

### 🛠️ Örnek: İşlem Sırasının Yığına Etkisi

```python
import cadquery as cq

model = (
    cq.Workplane("XY")     # Yığın: XY düzlemi
    .box(30, 30, 10)       # Yığın: Oluşturulan kutu katısı (solid)
    .faces(">Z")           # Yığın: Kutunun üst yüzeyi
    .workplane()           # Yığın: Üst yüzeyin merkezinde yeni bir çalışma düzlemi
    .circle(5)             # Yığın: Yeni düzlemdeki 5 yarıçaplı daire teli (wire)
    .extrude(8)            # Yığın: Dairenin 8 birim uzatılmasıyla oluşan silindir katısı (ve alttaki kutu ile birleşmiş hali)
    .faces(">Z")           # Yığın: En son oluşturulan silindirin üst yüzeyi
    .workplane()           # Yığın: Silindirin üst yüzeyinde yeni bir çalışma düzlemi
    .circle(2)             # Yığın: Yeni düzlemdeki 2 yarıçaplı daire teli
    .cutThruAll()          # Yığın: Daire kullanılarak tüm modelin delinmesiyle oluşan son katı
)
# show_object(model)
```

📚 Yığının durumu her adımda nasıl değişiyor:
1.  Başlangıçta XY düzlemi.
2.  Kutu oluşturulunca yığında kutu katısı olur.
3.  Üst yüzey seçilince yığında sadece o yüzey kalır.
4.  Yeni workplane oluşturulunca yığın o düzleme işaret eder.
5.  Daire çizilince yığına daire teli eklenir.
6.  Extrude yapılınca yığında birleşik katı (kutu+silindir) olur.
7.  Tekrar üst yüzey seçilince yığında o yüzey olur.
8.  Yeni workplane...
9.  Yeni daire teli...
10. Delme işlemi sonrası yığında son katı model kalır.

Her adım, bir sonraki adımın ne üzerinde çalışacağını belirler. Yığın, bu **bağlamı** taşır.

---

### 🧩 Stack Mantığı Neyi Sağlar?

*   **Kontrollü Adımlar:** Model üzerinde adım adım ilerlemenizi sağlar.
*   **Bağlam Koruması:** Hangi yüzeyde veya hangi katı üzerinde çalıştığınızı kaybetmezsiniz.
*   **Karmaşıklık Yönetimi:** Karmaşık modellerde bile nerede olduğunuzu bilerek işlem yapmanızı kolaylaştırır.
*   **Akıcı API Desteği:** Zincirleme metodların sorunsuz çalışmasını sağlayan temel mekanizmadır.

---

### 🎯 Stack'i Doğru Kullanmak Önemlidir

Eğer işlem sırasını karıştırırsanız veya yığında olmayan bir şeyi seçmeye çalışırsanız, model istediğiniz gibi oluşmaz veya hata alırsınız. Stack mantığı, CadQuery'nin adımları sırayla takip etmesini sağladığı için, **önce ne oluşturacağınız, sonra ne seçeceğiniz** çok önemlidir.

---

🔍 Örnek: Hatalı Sıralama

```python
# Hatalı Kod
# import cadquery as cq
# model = (
#     cq.Workplane("XY")
#     .faces(">Z")       # HATA! Henüz bir katı yok ki üst yüzeyini seçelim. Yığında sadece XY düzlemi var.
#     .box(20, 20, 5)
# )
```

⛔ Bu kod hata verir çünkü `box()` ile bir katı oluşturmadan önce `faces(">Z")` ile olmayan bir yüzeyi seçmeye çalışıyoruz. Yığında o anda seçilebilecek bir yüzey bulunmuyor!

---

🧠 Özetle: CadQuery bir şekil oluştururken veya seçerken her adımı bir yığına (veya yığındaki öğelere) uygular. Bu yığını ve işlem sırasını doğru yönetirseniz, karmaşık 3D modelleri bile adım adım, kontrollü bir şekilde inşa edebilirsiniz. Karmaşık geometrilerin sırrı aslında bu sıralamada ve bağlam yönetiminde gizlidir.

---

## 🧱 Temel Geometriler ve Örneklerle Modelleme

Artık düzlemleri, zincirleme metodları ve yığın mantığını biliyoruz. Şimdi sıra geldi CadQuery’deki **temel (primitive) geometrileri** kullanarak ilk 3D modellerimizi oluşturmaya!

CadQuery, bazı hazır 3D şekilleri (`box`, `cylinder`, `sphere` vb.) doğrudan oluşturmanızı sağlar. Bunlar basit gibi görünse de birçok modelin temel yapı taşlarıdır.

---

### ◦ 📦 Box (Kutu)

En temel 3D şekil. Genişlik (X), derinlik (Y) ve yükseklik (Z) değerleriyle tanımlanır. Kutu, çalışma düzleminin merkezine göre simetrik olarak oluşturulur.

```python
# Gerekli kütüphaneler
import cadquery as cq
from cadquery import exporters # Dışa aktarma fonksiyonları için

# Basit bir kutu oluştur
kutu_modeli = cq.Workplane("XY").box(25, 30, 15) # XY düzleminde 25(X) x 30(Y) x 15(Z) boyutlarında kutu

# Dışa Aktarma
# exporters.export(kutu_modeli, 'basit_kutu.step')

# Görselleştirme (CQ-editor gibi bir ortamda)
# show_object(kutu_modeli)
```

Bu kod, X ekseninde 25 birim, Y ekseninde 30 birim ve Z ekseninde 15 birim boyutlarında bir kutu oluşturur. Kutu, orijin (0,0,0) merkezli olacak şekilde yerleştirilir (X: -12.5 ile +12.5, Y: -15 ile +15, Z: -7.5 ile +7.5 arası).

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Basit Kutu Modeli</h1>
  <model-viewer
    src="/models/workplane-5.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Basit bir dikdörtgen prizma (kutu) modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

---

### ◦ 🥫 Cylinder (Silindir)

Yükseklik ve yarıçap değerleriyle tanımlanır. Çalışma düzleminin normali (genellikle Z ekseni) boyunca uzanır ve merkezi orijindedir.

```python
# Gerekli kütüphaneler
import cadquery as cq
from cadquery import exporters # Dışa aktarma fonksiyonları için

# Bir silindir oluştur (AAA pil boyutlarına yakın)
silindir_modeli = cq.Workplane("XY").cylinder(height=44.5, radius=5.25) # XY düzleminde, Z ekseni boyunca 44.5 birim yükseklik ve 5.25 birim yarıçaplı silindir

# Dışa Aktarma
# exporters.export(silindir_modeli, 'basit_silindir.step')

# Görselleştirme (CQ-editor gibi bir ortamda)
# show_object(silindir_modeli)
```

*   `height=44.5`: Silindirin Z ekseni boyunca toplam yüksekliği.
*   `radius=5.25`: Silindirin yarıçapı.
Silindir, Z ekseninde -22.25 ile +22.25 arasında uzanır.

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Basit Silindir Modeli</h1>
  <model-viewer
    src="/models/workplane-6.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Basit bir silindir modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### ◦ 🌐 Sphere (Küre)

Sadece yarıçap değeriyle tanımlanır. Merkezi orijindedir.

```python
# Gerekli kütüphaneler
import cadquery as cq
from cadquery import exporters # Dışa aktarma fonksiyonları için

# Bir küre oluştur
kure_modeli = cq.Workplane("XY").sphere(15) # Merkezi orijin olan 15 birim yarıçaplı küre

# Dışa Aktarma
# exporters.export(kure_modeli, 'basit_kure.step')

# Görselleştirme (CQ-editor gibi bir ortamda)
# show_object(kure_modeli)
```

Bu kod, yarıçapı 15 birim olan bir küre oluşturur. Koordinat sisteminin merkezinde yer alır.

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Basit Küre Modeli</h1>
  <model-viewer
    src="/models/workplane-7.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Basit bir küre modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### 🔁 Temel Şekilleri Birleştirmek: `union` ve `translate`

Şimdi bu temel şekilleri bir araya getirerek daha karmaşık modeller oluşturalım. Bunun için `union` (birleştirme) ve `translate` (taşıma) komutlarını kullanacağız.

#### `union` Komutu (Birleştirme): ✨

`union` komutu, CadQuery'de (ve genel olarak 3D modellemede) **iki veya daha fazla katı (solid) nesneyi alıp, onları tek bir katı nesne halinde birleştirmek** için kullanılan temel bir **Boolean** işlemidir.

##### Ne Yapar? 🤔
*   İki ayrı geometriniz olduğunu düşünün (mesela bir küp ve bir silindir).
*   Bu geometriler birbirine değiyor veya iç içe geçiyor olabilir.
*   `union` komutunu kullandığınızda, CadQuery bu iki ayrı parçayı alır ve aralarındaki iç sınırları kaldırarak tek, yekpare bir bütün oluşturur.
*   İki ayrı oyun hamurunu birbirine bastırıp tek bir şekil elde etmek gibi düşünebilirsiniz. İç içe geçen kısımlar tamamen kaynaşır.

##### Neden Kullanılır? 🛠️
*   **Karmaşık Şekiller Oluşturma:** Basit geometrileri (kutu, silindir, küre vb.) birleştirerek daha karmaşık formlar yaratmanızı sağlar.
*   **Tek Parça Model:** Özellikle 3D yazdırma veya mühendislik analizleri (FEA) için modelinizin ayrı parçalardan değil, tek bir **manifold (su geçirmez) katıdan** oluşması genellikle istenir veya gereklidir. `union` bunu sağlar.

✨ Önce tüm şekilleri orijinde birleştirelim:

```python
# CadQuery'yi içe aktar
import cadquery as cq
from cadquery import exporters

# Temel şekilleri oluştur
kutu = cq.Workplane("XY").box(25, 30, 15)
silindir = cq.Workplane("XY").cylinder(44.5, 5.25)
kure = cq.Workplane("XY").sphere(15)

# Şekilleri birleştir (Hepsi orijin merkezli olduğu için iç içe geçecekler)
birlesik_model = kutu.union(silindir).union(kure)

# Dışa aktarma
# exporters.export(birlesik_model, 'icice_birlesik.step')

# Görselleştirme
# show_object(birlesik_model)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Orijinde Birleştirilmiş Şekiller</h1>
  <model-viewer
    src="/models/workplane-8.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Orijin merkezli kutu, silindir ve kürenin birleştirilmiş hali"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte, üç şekil de orijin (0,0,0) merkezli oluşturulduğu için `union` ile birleştirildiğinde iç içe geçmiş, tek bir katı nesne oluşur.

Peki şekilleri üst üste koymak isteseydik? İşte burada `translate` komutu devreye giriyor.

#### `translate` Komutu (Taşıma/Öteleme): ➡️↔️↕️

CadQuery'de `translate` komutu, mevcut geometriyi (veya yığındaki tüm geometrileri) uzayda belirli bir vektör kadar kaydırmak/taşımak için kullanılır.

##### Ne Yapar? 🤔
*   Oluşturduğunuz bir şekli X, Y ve Z eksenleri boyunca belirttiğiniz mesafeler kadar hareket ettirir.
*   Sanki elinizdeki bir nesneyi alıp başka bir yere koymak gibidir. Yönünü veya boyutunu değiştirmez, sadece **konumunu** değiştirir.

##### Neden Kullanılır? 🛠️
*   **Nesneleri Konumlandırma:** Şekilleri istediğiniz koordinatlara veya başka bir şekle göre hizalamak için temel yöntemdir.
*   **Montaj Oluşturma:** Farklı parçaları doğru yerlerine yerleştirmek için kritik öneme sahiptir.
*   **Tekrarlayan Desenler:** Bir nesneyi farklı konumlara taşımak için kullanılabilir (genellikle kopyalama komutlarıyla birlikte).

##### CadQuery'de Nasıl Kullanılır?

Genellikle bir şekil oluşturduktan sonra zincirleme (chaining) yöntemiyle kullanılır. Taşıma mesafesi `(X, Y, Z)` şeklinde bir tuple veya `Vector` nesnesi olarak verilir.

```python
# Önce bir kutu oluştur, sonra taşı
result = cq.Workplane("XY").box(10, 10, 10).translate((0, 0, 20)) # Z'de 20 birim yukarı taşı

# Veya ayrı adımlarda:
kutu = cq.Workplane("XY").box(10, 10, 10)
tasinmis_kutu = kutu.translate((0, 0, 20))
```

##### Şimdi Totem Zamanı! 🗿

Yukarıdaki şekilleri `translate` ve `union` kullanarak üst üste dizelim ve **parametrik** hale getirelim.

```python
import cadquery as cq
from cadquery import exporters

# --- Boyutları Parametre Olarak Tanımlayalım ---
kutu_x = 25
kutu_y = 30
kutu_z = 15

silindir_yukseklik = 44.5
silindir_yaricap = 5.25

kure_yaricap = 15

# --- Parçaları Oluştur ve Konumlandır ---

# 1. Taban Kutusu (Orijin merkezli)
# Kutunun üst yüzeyi Z = kutu_z / 2 konumundadır.
taban_kutusu = cq.Workplane("XY").box(kutu_x, kutu_y, kutu_z)

# 2. Silindir (Önce orijinde oluştur, sonra taşı)
# Silindirin merkezinin Z konumu = kutu_ust_z + silindir_yarim_yukseklik
silindir_merkez_z = (kutu_z / 2) + (silindir_yukseklik / 2)
orta_silindir = (
    cq.Workplane("XY")
    .cylinder(silindir_yukseklik, silindir_yaricap) # Orijin merkezli oluştur
    .translate((0, 0, silindir_merkez_z))          # Hesaplanan Z konumuna taşı
)

# 3. Küre (Önce orijinde oluştur, sonra taşı)
# Silindirin üst yüzeyi Z = silindir_merkez_z + silindir_yarim_yukseklik
silindir_ust_z = silindir_merkez_z + (silindir_yukseklik / 2)
# Kürenin merkezinin Z konumu = silindir_ust_z + kure_yaricap
kure_merkez_z = silindir_ust_z + kure_yaricap
ust_kure = (
    cq.Workplane("XY")
    .sphere(kure_yaricap)                     # Orijin merkezli oluştur
    .translate((0, 0, kure_merkez_z))         # Hesaplanan Z konumuna taşı
)

# --- 4. Parçaları Birleştir (Union) ---
# Ayrı ayrı oluşturup taşıdığımız parçaları tek bir katı nesne yapmak için birleştiriyoruz.
totem_modeli = taban_kutusu.union(orta_silindir).union(ust_kure)

# --- Göster ve Dışa Aktar ---
# exporters.export(totem_modeli, 'totem.step')
# show_object(totem_modeli)
```

**Bu kodda ne oluyor?**

1.  **Boyutlar:** Modelin boyutları değişkenlerle tanımlanır (parametrik tasarım).
2.  **Kutu:** Orijin merkezli oluşturulur.
3.  **Silindir:** Orijin merkezli oluşturulur, sonra `translate` ile Z ekseninde yukarı taşınarak merkezi, kutunun üst yüzeyi ile kendi yarı yüksekliğinin toplamı kadar yukarıda olacak şekilde konumlandırılır. Böylece tabanı kutunun üstüne denk gelir.
4.  **Küre:** Benzer şekilde, önce merkezi orijinde oluşturulur, sonra `translate` ile Z ekseninde yukarı taşınarak merkezi, silindirin üst yüzeyi ile kendi yarıçapının toplamı kadar yukarıda olacak şekilde konumlandırılır. Böylece alt noktası silindirin üstüne denk gelir.
5.  **Union:** Son olarak, doğru konumlandırılmış bu üç ayrı parça `union` ile tek bir katı "totem" nesnesi haline getirilir.

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Üst Üste Dizilmiş Totem Modeli</h1>
  <model-viewer
    src="/models/workplane-9.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Üst üste yerleştirilmiş kutu, silindir ve küreden oluşan totem modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### 🧠 Neden Bu Temeller Önemli?

*   Bu temel geometriler (`box`, `cylinder`, `sphere`), karmaşık modellerin yapı taşlarıdır.
*   `union`, `cut`, `intersect` gibi Boolean işlemlerle bu temel şekilleri birleştirerek veya çıkararak neredeyse her türlü formu oluşturabilirsiniz.
*   `translate` (ve yakında göreceğimiz `rotate`) ile parçaları doğru konumlara yerleştirmek, montajların ve karmaşık yapıların temelidir.
*   Parametrik yaklaşım (değişken kullanmak), tasarımlarınızı esnek ve kolayca değiştirilebilir hale getirir.

---

### 🧪 Şimdi Kendin Deneyebilirsin:

*   Farklı boyutlarda kutular, silindirler, küreler oluştur.
*   `translate` kullanarak şekilleri farklı konumlara taşıyıp `union` ile birleştirmeyi dene.
*   Totem örneğindeki değişkenlerin değerlerini değiştirip modelin nasıl güncellendiğini gözlemle.

---

### 📌 Bu bölümde öğrendiklerimiz:

*   `box()`, `cylinder()`, `sphere()` ile temel 3D şekiller oluşturma.
*   `union()` ile katı nesneleri birleştirme.
*   `translate()` ile nesneleri uzayda taşıma.
*   Parametrik değişkenler kullanarak boyutları tanımlama.

Sırada ne var? 2D çizimler (eskizler) yaparak kendi özel profillerimizi oluşturmak ve bunları `extrude` gibi komutlarla 3D'ye dönüştürmek.

Bir sonraki adımda **Sketch (Eskiz)** ve **Extrude (Uzatma)** işlemleriyle 2D'den 3D'ye geçiş yapacağız. 🚀

----

## 📐 2D’den 3D’ye: Sketch ve Extrude İşlemleri

Birçok 3D model, aslında düz bir 2D çizimin (eskiz veya **sketch**) belirli bir yönde **uzatılması (extrude)**, döndürülmesi (`revolve`) veya bir yol boyunca süpürülmesi (`sweep`) ile oluşturulur.

CadQuery'de, bu 3D oluşturma komutlarının çoğu, başlangıç noktası olarak bir veya daha fazla **kapalı 2D şekil** (genellikle tel - `Wire` olarak adlandırılır) bekler. Bu nedenle, hassas ve doğru 2D çizimler yapabilmek, istediğiniz 3D modeli elde etmenin anahtarıdır.

CadQuery’de bu süreci genellikle iki temel adımda gerçekleştiririz:

1.  Bir çalışma düzlemi üzerinde 2D bir şekil (eskiz) çizmek.
2.  Bu şekli `extrude()` gibi bir komutla 3D hacme dönüştürmek.

Haydi başlayalım!

---

### 1. Basit Kapalı Şekiller: Dikdörtgen, Daire, Poligon

En temel 2D yapı taşlarımızla başlayalım. Bu komutlar genellikle doğrudan `extrude` için hazır, kapalı "teller" (wires) oluşturur.

*   **Dikdörtgen (`rect`)**: Belirtilen genişlik (X) ve yükseklikte (Y) bir dikdörtgen çizer. Varsayılan olarak çalışma düzleminin merkezine hizalıdır.
    ```python
    import cadquery as cq
    from cadquery import exporters

    # XY düzleminde 50x30'luk bir dikdörtgen eskizi oluştur
    eskiz_dikdortgen = cq.Workplane("XY").rect(50, 30) # Bu bir 2D tel (Wire) oluşturur

    # Dikdörtgen eskizini Z yönünde 10 birim uzatarak 3D prizma yap
    model_dikdortgen_prizma = eskiz_dikdortgen.extrude(10)

    # Modeli dışa aktar
    # exporters.export(model_dikdortgen_prizma, 'dikdortgen_prizma.step')

    # 3D modeli göster
    # show_object(model_dikdortgen_prizma, name="Dikdörtgen Prizma")
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Dikdörtgen Prizma</h1>
  <model-viewer
    src="/models/2B_den_3B_ye_dikdortgen.gltf" # Dosyanın var olduğundan emin olun
    alt="Bir dikdörtgenin extrude edilmesiyle oluşturulmuş prizma"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

*   **Daire (`circle`)**: Belirtilen yarıçapta bir daire çizer.
    ```python
    import cadquery as cq
    from cadquery import exporters

    # XY düzleminde 20 yarıçaplı daire eskizi oluştur
    eskiz_daire = cq.Workplane("XY").circle(20) # 2D daire teli (Wire)

    # Daire eskizini Z yönünde 15 birim uzatarak 3D silindir yap
    model_silindir = eskiz_daire.extrude(15)

    # Modeli dışa aktar
    # exporters.export(model_silindir, 'daireden_silindir.step')

    # 3D modeli göster
    # show_object(model_silindir, name="Silindir")
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Silindir</h1>
  <model-viewer
    src="/models/2B_den_3B_ye_silindir.gltf" # Dosyanın var olduğundan emin olun
    alt="Bir dairenin extrude edilmesiyle oluşturulmuş silindir"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

*   **Çokgen (`polygon`)**: Düzgün bir çokgen (eşkenar üçgen, kare, beşgen vb.) çizer. Kenar sayısı (`nSides`) ve genellikle köşeler arasındaki çap (`diameter`) belirtilir.
    ```python
    import cadquery as cq
    from cadquery import exporters

    # XY düzleminde 6 kenarlı, 40 çapında altıgen eskiz oluştur
    eskiz_altigen = cq.Workplane("XY").polygon(nSides=6, diameter=40) # 2D altıgen teli (Wire)

    # Altıgen eskizi Z yönünde 12 birim uzatarak 3D prizma yap
    model_altigen_prizma = eskiz_altigen.extrude(12)

    # Modeli dışa aktar
    # exporters.export(model_altigen_prizma, 'altigen_prizma.step')

    # 3D modeli göster
    # show_object(model_altigen_prizma, name="Altıgen Prizma")
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Altıgen Prizma</h1>
  <model-viewer
    src="/models/2B_den_3B_ye_cokgen.gltf" # Dosyanın var olduğundan emin olun
    alt="Bir altıgenin extrude edilmesiyle oluşturulmuş prizma"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

----

### 2. Çizgiler ve Eğriler Oluşturma (`moveTo`, `lineTo`, `close`, `threePointArc`, `tangentArcPoint`)

Bazen standart şekiller yeterli olmaz ve kendi özel yollarımızı çizmemiz gerekir. Burada sanki sanal bir "kalem" kullanarak çizim yaparız. Bu komutlar genellikle **açık yollar** oluşturur ve `extrude` gibi işlemler için `close()` ile kapatılmaları gerekir.

*   **`moveTo(x, y)`**: Kalemi belirtilen (x, y) koordinatına taşır, çizim yapmaz. Yeni bir yola başlarken veya ayrı bir parça çizerken kullanılır.
*   **`lineTo(x, y)`**: Kalemin mevcut konumundan belirtilen (x, y) koordinatına düz bir çizgi çizer.
*   **`close()`**: Mevcut yolu, başlangıç noktasına otomatik olarak düz bir çizgi çizerek kapatır. Kapalı bir tel (Wire) oluşturmak için genellikle yolun sonuna eklenir.

    ```python
    import cadquery as cq
    from cadquery import exporters

    # XY düzleminde "L" şeklinde bir 2D eskiz oluşturalım
    eskiz_l_sekli = (
        cq.Workplane("XY")      # XY düzleminde çalışmaya başla
        .moveTo(0, 0)           # Kalemi (0,0)'a taşı (başlangıç noktası)
        .lineTo(30, 0)          # (30,0)'a çizgi çiz
        .lineTo(30, 10)         # (30,10)'a çizgi çiz
        .lineTo(10, 10)         # (10,10)'a çizgi çiz ('L'nin iç köşesi)
        .lineTo(10, 30)         # (10,30)'a çizgi çiz
        .lineTo(0, 30)          # (0,30)'a çizgi çiz
        .close()                # Yolu kapat (otomatik olarak (0,30)'dan (0,0)'a çizer)
    )
    # Yukarıdaki komut zinciri, kapalı bir "L" harfi formunda 2D tel (Wire) oluşturdu.

    # Oluşturulan 2D "L" eskizini Z ekseninde 8 birim uzatarak 3D prizmaya dönüştür
    model_l_prizma = eskiz_l_sekli.extrude(8)

    # Modeli dışa aktar
    # exporters.export(model_l_prizma, 'l_prizma.step')

    # 3D modeli göster
    # show_object(model_l_prizma, name="L Şekli Prizma")
    ```
<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">L Şekli Prizma</h1>
  <model-viewer
    src="/models/l_prizma.gltf" # Dosyanın var olduğundan emin olun
    alt="L şeklinde bir profilin extrude edilmesiyle oluşturulmuş prizma"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

*   **Yaylar (`threePointArc`, `tangentArcPoint`)**: Düz çizgiler yerine eğimli yollar çizmek için kullanılır.
    *   `threePointArc((x1, y1), (x2, y2))`
    Mevcut konumdan başlayıp, verilen birinci noktadan (`(x1, y1)`) geçerek ikinci noktada (`(x2, y2)`) biten bir yay çizer. Üç nokta ile tanımlanır:
    - Başlangıç noktası (otomatik olarak mevcut konum)
    - Ara nokta
    - Bitiş noktası

    **Örnek:**
    ```python
        cq.Workplane("XY").moveTo(0, 0).threePointArc((2, 2), (4, 0))
    ```

    Bu kod, `(0,0)` → `(2,2)` → `(4,0)` noktalarından geçen bir yay çizer.

    *   `tangentArcPoint((x, y))` Mevcut konumdan başlayıp verilen noktada (`(x, y)`) biten ve **başlangıçtaki son çizgi segmentine teğet** olan bir yay çizer. Yumuşak geçişler için idealdir çünkü yay, önceki çizginin yönüyle uyum sağlar.

    **Önemli Özellikler:**
         - **Göreli Koordinat:** Varsayılan olarak `relative=True` olduğu için, verilen nokta **mevcut konuma göre hesaplanır**.
         - **Teğetlik:** Yay, önceki çizginin sonuna pürüzsüz bir şekilde bağlanır.

    **Örnek:**

    ```python
        cq.Workplane("XY").moveTo(0, 0).lineTo(10, 0).tangentArcPoint((5, 8))
    ```
    Bu kod:
    1. `(0,0)` → `(10,0)` doğrusunu çizer.
    2. `(10,0)` noktasından başlayarak, `(10+5, 0+8) = (15,8)` noktasında biten ve önceki çizgiye teğet bir yay ekler.

    ```python
    import cadquery as cq
    from cadquery import exporters

    # XY düzleminde basit bir kanat profili gibi 2B eskiz oluştur
    kanat_profili_2B = (
        cq.Workplane("XY")          # XY düzleminde başla
        .moveTo(0,0)                # Başlangıç noktası
        .lineTo(10, 0)              # Düz alt kenar (10,0)'a kadar
        .tangentArcPoint((15, 8))   # (15,8)'e teğet bir yay çiz (üst kavis)
        .lineTo(0, 0)               # Başlangıç noktasına dönerek kapat (veya .close() kullan)
        # .close()                  # Alternatif kapatma yöntemi
    )

    # 2B eskizi Z yönünde 75 birim uzatarak 3B kanat modelini oluştur
    kanat_modeli_3B = kanat_profili_2B.extrude(75)

    # 3B kanat modelini görüntüle
    # show_object(kanat_modeli_3B, name="3B Kanat Profili")

    # 3B modeli dışa aktar
    # exporters.export(kanat_modeli_3B, 'kanat_profili.step')
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">3B Kanat Profili</h1>
  <model-viewer
    src="/models/kanat.gltf" # Dosyanın var olduğundan emin olun
    alt="Basit bir kanat profilinin extrude edilmiş hali"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

-----

📌 İpuçları ve Dikkat Edilmesi Gerekenler

1. **Koordinat Sistemleri:**
   - `relative=True`: Noktalar mevcut pozisyona göre hesaplanır.
   - `relative=False`: Noktalar mutlak koordinatlardır.

2. **Yayların Teğetliği:**
   - `tangentArcPoint`, önceki çizginin yönüne göre eğimli geçişler sağlar. Bu, aerodinamik profillerde doğal görünümler oluşturmak için idealdir.

3. **Şekil Kapatma:**
   - `.close()`, son noktayı başlangıç noktasına otomatik bağlar. Manuel olarak `.lineTo()` kullanmak daha kontrol edilebilir olabilir.

-----

*   **Örnek: Ay-Yıldız Modeli** (Daha karmaşık bir eskiz ve Boolean operasyonları içerir)

    ```python
    import cadquery as cq
    import math
    from cadquery import exporters

    # --- Ay-Yıldız Parametreleri ---
    ay_dis_yaricap = 30
    ay_ic_yaricap = 25
    ay_merkez_kaymasi = 8  # İç dairenin merkezini X'te kaydırarak hilali oluştur
    kalinlik = 3           # Modelin Z kalınlığı

    yildiz_kose_sayisi = 5
    yildiz_dis_yaricap = 9
    yildiz_ic_yaricap = 3.5
    # Yıldız merkezini hilalin sağına yerleştir
    yildiz_merkez_x = ay_dis_yaricap * 0.8 + ay_merkez_kaymasi
    yildiz_merkez_y = 0
    # Yıldızı hafifçe döndür (radyan cinsinden)
    yildiz_donme_acisi = math.pi / 2 - math.pi / 10 # Yaklaşık 72 derece (bir köşe hafif yukarı baksın)

    # --- 1. Hilal (Ay) Oluşturma (Boolean Cut ile) ---
    # Dış daireyi oluştur ve extrude et
    dis_silindir = cq.Workplane("XY").circle(ay_dis_yaricap).extrude(kalinlik)
    # İç daireyi oluştur, kaydır ve extrude et
    ic_silindir = (
        cq.Workplane("XY")
        .moveTo(ay_merkez_kaymasi, 0) # Merkezi kaydır
        .circle(ay_ic_yaricap)
        .extrude(kalinlik)
    )
    # Dış silindirden iç silindiri çıkararak hilali oluştur
    model_ay = dis_silindir.cut(ic_silindir)

    # --- 2. Yıldız Oluşturma (Polyline ile) ---
    yildiz_noktalari = []
    toplam_kose = 2 * yildiz_kose_sayisi
    aci_adimi = 2 * math.pi / toplam_kose

    for i in range(toplam_kose):
        aci = i * aci_adimi + yildiz_donme_acisi # Dönme açısını ekle
        # Dış ve iç yarıçapları sırayla kullan
        yaricap = yildiz_dis_yaricap if i % 2 == 0 else yildiz_ic_yaricap
        # Noktaları hesapla ve merkez kaymasını ekle
        x = yildiz_merkez_x + yaricap * math.cos(aci)
        y = yildiz_merkez_y + yaricap * math.sin(aci)
        yildiz_noktalari.append((x, y))

    # Yıldız eskizini polyline ile oluştur ve kapat
    eskiz_yildiz = (
        cq.Workplane("XY")
        .polyline(yildiz_noktalari)
        .close()
    )
    # Yıldız eskizini extrude et
    model_yildiz = eskiz_yildiz.extrude(kalinlik)

    # --- 3. Ay ve Yıldızı Birleştirme (Union) ---
    ay_yildiz_modeli = model_ay.union(model_yildiz)

    # --- Göster ve Kaydet ---
    # show_object(ay_yildiz_modeli, name="Ay-Yıldız Modeli")
    # exporters.export(ay_yildiz_modeli, 'ay_yildiz.step')
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Ay-Yıldız Modeli</h1>
  <model-viewer
    src="/models/ay_yildiz.gltf" # Dosyanın var olduğundan emin olun
    alt="3 Boyutlu Ay-Yıldız modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 0, 0);" /> <!-- Arka plan kırmızı :) -->
</Layout>

-----

### 3. İleri Düzey Yollar: Polyline ve Spline

Daha karmaşık veya serbest formlu yollar çizmek için `polyline` ve `spline` kullanılır.

*   **Polyline (`polyline`)**: Bir dizi noktayı (`[(x1,y1), (x2,y2), ...]`) sırayla **düz çizgilerle** birleştirir. Keskin köşeli yollar veya belirli koordinatlardan geçen profiller için idealdir. Genellikle açık bir yol oluşturur, kapatmak için `close()` gerekir.

    ```python
    import cadquery as cq
    from cadquery import exporters

    # Yıldız benzeri bir şeklin köşe noktaları
    noktalar_yildiz = [
        (0, 10), (2.4, 3.1), (9.5, 3.1), (3.8, -1.2), (6.0, -8.1),
        (0, -4.0), (-6.0, -8.1), (-3.8, -1.2), (-9.5, 3.1), (-2.4, 3.1)
    ]

    # Polyline ile kapalı 2B eskiz oluşturma
    eskiz_yildiz_polyline = (
        cq.Workplane("XY")
        .polyline(noktalar_yildiz) # Noktaları düz çizgilerle birleştir
        .close()                   # Şekli kapat (son noktayı ilk noktaya bağla)
    )

    # 3B Model Oluşturma
    model_yildiz_polyline = eskiz_yildiz_polyline.extrude(3) # 3 birim kalınlık ver

    # Görselleştirme ve Dışa Aktarma
    # show_object(model_yildiz_polyline, name="Polyline Yıldız")
    # exporters.export(model_yildiz_polyline, 'polyline_yildiz.step')
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Polyline ile Yıldız</h1>
  <model-viewer
    src="/models/polyline.gltf" # Dosyanın var olduğundan emin olun
    alt="Polyline ile çizilmiş yıldız benzeri şeklin extrude edilmiş hali"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

    **Ne zaman kullanılır?** Belirli koordinatlardan geçen, keskin dönüşler içeren yollar veya profiller oluşturmak için. CNC yolu tanımlama, ölçülü karmaşık profiller çizme vb.

*   **Spline (`spline`)**: Bir dizi kontrol noktasından **yumuşak bir eğriyle** geçen bir yol (genellikle B-spline) oluşturur. Organik ve akıcı formlar için kullanılır.

    ```python
    import cadquery as cq
    from cadquery import exporters

    # Spline eğrisinin kontrol noktaları
    noktalar_spline = [
        (0, 0), (10, 15), (25, 10), (40, 20), (50, 0)
    ]

    # Spline ve çizgilerden oluşan kapalı 2B eskiz
    eskiz_spline_kapali = (
        cq.Workplane("XY")
        .spline(noktalar_spline) # Noktalardan geçen spline eğrisi çiz (şu an (50,0)'da)
        .lineTo(50, -10)         # Düz çizgi ile (50, -10)'a git
        .lineTo(0, -10)          # Düz çizgi ile (0, -10)'a git
        .close()                 # Şekli kapat ((0,-10)'dan başlangıç noktası (0,0)'a)
    )

    # 3B Model Oluşturma
    model_spline = eskiz_spline_kapali.extrude(6) # 6 birim kalınlık ver

    # Görselleştirme ve Dışa Aktarma
    # show_object(model_spline, name="Spline Tabanlı Şekil")
    # exporters.export(model_spline, 'spline_sekil.step')
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Spline Tabanlı Şekil</h1>
  <model-viewer
    src="/models/spline.gltf" # Dosyanın var olduğundan emin olun
    alt="Bir spline eğrisi ve düz çizgilerden oluşan profilin extrude edilmiş hali"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

    **Ne zaman kullanılır?** Yumuşak geçişlere sahip, estetik açıdan önemli, aerodinamik veya organik formlar oluşturmak için.

**Polyline vs Spline:** Temel fark, `polyline`'ın noktaları **düz çizgilerle** birleştirmesi, `spline`'ın ise noktalar arasından **yumuşak bir eğriyle** geçmesidir.

----

### 4. Kopyalama ve Çoğaltma (Programatik Olarak)

Aynı 2D şekli birden çok kez farklı konumlarda çizmek istediğinizde, Python'un döngülerini (`for`, `while`) kullanmak en verimli yoldur. CadQuery'nin yığın (stack) mantığı burada işe yarar: Aynı `Workplane` nesnesi üzerinde yapılan her çizim işlemi (örn. `circle`), o şekli yığına ekler. Sonunda `extrude` gibi bir komut, yığındaki tüm bu şekiller üzerinde çalışır.

```python
import cadquery as cq
from cadquery import exporters

# Boş bir XY çalışma düzlemi ile başla
wp = cq.Workplane("XY")
daire_yaricapi = 5
bosluk = 20 # Daire merkezleri arasındaki mesafe

# 3x3 bir grid (ızgara) üzerinde daireler çizmek için iç içe döngüler
for i in range(-1, 2): # X konumu için: -1, 0, 1
    for j in range(-1, 2): # Y konumu için: -1, 0, 1
        # Her (x, y) konumuna git ve orada bir daire çiz
        # Her döngüde wp nesnesi güncellenerek yeni daire yığına eklenir
        x_konum = i * bosluk
        y_konum = j * bosluk
        wp = wp.moveTo(x_konum, y_konum).circle(daire_yaricapi)

# Çalışma düzlemindeki yığında biriken tüm (9 tane) daireyi Z yönünde 5 birim uzat
model_coklu_daire = wp.extrude(5)

# Dışa aktarma
# exporters.export(model_coklu_daire, 'coklu_silindirler.step')

# Görselleştirme
# show_object(model_coklu_daire, name="Çoklu Silindirler")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Çoklu Silindirler (Grid)</h1>
  <model-viewer
    src="/models/coklu_daire.gltf" # Dosyanın var olduğundan emin olun
    alt="Bir grid üzerinde düzenlenmiş çoklu silindir modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

Burada `wp = wp.moveTo(...).circle(...)` satırı kritiktir. Her seferinde `moveTo` ile yeni bir konuma gidilir ve `circle` ile o konuma bir daire eklenir. `wp` değişkeni sürekli güncellenerek tüm daireleri içeren yığını temsil eder hale gelir. Son `extrude` komutu bu yığındaki tüm daireleri işleme alır.

-----

### 5. 2D Şekilleri Birleştirme ve Çıkarma (Genellikle 3D'de Yapılır)

CadQuery'de doğrudan 2D seviyesinde karmaşık Boolean (birleştirme, çıkarma, kesişim) operasyonları yapmak yerine, genellikle şu yöntemler daha yaygındır:

1.  **Ayrı Ayrı Extrude + 3D Boolean:** Farklı 2D eskizler oluşturulur, bunlar ayrı ayrı 3D katılara dönüştürülür (`extrude`) ve sonra bu 3D katılar üzerinde `union`, `cut`, `intersect` gibi 3D Boolean operasyonları yapılır. (Bu **en yaygın ve esnek** yöntemdir).
2.  **Tek Eskizde Çoklu Şekil (Implicit Boolean):** Aynı `Workplane` yığınına birden fazla kapalı tel çizilir. `extrude` komutu bu durumda genellikle:
    *   Birbirine değmeyen veya dışarıda olan telleri ayrı katılar olarak uzatır (eğer istenirse sonra `union` ile birleştirilebilir).
    *   Birbirine değen veya kesişen telleri otomatik olarak birleştirerek (`implicit union`) tek bir katı oluşturur.
    *   Bir tel tamamen başka bir telin **içindeyse**, içteki teli bir **boşluk** olarak yorumlar (`implicit cut`).

    ```python
    import cadquery as cq
    from cadquery import exporters

    # İç içe ve kesişen şekillerden oluşan tek bir 2D eskiz (yığınında birden fazla tel olacak)
    eskiz_karma = (
        cq.Workplane("XY")
        .rect(40, 40)             # 1. Dış 40x40 dikdörtgen (yığına eklendi)
        .moveTo(0,0).circle(10)   # 2. Merkeze 10 yarıçaplı daire (yığına eklendi - dikdörtgenin içinde)
        .moveTo(20,20).rect(15,15) # 3. Sağ üste 15x15 kare (yığına eklendi - dış dikdörtgenle kesişiyor)
    )
    # Şu anda yığında 3 adet kapalı tel var.

    # Bu karma eskizi 10 birim uzat
    model_karma = eskiz_karma.extrude(10)
    # Extrude işlemi:
    # - Dış dikdörtgeni ve sağ üstteki kareyi birleştirir (implicit union).
    # - Ortadaki daireyi boşluk olarak kabul eder (implicit cut).

    # Dışa aktarma
    # exporters.export(model_karma, 'karma_eskiz_extrude.step')

    # Görselleştirme
    # show_object(model_karma, name="İç İçe ve Kesişen Extrude")
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Implicit Boolean ile Extrude</h1>
  <model-viewer
    src="/models/model_karma.gltf" # Dosyanın var olduğundan emin olun
    alt="İç içe ve kesişen 2D şekillerin extrude edilmesiyle oluşan model (implicit boolean)"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

-----

### 6. Text ve Yazı Ekleme (`text`)

Modellerinize yazı eklemek için `text` komutu kullanılır. Bu komut, belirtilen metni, yazı tipini, boyutunu ve kalınlığını kullanarak doğrudan bir **3D katı metin nesnesi** oluşturur.

```python
import cadquery as cq
from cadquery import exporters

# XY düzleminde 3D metin modeli oluştur
metin_model = cq.Workplane("XY").text(
    txt="Gülveren Lab!",  # Görüntülenecek metin
    fontsize=10,        # Yazı tipi boyutu (yaklaşık birim)
    distance=3,         # Metnin kalınlığı (extrude mesafesi)
    halign="center",    # Yatay hizalama: 'center', 'left', 'right'
    valign="center",    # Dikey hizalama: 'center', 'top', 'bottom'
    font="Arial"        # Kullanılacak yazı tipi (sistemde yüklü olmalı!)
)

# Modeli dışa aktar
# exporters.export(metin_model, '3d_metin.step')

# Modeli görüntüle
# show_object(metin_model)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">3D Metin Modeli</h1>
  <model-viewer
    src="/models/metin.gltf" # Dosyanın var olduğundan emin olun
    alt="3 Boyutlu olarak oluşturulmuş 'Gulderen Lab!' metni"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

**Önemli Not:** `font` parametresi için belirttiğiniz yazı tipinin, kodu çalıştırdığınız sistemde **yüklü olması** gerekir. Aksi takdirde hata alabilir veya varsayılan bir yazı tipi kullanılabilir.

---

### 7. 🧱 2D Eskizden 3D Modele Geçiş: `extrude()` Detayları

Şimdiye kadar çeşitli 2D şekiller ve yollar oluşturmayı öğrendik. Bu düzlemsel eskizlere hacim kazandırmanın en yaygın yolu `extrude()` komutudur.

`extrude(distance, both=False, taper=0)`:

*   `distance`: Eskizin ne kadar mesafe boyunca uzatılacağını belirtir. Pozitif değer, çalışma düzleminin normali yönünde (genellikle +Z), negatif değer ters yönde uzatır.
*   `both=True`: Uzatma işlemini belirtilen mesafenin yarısı pozitif, yarısı negatif yönde olacak şekilde yapar (toplam mesafe `distance` kadar olur).
*   `taper`: Uzatma sırasında profile açı vermek için kullanılır (konikleşme). Derece cinsinden açı değeri alır.

#### 🔹 Daireden Silindire (Basit Extrude)

```python
import cadquery as cq

silindir = (
    cq.Workplane("XY")  # XY düzleminde başla
    .circle(10)         # 10 birim yarıçaplı daire çiz (2D Wire)
    .extrude(30)        # Bu daireyi +Z yönünde 30 birim uzat
)
# show_object(silindir, name="Basit Silindir")
```
-   Bu kod, 10 yarıçaplı daireyi Z=0'dan Z=30'a kadar uzatarak 30 birim yüksekliğinde bir silindir oluşturur.

#### 🔹 Dikdörtgenden Prizmaya (Simetrik Extrude - `both=True`)

```python
import cadquery as cq

kutu_simetrik = (
    cq.Workplane("XY")  # XY düzleminde başla
    .rect(40, 20)       # 40x20 boyutunda dikdörtgen çiz (2D Wire)
    .extrude(10, both=True) # Toplam 10 birim, Z=-5'ten Z=+5'e uzat
)
# show_object(kutu_simetrik, name="Simetrik Kutu")
```
-   40x20 tabanlı dikdörtgen, Z ekseninde **simetrik olarak** toplam 10 birim yüksekliğe sahip bir katıya dönüşür. Bu, `box(40, 20, 10)` komutuyla aynı sonucu verir.

#### 🔹 Konik Extrude (`taper`)

```python
import cadquery as cq

konik_kup = (
    cq.Workplane("XY")
    .rect(20, 20)           # 20x20 kare çiz
    .extrude(30, taper=10)  # +Z yönünde 30 birim uzatırken 10 derece dışa doğru açı ver
)
# show_object(konik_kup, name="Konik Kutu")
```
-   Kare taban yukarı doğru uzarken kenarları dışa doğru 10 derecelik açıyla genişler, kesik bir piramit gibi görünür.

---

### 🧠 Neden Extrude Önemlidir?

`extrude` komutu, parametrik modellemenin temel taşlarından biridir:

*   **Profil Tabanlı Modelleme:** Gerçek dünyadaki birçok nesne (profiller, raylar, basit muhafazalar vb.) belirli bir 2D profilin uzatılmasıyla oluşturulabilir.
*   **Basitlik ve Kontrol:** 2D eskizi kontrol etmek genellikle 3D formu doğrudan manipüle etmekten daha kolaydır. Eskizi değiştirip tekrar `extrude` uygulayarak modeli kolayca güncelleyebilirsiniz.
*   **Temel Yapı Taşı:** Daha karmaşık operasyonlar (kesme, birleştirme vb.) için genellikle önce `extrude` ile temel bir hacim oluşturulur.

---

### 🧪 Eğlenceli Bir Uygulama: Üçgen Prizma

`polyline` ile çizdiğimiz bir üçgeni `extrude` ile nasıl prizmaya dönüştürebileceğimizi tekrar görelim:

```python
import cadquery as cq
from cadquery import exporters

# Üçgen prizma oluştur
prizma = (
    cq.Workplane("XY")                      # XY düzleminde başla
    .moveTo(0, 0)                           # (0,0)'a git
    .lineTo(20, 0)                          # (20,0)'a çiz
    .lineTo(10, 15)                         # (10,15)'e çiz (tepe nokta)
    .close()                                # Yolu kapatarak kapalı 2D üçgen (Wire) oluştur
    .extrude(10)                            # Üçgeni +Z yönünde 10 birim uzatarak katı prizma yap
)

# Dışa Aktarma (Örnek: GLTF)
# exporters.export(prizma, 'ucgen_prizma.gltf')

# Görselleştirme
# show_object(prizma)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Üçgen Prizma</h1>
  <model-viewer
    src="/models/prizma.gltf" # Dosyanın var olduğundan emin olun
    alt="Bir üçgenin extrude edilmesiyle oluşturulmuş prizma"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

- Bu örnekte, `moveTo`, `lineTo` ve `close` ile oluşturduğumuz 2D üçgen profilini 10 birim yukarı doğru uzatarak basit bir üçgen prizma elde ettik.

📸 *Bu basit teknikle bile mimari detaylar, mekanik parçaların temel formları veya basit geometrik oyuncaklar oluşturmaya başlayabilirsiniz.*

---

### 🎯 Özetle (2D Eskiz ve Extrude):

*   `rect()`, `circle()`, `polygon()` gibi komutlarla hızlıca standart **2D kapalı şekiller** oluşturulur.
*   `moveTo()`, `lineTo()`, `threePointArc()`, `tangentArcPoint()`, `polyline()`, `spline()` gibi komutlarla **özel yollar ve profiller** çizilebilir.
*   `close()` komutu açık yolları kapatarak `extrude` gibi hacim oluşturma komutlarına uygun hale getirir.
*   Oluşturulan kapalı 2D eskizler (teller/`Wire`), `extrude()` komutu kullanılarak kolayca **3D katı nesnelere** dönüştürülür. `both` ve `taper` gibi parametrelerle ek kontrol sağlanır.
*   Bu 2D çizim ve 3D'ye geçiş adımları, CadQuery ile modelleme yaparken en sık kullanacağınız temel iş akışlarından biridir.

---

### Sonuç (Bölüm 2 - Eskiz ve Extrude)

Bu bölümde CadQuery'nin güçlü 2D eskiz yeteneklerine derinlemesine bir bakış attık. Dikdörtgenler, daireler, çokgenler gibi temel şekillerden, `polyline` ve `spline` gibi serbest formlu yollara kadar çeşitli araçları inceledik. `moveTo`, `lineTo` ve `close` ile adım adım nasıl özel profiller oluşturabileceğimizi gördük. En önemlisi, bu 2D çizimleri `extrude` komutuyla (ve parametreleriyle) nasıl 3 boyutlu katı modellere dönüştürebileceğimizi öğrendik.

Bu temel 2D çizim ve `extrude` bilgisi, CadQuery ile yapabileceklerinizin sadece başlangıcıdır. Artık kendi özel profillerinizi tasarlayıp onlara hacim kazandırarak çok daha çeşitli ve karmaşık modeller oluşturmaya hazırsınız.

Bir sonraki bölümde, bu oluşturduğumuz katıları nasıl birleştireceğimize, birbirinden çıkaracağımıza (`cut`), kesişimlerini alacağımıza (`intersect`) ve kenarlarına nasıl pah (`chamfer`) veya radius (`fillet`) atacağımıza, yani **Boolean operasyonları ve detaylandırma** konularına odaklanacağız.

**Unutmayın:** En iyi öğrenme yolu denemektir! Farklı 2D şekiller çizin ve onları `extrude` ile 3D'ye dönüştürerek pratik yapın!

---

🚀 Sıradaki durağımız:
**Boolean işlemleriyle** parçaları birleştirmek, kesmek, kesişimlerini almak ve `chamfer`/`fillet` ile detay eklemek.
Yani 3D tasarımda gerçek sihrin başladığı yere gidiyoruz!

-----

## 🔗 Boolean Operasyonları ve Detaylandırma

3D modelleme dünyasında, karmaşık parçalar genellikle **basit katı şekillerin mantıksal olarak birleştirilmesi, çıkarılması veya kesiştirilmesiyle** elde edilir. CadQuery'de bu temel işlemleri **Boolean operasyonları** gerçekleştirir:

*   🔹 `union()` – İki veya daha fazla katıyı tek bir katı halinde **birleştirir**.
*   🔹 `cut()` – Bir katıdan başka bir katının hacmini **çıkarır**.
*   🔹 `intersect()` – İki veya daha fazla katının yalnızca **ortak (kesişen) hacmini** bırakır.

Bunlar, geometriyi mantıksal olarak işleyerek yeni formlar yaratmanın temel yoludur. Ayrıca, modellerimize estetik ve işlevsel detaylar katmak için **kenar işlemleri** olan `chamfer()` ve `fillet()` komutlarını öğreneceğiz.

---

### ◦ 🧱 `union()`: Şekilleri Birleştirmek

İki veya daha fazla katı nesneyi tek bir nesneye dönüştürür. İç içe geçen veya dokunan kısımlar kaynaşır.

```python
import cadquery as cq
from cadquery import exporters

# İki ayrı kutu oluştur
kutu1 = cq.Workplane("XY").box(20, 20, 10)
# İkinci kutuyu biraz yukarı ve yana kaydırarak oluştur
kutu2 = cq.Workplane("XY").box(15, 15, 15).translate((10, 10, 5))

# İki kutuyu birleştir
birlesik_kutular = kutu1.union(kutu2)

# show_object(birlesik_kutular, name="Birleşik Kutular")
# exporters.export(birlesik_kutular, 'union_ornegi.step')
```

*Implicit Union (Örtük Birleştirme)*: Daha önce gördüğümüz gibi, aynı `Workplane` üzerinde `extrude` veya diğer katı oluşturma işlemleri yapıldığında, eğer yeni katı mevcut katıyla kesişiyorsa, CadQuery genellikle bunları **otomatik olarak birleştirir**.

Örnek (Önceki L-Prizma örneğinin farklı bir yorumu):
```python
import cadquery as cq
# Alt blok
alt_blok = cq.Workplane("XY").box(20, 20, 10)
# Üstüne ek blok (implicit union ile birleşecek)
model_implicit_union = (
    alt_blok
    .faces(">Z")        # Alt bloğun üst yüzeyini seç
    .workplane()        # Yeni çalışma düzlemi
    .rect(10, 10)       # Üst yüzeye daha küçük bir dikdörtgen çiz
    .extrude(15)        # Uzatarak ikinci bloğu oluştur ve alt blokla birleştir
)
# show_object(model_implicit_union, name="Implicit Union Örneği")
```

---

### ◦ ✂️ `cut()`: Şekilden Malzeme Çıkarmak

Bir katıdan (ana gövde) başka bir katının (kesici takım) hacmini çıkarmak için kullanılır.

```python
import cadquery as cq
from cadquery import exporters

# Ana gövde: Büyük bir kutu
ana_kutu = cq.Workplane("XY").box(40, 40, 20)

# Kesici takım: Daha küçük bir küre, kutunun içine biraz girecek şekilde konumlandırılmış
kesici_kure = cq.Workplane("XY").sphere(15).translate((15, 15, 10))

# Ana kutudan küreyi çıkar
oyuklu_kutu = ana_kutu.cut(kesici_kure)

# show_object(oyuklu_kutu, name="Oyuklu Kutu")
# exporters.export(oyuklu_kutu, 'cut_ornegi.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Prizmada Küre Şeklinde Oyuk Oluşturma</h1>
  <model-viewer
    src="/models/prizma_kure_oyuk.gltf" # Dosyanın var olduğundan emin olun
    alt="Bir üçgenin extrude edilmesiyle oluşturulmuş prizma"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte, `ana_kutu`'dan `kesici_kure`'nin kapladığı hacim çıkarılır ve kutunun köşesinde küresel bir oyuk oluşur.

#### `cutBlind()` ve `cutThruAll()` ile Profil Kesme

`cut()` genel bir Boolean çıkarma işlemiyken, özellikle bir **2D profil (eskiz)** kullanarak belirli bir derinliğe kadar veya tüm model boyunca kesme yapmak için daha özel ve okunabilir metodlar vardır:

*   **`cutBlind(distance)`**: Çalışma düzlemindeki 2D profili, belirtilen `distance` kadar (negatif değer içeri doğru) keserek bir cep (pocket) veya kör delik oluşturur.
*   **`cutThruAll()`**: Çalışma düzlemindeki 2D profili, katının **tamamı boyunca** her iki yönde keserek bir delik veya kanal oluşturur. Derinlik belirtmeye gerek yoktur.

🧪 Örnek: Üç farklı delik açalım

```python
import cadquery as cq
from cadquery import exporters

# 40x40x20 boyutunda bir taban plakası
plaka = cq.Workplane("XY").box(40, 40, 20, centered=(True, True, False)) # Tabanı Z=0'da başlasın

# 1. cutBlind ile kör delik (-Z yönünde 10 birim)
model_kor_delik = (
    plaka
    .faces(">Z")        # Üst yüzeyi seç (Z=20)
    .workplane(centerOption="CenterOfMass") # Yüzeyin merkezinde çalış
    .moveTo(-10, 0)     # Deliğin konumuna git
    .circle(5)          # 5 yarıçaplı daire çiz
    .cutBlind(-10)      # -Z yönünde (içeri doğru) 10 birim kes
)

# 2. cutThruAll ile tam delik (aynı model üzerinde devam)
model_tam_delik = (
    model_kor_delik     # Önceki adımdan devam et
    .faces(">Z")        # Tekrar üst yüzeyi seç (veya .workplane() ile devam et)
    .workplane(centerOption="CenterOfMass")
    .moveTo(10, 0)      # Başka bir konuma git
    .circle(5)          # Başka bir daire çiz
    .cutThruAll()       # Tüm plaka boyunca del
)

# 3. Genel cut() ile farklı bir şekil kesme (Örnek amaçlı)
#    Dikdörtgen bir kesici oluşturalım
kesici_dikdortgen = (
    cq.Workplane("XY") # Yeni düzlemde
    .rect(8, 25)       # Kesilecek profil
    .extrude(25)       # Yeterince uzun extrude et
    .translate((0, 0, 5)) # Konumlandır
)
model_son = model_tam_delik.cut(kesici_dikdortgen) # Genel cut ile kes

# show_object(model_son, name="Farklı Kesikler")
# exporters.export(model_son, 'cut_cesitleri.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Farklı Kesme Yöntemleri</h1>
  <!-- Bu modelin GLTF'si yukarıdaki koda göre oluşturulmalı -->
  <model-viewer
    src="/models/cut_cesitleri.gltf"
    alt="Bir plaka üzerinde cutBlind, cutThruAll ve genel cut ile yapılmış kesikler"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

🔍 `cut()` – `cutBlind()` – `cutThruAll()` Karşılaştırması

| Metod         | Açıklama                                    | Derinlik Kontrolü | Tam Delik Garantisi | Okunabilirlik         | Tipik Kullanım                             |
|---------------|---------------------------------------------|-------------------|---------------------|-----------------------|--------------------------------------------|
| `cut()`       | Genel Boolean çıkarma (Katıdan katı çıkar) | ✅ (Kesiciye bağlı) | ❌                  | 🟡 Orta (Niyet gizli) | Karmaşık şekillerle kesme, genel çıkarma |
| `cutBlind()`  | 2D profilden belirli derinliğe kesme        | ✅ (Parametre ile) | ❌                  | ✅ Yüksek (Niyet açık)| Cep açma, kör delik                        |
| `cutThruAll()`| 2D profilden tüm katı boyunca kesme         | ❌ (Gerek yok)    | ✅                  | ✅ Yüksek (Niyet açık)| Tam delik, boydan boya kanal             |

---

### 🔀 `intersect()` ile Ortak Alanı Almak

İki veya daha fazla katının **sadece kesişim (ortak) bölgelerini** tutar, geri kalan kısımları kaldırır.

🧪 Örnek – Kutunun İçine Sığan Kürenin Kesişimi

```python
import cadquery as cq
from cadquery import exporters

# 30x30x30 kutu oluştur
kutu = cq.Workplane("XY").box(30, 30, 30)

# R=20 merkezlenmiş küre oluştur (kutudan daha büyük)
kure = cq.Workplane("XY").sphere(20)

# Kutu ve kürenin kesişimini al
# Sonuç, kutunun sınırları içinde kalan küre parçası olacaktır
kesisim_modeli = kutu.intersect(kure)

# show_object(kesisim_modeli, name="Kutu-Küre Kesişimi")
# exporters.export(kesisim_modeli, 'intersect_ornegi.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Kutu ve Küre Kesişimi</h1>
  <model-viewer
    src="/models/intersect.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Bir kutu ile bir kürenin kesişiminden oluşan model (yuvarlatılmış köşeli küp)"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

📌 Bu kodda:
Küre kutudan daha büyük olmasına rağmen, `intersect()` sadece her iki katının da bulunduğu ortak hacmi (yani kutunun içinde kalan küre parçasını) sonuç olarak verir. Bu, köşeleri küresel olarak yuvarlatılmış bir küp gibi görünür.

#### 🧠 Ne Zaman Kullanılır?
*   İki şeklin ortak hacmini bulmak istediğinizde.
*   Bir şekli başka bir şeklin sınırları içine "sığdırmak" veya kırpmak istediğinizde.
*   Montajda parçaların birbirine temas ettiği veya iç içe geçtiği bölgeleri analiz etmek için.

---

### 💎 `chamfer()` ve `fillet()` – Kenarlara Detay Ekleme Sanatı

Modellerimizin keskin köşelerini yumuşatmak veya kırmak hem estetik hem de işlevsel nedenlerle önemlidir. CadQuery bunun için iki temel komut sunar: `chamfer` (pah) ve `fillet` (radius/yuvarlatma). Bu komutlar genellikle kenarlar (`edges`) üzerinde çalışır.

---

#### 🔹 `chamfer(distance)` – Pah Kırma (Eğimli Kenar)

Seçilen kenarları belirtilen `distance` kadar **düz bir açıyla** kırar. Genellikle 45 derecelik bir eğim oluşturur (eğer kenarı oluşturan yüzeyler dik ise). Teknik ve keskin bir görünüm verir.

```python
import cadquery as cq
from cadquery import exporters

# Pahlı kutu oluştur
pahli_kutu = (
    cq.Workplane("XY").box(30, 30, 10)  # 30x30x10 kutu
    .edges("|Z")                       # Z eksenine paralel dikey kenarları seç
    .chamfer(2)                        # Seçilen kenarlara 2 birimlik pah kır
)

# show_object(pahli_kutu, name="Pahlı Kutu")
# exporters.export(pahli_kutu, 'chamfer_ornegi.step')
```
<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Pahlı Kutu</h1>
  <model-viewer
    src="/models/chamfer.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Dikey kenarlarına pah kırılmış (chamfer) kutu modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

📌 Bu örnekte, kutunun dikey kenarları 2 birimlik düz bir eğimle kırılmıştır.

#### 🔹 `fillet(radius)` – Radius Atma (Yuvarlatılmış Kenar)

Seçilen kenarları belirtilen `radius` (yarıçap) değerinde **dairesel bir yay** ile yumuşatır. Daha akıcı, organik ve ergonomik bir görünüm kazandırır.

```python
import cadquery as cq
from cadquery import exporters

# Radiuslu kutu oluştur
radiuslu_kutu = (
    cq.Workplane("XY").box(30, 30, 10)  # 30x30x10 kutu
    .edges("|Z")                       # Z eksenine paralel dikey kenarları seç
    .fillet(2)                         # Seçilen kenarlara 2 birim yarıçapında radius at
)

# show_object(radiuslu_kutu, name="Radiuslu Kutu")
# exporters.export(radiuslu_kutu, 'fillet_ornegi.step')
```
<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Radiuslu Kutu</h1>
  <model-viewer
    src="/models/fillet.gltf" # Bu dosyanın var olduğundan emin olun
    alt="Dikey kenarları yuvarlatılmış (fillet) kutu modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

📌 Bu örnekte, aynı kutunun dikey kenarları bu kez 2 birim yarıçaplı yumuşak bir kavisle yuvarlatılmıştır.

---

### 🎯 Chamfer mı Fillet mı? Ne Zaman Hangisini Kullanmalı?


| Özellik / Amaç             | `chamfer()` (Pah)                      | `fillet()` (Radius)                      |
|----------------------------|----------------------------------------|------------------------------------------|
| Görünüm                | Teknik, keskin, endüstriyel            | Akıcı, yumuşak, modern, organik          |
| İşlev (Mekanik)        | Vida/pim girişi kolaylaştırma, çapak alma | Gerilim yığılmasını azaltma, ergonomi    |
| Üretim (CNC)           | Genellikle daha kolay işlenir          | Özel takım gerektirebilir (ball end mill)|
| Üretim (3D Yazıcı)     | Desteksiz basımı zorlaştırabilir       | Genellikle daha kolay basılır (45 derece kuralı) |
| Tipik Kullanım Alanları| Makine parçaları, bağlantı elemanları | Muhafazalar, elle tutulan nesneler, estetik yüzeyler |


📐 **İpucu:** Bir modelde hem `chamfer` hem de `fillet` kullanabilirsiniz. Örneğin, bir vidanın gireceği deliğin ağzına küçük bir `chamfer` yaparken, dış kasaya estetik bir `fillet` uygulayabilirsiniz. Hangi kenarlara hangi işlemi uygulayacağınızı seçmek için **Seçiciler (Selectors)** konusuna ihtiyacımız var.

---

### ◦ 🎯 Seçicilerle Kenar ve Yüzey Seçme: Hassas Kontrol

CadQuery’nin en güçlü yanlarından biri, modelin belirli kısımlarını (yüzeyler, kenarlar, köşeler) **programatik olarak seçebilme** yeteneğidir. Bu, `fillet`, `chamfer`, `cut` gibi işlemleri sadece istediğimiz yerlere uygulamamızı sağlar ve tasarımlarımızı son derece esnek hale getirir.

#### 📚 Temel Seçici Metodları: `faces()` ve `edges()`

*   `faces(selector_string)`: Belirtilen kurala uyan yüzeyleri seçer.
*   `edges(selector_string)`: Belirtilen kurala uyan kenarları seçer.

En yaygın kullanılan seçici kuralları **yön tabanlıdır**:

*   **Yüzeyler (`faces`)**:
    *   `>X`, `<X`: Pozitif / Negatif X yönüne bakanlar.
    *   `>Y`, `<Y`: Pozitif / Negatif Y yönüne bakanlar.
    *   `>Z`, `<Z`: Pozitif / Negatif Z yönüne bakanlar (Genellikle Üst / Alt).
*   **Kenarlar (`edges`)**:
    *   `|X`, `|Y`, `|Z`: Sırasıyla X, Y veya Z eksenine **paralel** olan kenarlar.
    *   `>X`, `<X`, `>Y`, `<Y`, `>Z`, `<Z`: Belirli bir düzlemin **kenar sınırlarını** seçmek için kullanılır (örn. `edges(">Z")` bir kutunun üst yüzeyinin dört kenarını seçer).

```python
import cadquery as cq

kutu = cq.Workplane("XY").box(10, 20, 30)

# Üst yüzeyi seçmek:
ust_yuzey = kutu.faces(">Z")

# Dikey (Z'ye paralel) kenarları seçmek:
dikey_kenarlar = kutu.edges("|Z")

# Ön (pozitif Y) yüzeyin kenarlarını seçmek:
on_yuzey_kenarlari = kutu.edges(">Y")

# Seçilen kenarlara fillet uygulamak:
model_detayli = (
    kutu
    .edges(">Z") # Sadece üst yüzeyin kenarlarını seç
    .fillet(1)   # Bu kenarlara 1mm radius at
)
# show_object(model_detayli)
```

---

#### 🛠️ Gelişmiş Seçici Teknikleri

Seçimlerimizi daha da hassaslaştırmak için ek metodlar ve teknikler kullanabiliriz:

<span style='color: cyan;'>◦ Çoklu Seçim ve Birleştirme (`.add()`)</span>
Farklı seçicilerle elde edilen sonuçları birleştirebilirsiniz:

```python
# Üst VE alt yüzeyleri seçme
ust_alt_yuzeyler = kutu.faces(">Z").add(kutu.faces("<Z"))

# X ve Y yönündeki TÜM yatay kenarları seçme
yatay_kenarlar = kutu.edges("|X").add(kutu.edges("|Y"))
```

<span style='color: cyan;'>◦ Konum ve Geometriye Göre Filtreleme/Sıralama (`.filter()`, `.sort()`, `lambda`)</span>
Seçilen öğeleri geometrik özelliklerine (merkez konumu, alan, uzunluk vb.) göre filtreleyebilir veya sıralayabiliriz. Burada **lambda fonksiyonları** devreye girer:

```python
# Yüksekliği (Z merkezi) 10'dan büyük olan yüzeyleri seç:
ust_bolge_yuzeyleri = kutu.faces().filter(lambda f: f.Center().z > 10)

# En uzun kenarı seç:
en_uzun_kenar = kutu.edges().sort(key=lambda e: e.Length()).last()
# .last() en sonuncuyu (en uzunu), .first() ilkini (en kısayı) alır

# Alanı 50'den küçük olan üst yüzeyleri seç:
kucuk_ust_yuzeyler = kutu.faces(">Z").filter(lambda f: f.Area() < 50)
```
*Not: `lambda` fonksiyonlarını bir sonraki bölümde detaylıca ele alacağız.*

<span style='color: cyan;'>◦ Etiketleme (`.tag()`) ve Etiketle Seçme (`#tag_name`)</span>
Bir seçimi daha sonra kolayca referans vermek üzere etiketleyebilirsiniz:

```python
# Üst yüzeyi etiketle
etiketli_kutu = kutu.faces(">Z").tag("ust_yuzey")

# Başka işlemler yap...
# ...

# Sonra etiketi kullanarak seç ve işlem yap
sonuc = etiketli_kutu.faces("#ust_yuzey").chamfer(0.5)
```

<span style='color: cyan;'>◦ Mantıksal Seçim Operasyonları (`.intersect()`, `.not_()`)</span>
Seçim kümeleri arasında kesişim (VE) veya dışlama (DEĞİL) yapabilirsiniz:

```python
# VE: Z'ye paralel VE X>0 bölgesinde olan kenarlar
sag_dikey_kenarlar = kutu.edges("|Z").intersect(kutu.edges(lambda e: e.Center().x > 0))

# DEĞİL: Dikey olmayan (yani yatay) kenarlar
yatay_kenarlar_yine = kutu.edges().not_(kutu.edges("|Z"))
```

#### ✨ Pratik Uygulamalar

<span style='color: cyan;'>◦ Belirli Kenarlara Pah/Radius Atma</span>
```python
# Sadece üst yüzeyin kısa kenarlarına pah kır
model = kutu.edges(">Z").filter(lambda e: e.Length() < 15).chamfer(1)

# Belirli bir yükseklikteki yatay kenarlara radius at
model = kutu.edges("|X or |Y").filter(lambda e: e.Center().z == 15).fillet(2)
```

<span style='color: cyan;'>◦ Belirli Yüzeylere Delik Açma</span>
```python
# Ön yüzeye (Y>0) delik açmak
delik_modeli = (
    kutu.faces(">Y")      # Ön yüzeyi seç
    .workplane()        # O yüzeyde çalış
    .circle(3)          # Delik profilini çiz
    .cutBlind(-5)       # 5 birim içeri doğru kes
)
```

#### 🔥 Seçicilerde Ustalaşmak İçin İpuçları

*   **Anlamlı Seçiciler Kullanın:** Mümkünse yön (`>Z`, `|X`) veya etiket (`#my_face`) gibi okunabilir seçiciler tercih edin.
*   **Seçimi Doğrulayın:** `len(selection.vals())` veya `selection.size()` ile kaç öğe seçtiğinizi kontrol edin. `show_object(selection)` ile seçilen öğeleri görsel olarak doğrulayın.
*   **Adım Adım Gidin:** Karmaşık seçimleri basit adımlara bölün. Önce genel bir seçim yapın (`faces()`), sonra filtreleyin (`filter()`), sonra belki sıralayın (`sort()`).
*   **Lambda'yı Anlayın:** Konum (`Center()`), Alan (`Area()`), Uzunluk (`Length()`) gibi geometrik özelliklere erişmek için lambda fonksiyonları çok önemlidir.
*   **Parametrik Düşünün:** Seçimlerinizi modelin boyutlarına veya diğer parametrelere bağlı hale getirmeye çalışın. Örneğin, `box(W, L, H)` için `kutu.faces(">Z").filter(lambda f: f.Area() == W*L)` gibi.

Seçiciler, CadQuery'nin parametrik gücünü tam olarak kullanmanızı sağlayan anahtarlardır. Biraz pratikle, modelinizin istediğiniz her noktasını hassas bir şekilde kontrol edebilirsiniz.

-----

### ⚛ Python’da Lambda Fonksiyonları: Hızlı ve Pratik Fonksiyonlar

CadQuery seçicilerinde sıkça karşımıza çıkan `lambda` ifadesi, Python'un güçlü özelliklerinden biridir. Özellikle kısa ve tek seferlik fonksiyonlara ihtiyaç duyduğumuzda çok işe yarar. Seçicilerle birlikte kullanılmasının nedeni, bir filtreleme veya sıralama kuralını anında tanımlamamıza olanak tanımasıdır.

#### 1. Lambda Nedir?

`lambda`, Python'da **isimsiz (anonymous)** fonksiyonlar tanımlamanın kısa bir yoludur. Normal `def` ile tanımlanan fonksiyonların aksine, `lambda` tek bir ifade (expression) içerir ve bu ifadenin sonucunu döndürür.

**Yapısı:**
`lambda arguments: expression`

*   `lambda`: Fonksiyonu tanımlayan anahtar kelime.
*   `arguments`: Fonksiyona geçilecek bir veya daha fazla argüman (parametre), virgülle ayrılır.
*   `expression`: Argümanları kullanarak hesaplanacak ve geri döndürülecek olan tek bir ifade.

**Normal Fonksiyon vs. Lambda:**

```python
# Normal fonksiyon
def kare_al(x):
  return x * x

# Aynı işi yapan lambda fonksiyonu
kare_al_lambda = lambda x: x * x

# Kullanımı aynı:
print(kare_al(5))         # Çıktı: 25
print(kare_al_lambda(5))  # Çıktı: 25
```
Gördüğünüz gibi, basit işlemler için `lambda` çok daha kompakttır.

#### 2. Lambda'nın Temel Kullanım Alanları

*   **Tek Argüman:**
    ```python
    bes_ekle = lambda sayi: sayi + 5
    print(bes_ekle(10)) # Çıktı: 15
    ```

*   **Birden Fazla Argüman:**
    ```python
    carpma = lambda a, b: a * b
    print(carpma(6, 7)) # Çıktı: 42
    ```

*   **Argümansız (Nadiren Kullanılır):**
    ```python
    pi_degeri = lambda: 3.14159
    print(pi_degeri()) # Çıktı: 3.14159
    ```

#### 3. Lambda ve Fonksiyonel Araçlar (`filter`, `map`, `sorted`)

Lambda'nın asıl gücü, `filter`, `map`, `sorted` gibi yerleşik fonksiyonlarla birlikte kullanıldığında ortaya çıkar. Bu fonksiyonlar, argüman olarak başka bir fonksiyon alırlar ve `lambda` bu noktada pratik bir çözüm sunar.

*   **`filter(function, iterable)`:** Bir iterable (liste, tuple vb.) içindeki öğelerden, verilen `function`'ı uyguladığında `True` sonucunu verenleri seçer.
    ```python
    sayilar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    # Sadece çift sayıları filtrele
    ciftler = list(filter(lambda x: x % 2 == 0, sayilar))
    print(ciftler) # Çıktı: [2, 4, 6, 8, 10]
    ```
    Burada `lambda x: x % 2 == 0`, her sayı için çift olup olmadığını kontrol eden kural fonksiyonudur.

*   **`map(function, iterable)`:** Bir iterable içindeki her öğeye verilen `function`'ı uygular ve sonuçlardan yeni bir iterable oluşturur.
    ```python
    # Her sayının karesini al
    kareler = list(map(lambda x: x * x, sayilar))
    print(kareler) # Çıktı: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
    ```
    `lambda x: x * x`, her sayıya uygulanacak olan kare alma işlemidir.

*   **`sorted(iterable, key=function)`:** Bir iterable'ı sıralarken, sıralama ölçütü olarak her öğeye uygulanacak `key` fonksiyonunun sonucunu kullanır.
    ```python
    isimler = ["Ali", "Zeynep", "Can", "Ayşe", "Osman"]
    # İsimleri uzunluklarına göre (kısadan uzuna) sırala
    sirali_isimler = sorted(isimler, key=lambda isim: len(isim))
    print(sirali_isimler) # Çıktı: ['Ali', 'Can', 'Ayşe', 'Osman', 'Zeynep']
    ```
    `lambda isim: len(isim)`, her ismin uzunluğunu döndürerek sıralama anahtarını belirler.

#### 4. Lambda ve CadQuery Seçicileri

CadQuery'de `filter` ve `sort` metodları, tıpkı Python'un yerleşik fonksiyonları gibi çalışır ve `lambda` ile çok iyi anlaşır. Seçilen öğe (yüzey, kenar vb.) `lambda` fonksiyonuna argüman olarak geçer ve biz bu öğenin özelliklerine (`Center()`, `Area()`, `Length()` vb.) erişerek bir koşul veya sıralama anahtarı belirleriz.

*   **Filtreleme Örneği:** Alanı 100'den büyük yüzeyleri seçme
    ```python
    # kutu bir CadQuery nesnesi olsun
    buyuk_yuzeyler = kutu.faces().filter(lambda f: f.Area() > 100)
    # lambda f: f.Area() > 100
    #   - f: O an işlenen yüzey nesnesi
    #   - f.Area(): Yüzeyin alanını döndüren metod
    #   - > 100: Alanın 100'den büyük olup olmadığını kontrol eden koşul (True/False döner)
    ```

*   **Sıralama Örneği:** Kenarları X koordinatlarına göre sıralama
    ```python
    # kutu bir CadQuery nesnesi olsun
    sirali_kenarlar = kutu.edges().sort(key=lambda e: e.Center().x)
    # lambda e: e.Center().x
    #   - e: O an işlenen kenar nesnesi
    #   - e.Center(): Kenarın merkez noktasını döndüren metod (bir Vector nesnesi)
    #   - .x: Merkez noktasının X koordinatı (sıralama için bu değer kullanılır)
    ```

#### 5. Lambda Ne Zaman Kullanılmamalı?

*   **Karmaşık Mantık:** Eğer fonksiyonunuz birden fazla satır, `if/else` blokları (basit koşullu ifadeler `lambda x: x if x>0 else -x` dışında) veya döngüler içeriyorsa, normal `def` fonksiyonu daha okunabilirdir.
*   **Tekrarlı Kullanım:** Eğer aynı fonksiyonu kodunuzun birçok yerinde kullanacaksanız, `def` ile tanımlayıp isim vermek daha iyidir.

Özetle, `lambda` Python'da ve özellikle CadQuery gibi kütüphanelerde, kısa, anlık fonksiyon tanımları yaparak kodu daha akıcı ve kompakt hale getirmek için kullanılan güçlü bir araçtır.

---

### 🧠 Özetle: Boolean Operasyonları ve Detaylandırma


| İşlem         | Metod(lar)                     | Açıklama                                         | Tipik Kullanım Alanı                          |
|---------------|--------------------------------|--------------------------------------------------|-----------------------------------------------|
| Birleştirme| `union()`                      | İki veya daha fazla katıyı tek katı yapar.       | Parçaları birleştirmek, model büyütmek.       |
| Çıkarma   | `cut()`, `cutBlind()`, `cutThruAll()` | Bir katıdan diğerini/profili çıkarır.         | Delik açma, cep oluşturma, oyma.             |
| Kesişim  | `intersect()`                  | Sadece katıların ortak hacmini tutar.          | Ortak bölge bulma, kırpma, temas analizi.     |
| Pah Kırma | `chamfer()`                    | Kenarları düz bir açıyla kırar.                 | Teknik görünüm, vida girişi, çapak alma.      |
| Radius Atma| `fillet()`                     | Kenarları dairesel yay ile yuvarlatır.          | Estetik, ergonomi, gerilim azaltma.          |
|  Seçim    | `faces()`, `edges()`, `vertices()` (ve filtre/sort/lambda) | Modelin belirli kısımlarını seçer.          | Belirli yerlere işlem uygulama (yukarıdakiler)|


Bu bölümde öğrendiğimiz Boolean operasyonları (`union`, `cut`, `intersect`) ve detaylandırma komutları (`chamfer`, `fillet`), temel geometrilerden karmaşık ve işlevsel 3D modeller oluşturmanın anahtarıdır. Seçiciler (`faces`, `edges`) ve `lambda` fonksiyonları ise bu işlemleri hassas bir şekilde kontrol etmemizi sağlar.

---

🚀 Artık CadQuery ile sadece temel şekiller oluşturmakla kalmayıp, onları birleştirebilir, içlerini oyabilir, kesişimlerini alabilir ve kenarlarına profesyonel dokunuşlar ekleyebilirsiniz. Bu temel bilgilerle bile oldukça yetenekli parametrik modeller tasarlamaya başlayabilirsiniz!

Bir sonraki bölümde, `revolve` (döndürerek katı oluşturma), `sweep` (yol boyunca süpürerek katı oluşturma) gibi daha ileri katı modelleme tekniklerine ve belki de montaj (assembly) konularına giriş yapacağız.
