---
# Dosya Adı: src/content/blog/cad-query-klavuzu-bolum-2.md

title: 'CAD Query ile Parametrik 3D Modelleme - 🧱 Bölüm 2: CadQuery Temelleri' # Başlığı güncelleyin
description: 'CAD Query de Workplane mantığını, temel şekil oluşturmayı (kutu, silindir, küre) ve temel operasyonları (extrude, cut) öğrenin.' # Açıklamayı güncelleyin
publishDate: 2025-04-22 # Tarihi aynı tutabilir veya güncelleyebilirsiniz
tags: ['cadquery', 'python', '3d modelleme', 'parametrik tasarım', 'cadquery temelleri', 'workplane', 'box', 'cylinder', 'sphere', 'union', 'translate', 'sketch', 'extrude', 'cut', 'intersect', 'chamfer', 'fillet', 'seçiciler', 'lambda fonksiyonları', 'akıcı api']
image:
  src: '/images/cadquery-python-3d-modeling-kapak.png'
  alt: 'CAD Query ve Python ile parametrik 3D modelleme konseptini gösteren kapak görseli'
isDraft: false

# --- Seri Bilgileri ---
part: 2                  # Bu, serinin 2. bölümü
totalPages: 8            # Toplam bölüm sayısı (Tüm bölümlerde aynı olmalı)
seriesSlug: 'cad-query-klavuzu'
prevPageSlug: 'cad-query-klavuzu-bolum-1' # <<< DÜZELTİLDİ: Önceki bölümün slug'ı
nextPageSlug: 'cad-query-klavuzu-bolum-3' # <<< Eğer 3. bölüm olacaksa bu slug'ı kullanın, yoksa null yapın
# --- Seri Bilgileri Sonu ---
---

# 🧱 Bölüm 2: CadQuery Temelleri

Bu bölümde CadQuery’nin temel yapı taşlarını öğreneceğiz. Modelleme sürecinin mantığını kavrayarak, akıcı bir şekilde 3D tasarım üretmeyi hedefleyeceğiz. Hazırsan başlayalım!

---

## 🧱 CadQuery'nin Temel Taşları

CadQuery ile sağlam bir model inşa etmek istiyorsan, önce temelin sağlam olmalı. Bu temel de **Workplane mantığı** ve **koordinat sistemleri** üzerine kurulu. Bu bölümü, bir binanın zemin katını döşer gibi düşün — her şey bunun üstüne inşa edilecek.

---

### ◦ Workplane Nedir? | Çalışma Düzlemiyle Tanış

CadQuery’de tüm çizimlerin ve 3D işlemlerin başladığı yer **Workplane**’dir. Bunu, geometriyi çizeceğimiz bir masa gibi düşünebilirsin.

🛠️ Örnek:
```python
import cadquery as cq

model = cq.Workplane("XY").box(10, 10, 10)
```

Burada "XY" düzlemi, masa gibi düz bir yüzey. Bu yüzeye kutunun tabanını çiziyoruz ve Z yönüne doğru yukarıya bir kutu çıkıyor.

### ◦ Koordinat Sistemi | Hangi Yön Nereye Gidiyor?
CadQuery, klasik bir XYZ koordinat sistemi kullanır:

X ekseni: sağa–sola

Y ekseni: ileri–geri

Z ekseni: yukarı–aşağı

```txt
         Z
         ↑
         |
         |
         •———→ X
        /
       /
     Y
```

Düzlemler bu eksenlere göre adlandırılır:

* XY → yere paralel (en çok kullanılan)

* YZ → sağdan görünüm

* XZ → önden görünüm

### ◦ Workplane’leri Akıllıca Kullan
Her modellemede düzlemlerle oynamak gerekebilir. Mesela bir nesnenin üstüne bir şey çizeceksen:

```python
# Gerekli kütüphaneleri içe aktarma
import cadquery as cq  # CadQuery ana kütüphanesini 'cq' takma adıyla içe aktar
from cadquery import exporters # CadQuery'nin dışa aktarma ('export') fonksiyonlarını içeren modülünü içe aktar

# 3D Modeli oluşturma süreci
model = (
    cq.Workplane("XY")  # Başlangıç olarak XY düzlemini (Z=0) seçerek bir çalışma düzlemi oluştur
    .box(20, 20, 10)    # Bu düzlemin merkezine (0,0,0) 20x20x10 boyutlarında bir kutu çiz
                      # Kutu X ve Y'de -10'dan +10'a, Z'de -5'ten +5'e uzanır
    .faces(">Z")        # Kutunun Z ekseni yönünde en dışta kalan yüzeyini seç (yani üst yüzeyi, Z=5 düzlemi)
    .workplane()        # Seçilen yüzeyin merkezini yeni bir çalışma düzleminin orijini olarak ayarla (merkezi 0,0,5 olur)
    .circle(5)          # Bu yeni çalışma düzlemine (üst yüzeye) 5 birim yarıçapında bir daire çiz
    .cutThruAll()       # Çizilen daire profilini kullanarak, katı modelin tamamı boyunca (her iki yönde) keserek bir delik oluştur
)

# Modeli dışa aktarma
# GLB olarak dışa aktarma hedefi belirtilmiş ancak kod STEP olarak dışa aktarıyor.
# Doğrudan GLB export için ek kütüphaneler gerekebilir veya STEP sonrası dönüştürme yapılabilir.
exporters.export(model, 'box.step') # Oluşturulan 'model' değişkenindeki 3D geometriyi 'box.step' adlı dosyaya STEP formatında kaydet

# Modeli görselleştirme (Eğer destekleyen bir ortamda çalıştırılıyorsa, örn: CQ-editor)
show_object(model) # Oluşturulan 'model' nesnesini ekranda gösterir.
                   # Bu komut standart Python yorumlayıcısında çalışmaz, CQ-editor veya jupyter-cadquery gibi bir arayüz gerektirir.
)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Oluşturduğumuz 3B model nesnesi</h1>

  <model-viewer
    src="/models/workplane-1.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

🔍 faces(">Z"): Z yönüne bakan yüzeyi seç

🧩 .workplane(): bu yüzeyden yeni bir düzlem başlat

🛠️ .circle(5).cutThruAll(): daire aç ve tüm yüzeyi del

⛏ Bu örneğimizde önce bir kutu oluşturduk sonra bu kutunun en üstünü yeni bir çalışma düzlemi (workplane) olarak tanımladık. Ardından bu tanımladığımız yüzeye `circle(5)` komutu ile 5 birim yarıçağında bir daire çizip, `cutThruAll()` komutu ile bir delik açtık. 

🧠 Şimdi bir başka örnek yapalım. Bu örneğimizde yine bir kutumuz olsun. Bu kutunun üstünü yeni bir çalışma düzlemi (workplane) olarak tanımlayarak üzerine bir daire yerleştirelim ve bu daireyi yukarı doğru uzatarak silindirik bir şekil oluşturalım. 

```python
# Gerekli kütüphaneleri içe aktarma
import cadquery as cq  # CadQuery ana kütüphanesini 'cq' takma adıyla içe aktar
from cadquery import exporters # CadQuery'nin dışa aktarma ('export') fonksiyonlarını içeren modülünü içe aktar

# 3D Modeli oluşturma süreci
# Ana gövde: bir kutu (taban parça) oluşturma
base = (
    cq.Workplane("XY")  # Başlangıç olarak XY düzlemini (Z=0) seçerek bir çalışma düzlemi oluştur
    .box(40, 40, 10)    # Bu düzlemin merkezine (0,0,0) 40x40x10 boyutlarında bir kutu (taban) çiz
                        # Kutu X ve Y'de -20'den +20'ye, Z'de -5'ten +5'e uzanır
)

# Üst yüzeyde yeni bir çalışma düzlemi tanımlama
# ve bu düzleme bir silindir yerleştirerek modeli geliştirme
model = (
    base                 # Daha önce oluşturulan 'base' (kutu) nesnesinden işleme başla
    .faces(">Z")         # 'base' kutusunun Z ekseni yönünde en dışta kalan yüzeyini seç (üst yüzeyi, Z=5 düzlemi)
    .workplane()         # Seçilen yüzeyin merkezini yeni bir çalışma düzleminin orijini olarak ayarla (merkezi 0,0,5 olur)
    .circle(10)          # Bu yeni çalışma düzlemine (kutunun üst yüzeyine) 10 birim yarıçapında bir daire çiz
    .extrude(20)         # Çizilen daire profilini, çalışma düzleminin normali yönünde (pozitif Z yönünde) 20 birim kadar uzatarak katı bir silindir oluştur ve bunu 'base' ile birleştir (katı ekleme)
)

# Modeli dışa aktarma
# GLB olarak dışa aktarma hedefi belirtilmiş ancak kod STEP olarak dışa aktarıyor.
# Doğrudan GLB export için ek kütüphaneler gerekebilir veya STEP sonrası dönüştürme yapılabilir.
exporters.export(model, 'box.step') # Oluşturulan 'model' değişkenindeki 3D geometriyi 'box.step' adlı dosyaya STEP formatında kaydet

# Modeli görselleştirme (Eğer destekleyen bir ortamda çalıştırılıyorsa, örn: CQ-editor)
show_object(model) # Oluşturulan 'model' nesnesini ekranda gösterir.
                   # Bu komut standart Python yorumlayıcısında çalışmaz, CQ-editor veya jupyter-cadquery gibi bir arayüz gerektirir.
)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/workplane-2.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

✨ Yeni bir örnek yaparak çalışma düzlemi mantığını iyice pekiştirelim. Üstte görünen kutu üzerindeki silindirin en üst noktasını yeni bir çalışma düzlemi olarak belirtip bunun üzerine 5 birim yarıçapında bir daire tanımlayarak delik açalım. Kod şu şekilde olacak: 

```python
# Gerekli kütüphaneleri içe aktarma
import cadquery as cq  # CadQuery ana kütüphanesini 'cq' takma adıyla içe aktar
from cadquery import exporters # CadQuery'nin dışa aktarma ('export') fonksiyonlarını içeren modülünü içe aktar

# 3D Modeli oluşturma süreci
# Ana gövde: bir kutu (taban parça) oluşturma
base = (
    cq.Workplane("XY")  # Başlangıç olarak XY düzlemini (Z=0) seçerek bir çalışma düzlemi oluştur
    .box(40, 40, 10)    # Bu düzlemin merkezine (0,0,0) 40x40x10 boyutlarında bir kutu (taban) çiz
                        # Kutu X ve Y'de -20'den +20'ye, Z'de -5'ten +5'e uzanır
)

# Üst yüzeyde yeni bir çalışma düzlemi tanımlama
# ve bu düzleme bir silindir yerleştirerek modeli geliştirme
model = (
    base                 # Daha önce oluşturulan 'base' (kutu) nesnesinden işleme başla
    .faces(">Z")         # 'base' kutusunun Z ekseni yönünde en dışta kalan yüzeyini seç (üst yüzeyi, Z=5 düzlemi)
    .workplane()         # Seçilen yüzeyin merkezini yeni bir çalışma düzleminin orijini olarak ayarla (merkezi 0,0,5 olur)
    .circle(10)          # Bu yeni çalışma düzlemine (kutunun üst yüzeyine) 10 birim yarıçapında bir daire çiz
    .extrude(20)         # Çizilen daire profilini, çalışma düzleminin normali yönünde (pozitif Z yönünde) 20 birim kadar uzatarak katı bir silindir oluştur ve bunu 'base' ile birleştir (katı ekleme)
    # Şimdi oluşan birleşik şekil (kutu + silindir) üzerinde devam ediyoruz:
    .faces(">Z")         # Mevcut şeklin (artık silindirin üstü) Z ekseni yönündeki en üst yüzeyini seç
    .workplane()         # Seçilen bu silindir üst yüzeyinin merkezini yeni bir çalışma düzlemi olarak tanımla
    .circle(5)           # Bu yeni çalışma düzlemine (silindirin üstüne) 5 birim yarıçapında bir daire çiz
    .cutThruAll()        # Çizilen bu 5 yarıçaplı daireyi kullanarak, modelin tamamı boyunca (hem silindir hem de alttaki kutu içinden geçecek şekilde) bir kesme işlemi uygula (delik aç)
)

# Modeli dışa aktarma
# GLB olarak dışa aktarma hedefi belirtilmiş ancak kod STEP olarak dışa aktarıyor.
# Doğrudan GLB export için ek kütüphaneler gerekebilir veya STEP sonrası dönüştürme yapılabilir.
exporters.export(model, 'box.step') # Oluşturulan 'model' değişkenindeki 3D geometriyi 'box.step' adlı dosyaya STEP formatında kaydet

# Modeli görselleştirme (Eğer destekleyen bir ortamda çalıştırılıyorsa, örn: CQ-editor)
show_object(model) # Oluşturulan 'model' nesnesini ekranda gösterir.
                   # Bu komut standart Python yorumlayıcısında çalışmaz, CQ-editor veya jupyter-cadquery gibi bir arayüz gerektirir.
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/workplane-3.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

✅ Bu örnekle çalışma düzlemi tanımlamayı iyice pekiştirdik. 

### ◦ Neden Bu Kadar Önemli?
* Geometriyi nereye çizeceğini bilmezsen, karmaşık modellerde kaybolursun.

* Workplane’ler sayesinde katmanlı ve düzenli tasarımlar oluşturursun.

* Aynı parçanın simetrik veya tekrarlayan kısımlarını kolayca üretirsin.

* Karmaşık projelerde hata ayıklamak çok daha kolay olur.

📌 Özetle:
CadQuery'de her şey bir düzlemle başlar. Bu düzlemi doğru seçmek, projenin temelini sağlam atmak demektir. Artık bu temeli öğrendiğimize göre, bir üst kata çıkmaya hazırız. 🚀

---

## ◦ Akıcı API Kullanımı: Zincirleme Metodlar

CadQuery’nin en sevilen özelliklerinden biri, **akıcı (chained)** yazım tarzı. Bu tarz, hem okunabilirliği artırıyor hem de modelin nasıl oluştuğunu adım adım görmemizi sağlıyor.

🧠 **Akıcı API ne demek?**  
Kodun her satırı bir işlem yapar, sonucu bir sonraki adıma aktarır. Böylece uzun ve karmaşık işlemler bile mantıklı bir sıraya oturtulmuş olur.

---

### 🛠️ Örnek 1: Basitten Karmaşığa

```python
import cadquery as cq

model = (
    cq.Workplane("XY")      # 1. Düzlem seç
    .box(20, 20, 5)          # 2. Bir kutu oluştur
    .faces(">Z")             # 3. Üst yüzeyi seç
    .workplane()             # 4. Yeni bir düzlem başlat
    .circle(5)               # 5. Bu düzleme bir daire çiz
    .cutThruAll()            # 6. Aşağıya doğru delik aç
)
```

🧩 Bu kod, bir kutunun tam ortasına yukarıdan aşağıya delik açar.
Her satır bir işlemi tanımlar, bir öncekinin çıktısı üzerine eklenir. Çalışma düzlemini anlamak için yaptığımız örnekleri de bu şekilde satır satır yazmıştık. 

---

### 🧠 Neden Zincirleme Kullanım Önemlidir?
* **Kod mantığını korur**: Her adım bir üstüne kurulur.

* **Okunabilirliği artırır**: Nereden nereye gidildiği bellidir.

* **Hataları azaltır**: Adımları ayırmak ve test etmek kolaydır.

* **Parametrik düşünmeyi kolaylaştırır**: Değerleri değiştirdiğinde neyin nasıl etkilendiğini net görürsün.

---

### 🎯 İpucu: Her şey bir nesne döndürür
CadQuery’nin metodları, sonuçta bir Workplane veya Shape nesnesi döndürür. Bu yüzden bir sonraki metod hemen onun üzerinde çalışabilir. Buna yazılımda "**fluent interface**" denir.

🚀 Hadi bir örnek yapalım. Zincirleme mantığını göz önünde bulundurarak devam edelim. 

```python
# Gerekli kütüphaneler
import cadquery as cq
from cadquery import exporters

# Model oluşturma zinciri
model = (
    cq.Workplane("XY")    # XY düzleminde çalışmaya başla
    .rect(30, 10)         # 30x10 boyutunda bir dikdörtgen çiz
    .extrude(10)          # Dikdörtgeni Z yönünde 10 birim uzatarak katı oluştur
    .edges("|Z")          # Z eksenine paralel olan dikey kenarları seç
    .fillet(2)            # Seçilen kenarları 2 birim yarıçapla yuvarlat (pah kır)
)

# Dışa Aktarma
exporters.export(model, 'box.step') # Oluşturulan modeli STEP formatında kaydet

# Görselleştirme (CQ-editor gibi bir ortamda)
show_object(model) # Modeli ekranda göster
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/workplane-4.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

---

## ◦ Stack Mantığı: İşlem Sıraları

CadQuery’de her işlem sadece bir şey çizmekle kalmaz; aynı zamanda **geçici bir konum (state)** da üretir. Bu konumlar, tıpkı bir "yığın" (stack) gibi hafızada saklanır ve sırasıyla işlenir.

🧠 **Stack nedir?**  
Stack (yığın), son giren ilk çıkar (LIFO – Last In First Out) mantığıyla çalışan bir yapıdır. CadQuery'de bu, işlem sırasında oluşan konum ve yüzeylerin nasıl hatırlandığını temsil eder.

---

### 🛠️ Örnek: Bir Şey Yaptık, Sonra Yüzeyini Seçtik

```python
import cadquery as cq

model = (
    cq.Workplane("XY")     # Düzlem tanımlandı → stack'e eklendi
    .box(30, 30, 10)       # Kutu oluşturuldu → yeni nesne stack'e eklendi
    .faces(">Z")           # Üst yüzey seçildi → stack güncellendi
    .workplane()           # Yeni çalışma düzlemi eklendi
    .circle(5)
    .cutThruAll()
)
```

📚 Stack şu sırayla işler:

1. XY düzlemi

2. 30x30x10 kutu

3. Kutunun üst yüzeyi

4. Yeni workplane

5. Daire çizimi

6. Delik işlemi

Her adım, bir sonraki adımın ne üzerinde çalışacağını belirler.

--- 

### 🧩 Stack Mantığı Neyi Sağlar?

* Model üzerinde kontrollü adımlar atarsın.

* Hangi yüzeyde çalıştığını kaybetmezsin.

* Karmaşık modellerde nerede olduğunu unutmadan işlem yaparsın.

* Zincirleme metodlarla bu mantık şeffaf şekilde işler.

---

### 🎯 Stack'i Bozmazsan Her Şey Yolunda

Ama diyelim ki bir işlem yapıp yüzeyi yanlış seçtin veya sıralamayı karıştırdın...
İşte o zaman model istediğin gibi oluşmaz.
Stack mantığı, CadQuery'nin yaptığı her işlemi sırayla takip ettiği için,
önce ne yapacağın, sonra ne seçeceğin çok önemlidir.

---

🔍 Örnek: Hatalı Sıralama

```python
model = (
    cq.Workplane("XY")
    .faces(">Z")       # Hata! Daha kutu çizmedik ki üst yüzey seçelim...
    .box(20, 20, 5)
)
```

⛔ Bu kod hata verir. Çünkü önce bir şey çizmeden faces() ile yüzey seçmeye çalıştık.
Stack’te o yüzey henüz yok!

---

🧠 Özetle:
CadQuery bir şekil çizerken her adımı bir yığına ekler.
Sen de bu yığını doğru kullanırsan, karmaşık 3D modelleri bile adım adım, kontrollü bir şekilde inşa edebilirsin.
Karmaşık geometrilerin sırrı aslında sıralamada gizli.

---

## 🧱 Temel Geometriler ve Örneklerle Modelleme

Artık düzlemleri biliyoruz, zincirleme işlemleri öğrendik, stack mantığını da çözdük. Şimdi sıra geldi CadQuery’deki temel geometrileri kullanarak **ilk gerçek 3D modellerimizi** oluşturmaya!

CadQuery, bazı **hazır şekilleri** (primitive shapes) doğrudan oluşturmanı sağlar. Bunlar genelde kutu (box), silindir (cylinder), küre (sphere) gibi basit ama çok işlevsel geometrilerdir.

---

### ◦ 📦 Box (Kutu)

```python
# Gerekli kütüphaneler
import cadquery as cq
from cadquery import exporters # Dışa aktarma fonksiyonları için

# Basit bir kutu oluştur
box = cq.Workplane("XY").box(25, 30, 15) # XY düzleminde 25x30x15 boyutlarında kutu

# Dışa Aktarma
exporters.export(box, 'box.step') # 'box' nesnesini STEP dosyası olarak kaydet

# Görselleştirme (CQ-editor gibi bir ortamda)
show_object(box) # Oluşturulan kutuyu ekranda göster
```

Bu kod, 25x30 mm tabanlı ve 15 mm yüksekliğinde bir kutu oluşturur.

* İlk iki parametre: x ve y yönündeki uzunluk

* Son parametre: z yönündeki yükseklik

📸 Kutu yukarıya doğru yükselir (Z ekseni boyunca).

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/workplane-5.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>


---

### ◦ 🥫 Cylinder (Silindir)

```python
# Gerekli kütüphaneler
import cadquery as cq
from cadquery import exporters # Dışa aktarma fonksiyonları için

# Bir silindir oluştur
cylinder = cq.Workplane("XY").cylinder(44.5, 5.25) # XY düzleminde 44.5 birim yükseklik ve 5.25 birim yarıçaplı silindir

# Dışa Aktarma
exporters.export(cylinder, 'silindir.step') # 'cylinder' nesnesini STEP dosyası olarak kaydet

# Görselleştirme (CQ-editor gibi bir ortamda)
show_object(cylinder) # Oluşturulan silindiri ekranda göster
```

* 44.5: Yükseklik

* 5.25: Yarıçap

Daire tabanlı bir silindirdir. Bu AAA pil ölçüleridir!

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/workplane-6.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### ◦ 🌐 Sphere (Küre)

```python
# Gerekli kütüphaneler
import cadquery as cq
from cadquery import exporters # Dışa aktarma fonksiyonları için

# Bir küre oluştur
sphere = cq.Workplane("XY").sphere(15) # XY düzleminde merkezi orijin olan 15 birim yarıçaplı küre


# Dışa Aktarma
exporters.export(sphere, 'sphere.step') # 'sphere' nesnesini STEP dosyası olarak kaydet (Önceki 'box.step' ve 'box' kullanımı düzeltildi)

# Görselleştirme (CQ-editor gibi bir ortamda)
show_object(sphere) # Oluşturulan küreyi ekranda göster (Önceki 'box' kullanımı düzeltildi)
```

Yarıçapı 20 mm olan bir küre. Koordinat sisteminin ortasında, tüm yönlere eşit olarak genişler.

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/workplane-7.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### 🔁 Hepsini Aynı Anda Oluşturalım

Hepsini aynı anda oluşturmadan önce `union` komutunu öğrenelim. 🚀

#### union Komutu (Birleştirme): ✨

`union` komutu, CadQuery'de (ve genel olarak 3D modellemede) **iki veya daha fazla katı (solid) nesneyi alıp, onları tek bir katı nesne halinde birleştirmek** için kullanılan temel bir **Boolean** işlemidir.

#### Ne Yapar? 🤔
* İki ayrı geometriniz olduğunu düşünün (mesela bir küp ve bir silindir).
* Bu geometriler birbirine değiyor veya iç içe geçiyor olabilir.
* `union` komutunu kullandığınızda, CadQuery bu iki ayrı parçayı alır ve aralarındaki sınırları kaldırarak tek, yekpare bir bütün oluşturur.
* İki ayrı oyun hamurunu birbirine bastırıp tek bir şekil elde etmek gibi düşünebilirsiniz. İç içe geçen kısımlar tamamen kaynaşır.

#### Neden Kullanılır? 🛠️

* Karmaşık Şekiller Oluşturma: Basit geometrileri (kutu, silindir, küre vb.) birleştirerek daha karmaşık ve organik formlar yaratmanızı sağlar.
* Tek Parça Model: Özellikle 3D yazdırma veya mühendislik analizleri (FEA) için modelinizin ayrı parçalardan değil, **tek bir manifold (su geçirmez) katıdan** oluşması genellikle istenir veya gereklidir. union bunu sağlar.

✨ Şimdi birleştime işlemine geçip yukarıda oluşturduğumuz kutuyu, silindiri ve küreyi aynı anda oluşturan kodu yazalım: 

```python
# CadQuery'yi içe aktar
import cadquery as cq
# Dışa aktarma modülünü içe aktar
from cadquery import exporters


# 'assembly' (montaj) nesnesini tanımla
assembly = (
    cq.Workplane("XY")          # XY düzleminde başla
    .box(25, 30, 15)            # 25x30x15 kutu oluştur
    .union(                     # Şununla birleştir:
        cq.Workplane("XY")      #   Yeni XY düzlemi
        .cylinder(44.5, 5.25)   #   Silindir oluştur (Yükseklik=44.5, Yarıçap=5.25)
    )
    .union(                     # Şununla birleştir:
        cq.Workplane("XY")      #   Yeni XY düzlemi
        .sphere(15)             #   Küre oluştur (Yarıçap=15)
    )
)

# Montajı 'box.step' olarak STEP formatında dışa aktar
exporters.export(assembly, 'box.step')

# Montajı görüntüleyicide göster (varsa)
show_object(assembly)
)
```


<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/workplane-8.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte:
* Bir kutu (box), bir silindir (cylinder) ve bir küre (sphere) oluşturulur.

* Dikkat: Bu şekillerin hepsi, `translate` (taşıma) komutu kullanılmadığı için, aynı merkez noktası (orijin 0,0,0) referans alınarak oluşturulur.

* `union` komutu ile bu üç şekil, birbiriyle kaynaştırılarak tek bir katı nesneye dönüştürülür.

* Yani sonuç, parçaların üst üste konduğu bir totem gibi değil, merkezde iç içe geçmiş ve birleştirilmiş bu üç geometrinin oluşturduğu tek, yekpare bir şekildir.

Peki şekilleri iç içe yapmayıp üst üst koymak isteseydik nasıl yapabilirdik?
* Önce kutuyu yapardık,
* Sonra silindiri yapıp kutunun üstüne koyardık,
* En son küreyi oluşturup silindirin üzerine koyardık değil mi? Yani her bir cismi öteleyerek diğerinin üzerine getirirdik!

İşte bunları yapmak için kullanmamız gereken komut `translate` komutudur. Önce komutu öğrenelim sonra cisimlerimizi üst üste dizelim. 🚀

---

#### `translate` Komutu (Taşıma/Öteleme): ➡️↔️↕️

CadQuery'de translate komutu, mevcut geometriyi (veya geometrileri) uzayda belirli bir vektör kadar kaydırmak/taşımak için kullanılır.

##### Ne Yapar? 🤔

* Oluşturduğunuz bir şekli (veya çalışma düzleminin tamamını o anki haliyle) X, Y ve Z eksenleri boyunca belirttiğiniz mesafeler kadar hareket ettirir.
* Sanki elinizdeki bir nesneyi alıp başka bir yere koymak gibidir. Yönünü veya boyutunu değiştirmez, sadece konumunu değiştirir.

##### Neden Kullanılır? 🛠️

* Nesneleri Konumlandırma: Şekilleri istediğiniz koordinatlara veya başka bir şekle göre hizalamak için temel yöntemdir.
* Montaj Oluşturma: Farklı parçaları doğru yerlerine yerleştirmek için kritik öneme sahiptir.
* Tekrarlayan Desenler: Bir nesneyi kopyalayıp farklı konumlara taşımak için kullanılabilir (genellikle copyWorkplane gibi diğer komutlarla birlikte).

##### CadQuery'de Nasıl Kullanılır?

Genellikle bir şekil oluşturduktan sonra zincirleme (chaining) yöntemiyle kullanılır:

```python

# Önce bir kutu oluştur
result = cq.Workplane("XY").box(10, 10, 10)

# Şimdi bu kutuyu Z ekseninde 20 birim yukarı taşı
result = result.translate((0, 0, 20)) # X=0, Y=0, Z=20 birim taşı

# Veya zincir içinde:
result = cq.Workplane("XY").box(10, 10, 10).translate((0, 0, 20))
```

* translate metodu, bir tuple veya Vector nesnesi olarak (X_mesafesi, Y_mesafesi, Z_mesafesi) şeklinde bir taşıma vektörü alır.

##### Şimdi Totem Zamanı! 🗿

Yukarıda oluşturduğumuz şekilleri üst üste koyarak totem yapalım. 😇

🍄 Bu örneğimizde sadece `translate` komutu kullanarak cisimleri üst üste koymayalım. Ayrıca cisimleri oluştururken kullandığımız boyutları değişken olarak belirtip kodumuzu parametrik hale getirmeye başlayalım. 🚀

```python
import cadquery as cq
from cadquery import exporters

# --- Boyutları Tanımlayalım ---
kutu_x = 25
kutu_y = 30
kutu_z = 15

silindir_yukseklik = 44.5
silindir_yaricap = 5.25 

kure_yaricap = 15   

# --- 1. Taban Kutusu ---
# Kutu XY düzleminde, merkezi orijinde (0,0,0) oluşturulur.
# Kutunun üst yüzeyi Z = kutu_z / 2 = 15 / 2 = 7.5 konumunda olacak.
taban_kutusu = cq.Workplane("XY").box(kutu_x, kutu_y, kutu_z)

# --- 2. Silindir ---
# Silindiri önce orijinde oluşturup sonra taşıyacağız.
# Silindirin tabanının kutunun üstüne (Z=7.5) oturması lazım.
# Silindirin kendi yüksekliği 44.5, merkezi Z=0'da iken tabanı Z = -44.5/2 = -22.25'tadır.
# Hedef taban Z = 7.5 olması için, silindiri Z yönünde 7.5 - (-22.25) = 29.75 birim taşımalıyız.
# Veya: Silindirin merkezinin Z = 7.5 (kutu üstü) + 44.5/2 (silindir yarı yüksekliği) = 29.75'te olması gerekir.
orta_silindir = (
    cq.Workplane("XY")
    .cylinder(silindir_yukseklik, silindir_yaricap) # Önce orijin merkezli oluştur
    .translate((0, 0, kutu_z / 2 + silindir_yukseklik / 2)) # Hesaplanan Z konumuna taşı
)

# --- 3. Küre ---
# Küreyi de önce orijinde oluşturup sonra taşıyacağız.
# Kürenin tabanının silindirin üstüne oturması lazım.
# Silindirin üst yüzeyi Z = 29.75 (merkezi) + 44.5/2 (yarı yükseklik) = 52 konumunda.
# Kürenin merkezi Z = 52 (silindir üstü) + 15 (küre yarıçapı) = 67'de olmalı.
ust_kure = (
    cq.Workplane("XY")
    .sphere(kure_yaricap) # Önce orijin merkezli oluştur
    .translate((0, 0, kutu_z / 2 + silindir_yukseklik + kure_yaricap)) # Hesaplanan Z konumuna taşı
)


# --- 4. Parçaları Birleştir (Union) ---
# Ayrı ayrı oluşturduğumuz ve taşıdığımız parçaları tek bir katı nesne yapmak için birleştiriyoruz.
totem = taban_kutusu.union(orta_silindir).union(ust_kure)

# --- Göster ve Dışa Aktar ---
# Oluşturulan totemi görüntüleyicide göster
show_object(totem)

# İsteğe bağlı: STEP olarak dışa aktar
# exporters.export(totem, 'totem.step')
```

**Bu kodda ne oluyor?**

1. **Kutu**: Normal şekilde XY düzleminde, merkezi orijinde oluşturulur.
2. **Silindir**: Önce merkezi orijinde oluşturulur, sonra translate ile Z ekseninde yukarı taşınarak merkezi, kutunun üst yüzeyi ile kendi yarı yüksekliğinin toplamı kadar yukarıda olacak şekilde konumlandırılır. Böylece tabanı kutunun üstüne denk gelir.
3. **Küre**: Benzer şekilde, önce merkezi orijinde oluşturulur, sonra translate ile Z ekseninde yukarı taşınarak merkezi, silindirin üst yüzeyi ile kendi yarıçapının toplamı kadar yukarıda olacak şekilde konumlandırılır. Böylece alt noktası silindirin üstüne denk gelir.
4. **Union**: Son olarak, konumlandırılmış bu üç ayrı parça union ile tek bir katı "totem" nesnesi haline getirilir.

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/workplane-9.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>


### 🧠 Neden Bu Temeller Önemli?

* Bu geometriler, karmaşık modellerin yapı taşlarıdır.

* Parçaların çoğu, bu şekillerin kesilmesi, birleştirilmesi veya içinin boşaltılmasıyla oluşur.

* Her şekli anlamak, ileride boolean işlemlerde (union, cut, intersect) çok işine yarar.

---

### 🧪 Şimdi Kendin Deneyebilirsin:

* Farklı boyutlarda kutular oluştur.

* Silindirin yönünü değiştir (örneğin YZ düzleminde oluştur).

* Sphere’i bir şeklin içine yerleştirip cut() ile boşluk aç.

---

### 📌 Bu bölümde öğrendiklerimiz:

* box(), cylinder(), sphere() kullanımı

* Parametrelerle şekilleri özelleştirme

* Birden fazla şekli bir araya getirme

Sırada ne var? Tabii ki bu 2D şekilleri 3D'ye nasıl çıkaracağımız.

Bir sonraki adımda Sketch ve Extrude işlemleriyle geometriyi boyutlandıracağız. 🚀

----



## 📐 2D’den 3D’ye: Sketch ve Extrude İşlemleri

Birçok 3D model, aslında düz bir çizimin (sketch) **yukarı doğru kaldırılması** ile oluşur.

CadQuery'de, `extrude`, `revolve`, `sweep` gibi temel 3D oluşturma komutlarının çoğu, başlangıç noktası olarak bir veya daha fazla kapalı 2D şekil (tel veya yüzey) bekler. Bu nedenle, hassas ve doğru 2D çizimler yapabilmek, istediğiniz 3D modeli elde etmenin anahtarıdır.

CadQuery’de bu süreci genellikle iki adımda gerçekleştiririz:

1. Bir düzlem üzerinde 2D bir şekil çizmek  
2. Bu şekli `extrude()` komutuyla 3D'ye çıkarmak

Haydi başlayalım!

---

### 1. Basit Kapalı Şekiller: Dikdörtgen, Daire, Poligon

En temel yapı taşlarımızla başlayalım. Bu komutlar genellikle doğrudan `extrude` için hazır, kapalı "teller" (wires) oluşturur.

*   **Dikdörtgen (`rect`)**: Belirtilen genişlik ve yükseklikte bir dikdörtgen çizer. Varsayılan olarak merkeze hizalıdır.
    ```python
    import cadquery as cq # CadQuery kütüphanesini içe aktar
    from cadquery import exporters # Dışa aktarma için gerekli modül

    # XY düzleminde 50x30'luk bir dikdörtgen eskizi oluştur
    eskiz_dikdortgen = cq.Workplane("XY").rect(50, 30)

    # Eskizi göster (opsiyonel, 2D tel görünüm)
    # show_object(eskiz_dikdortgen)

    # Dikdörtgen eskizini 10 birim kalınlaştırarak 3D prizma yap
    model_dikdortgen = eskiz_dikdortgen.extrude(10)

    # Modeli 'box.step' dosyasına aktar
    exporters.export(model_dikdortgen, 'box.step')

    # 3D modeli "Dikdörtgen Prizma" adıyla göster
    show_object(model_dikdortgen, name="Dikdörtgen Prizma")
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/2B_den_3B_ye_dikdortgen.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

*   **Daire (`circle`)**: Belirtilen yarıçapta bir daire çizer.
    ```python
    import cadquery as cq # CadQuery kütüphanesini içe aktar
    from cadquery import exporters # Dışa aktarma için gerekli modül

    # XY düzleminde 20 yarıçaplı daire eskizi oluştur
    eskiz_daire = cq.Workplane("XY").circle(20)

    # Daire eskizini 15 birim kalınlaştırarak 3D silindir yap
    model_silindir = eskiz_daire.extrude(15)

    # Modeli 'box.step' dosyasına aktar
    exporters.export(model_silindir, 'box.step')

    # 3D modeli "Silindir" adıyla göster
    show_object(model_silindir, name="Silindir")
    ```
    
<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/2B_den_3B_ye_silindir.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

*   **Çokgen (`polygon`)**: Düzgün bir çokgen (eşkenar üçgen, kare, beşgen vb.) çizer. Kenar sayısı ve çapı (köşeden köşeye uzaklık) belirtilir.
    ```python
    import cadquery as cq # CadQuery kütüphanesini içe aktar
    from cadquery import exporters # Dışa aktarma için gerekli modül

    # XY düzleminde 6 kenarlı, 40 çapında altıgen eskiz oluştur
    eskiz_altigen = cq.Workplane("XY").polygon(nSides=6, diameter=40)

    # Altıgen eskizi 12 birim kalınlaştırarak 3D prizma yap
    model_altigen_prizma = eskiz_altigen.extrude(12)

    # Modeli 'box.step' dosyasına aktar
    exporters.export(model_altigen_prizma, 'box.step')

    # 3D modeli "Altıgen Prizma" adıyla göster
    show_object(model_altigen_prizma, name="Altıgen Prizma")
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/2B_den_3B_ye_cokgen.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

----

### 2. Çizgiler ve Eğriler Oluşturma (`lineTo`, `threePointArc`, `tangentArcPoint`)

Bazen standart şekiller yeterli olmaz ve kendi özel yollarımızı çizmemiz gerekir. Burada "kalemi" hareket ettirerek çizim yaparız.

*   **`moveTo()` ve `lineTo()`**: Kalemi belirli bir noktaya taşır (`moveTo`) ve oradan başka bir noktaya düz bir çizgi çizer (`lineTo`). Kapalı bir şekil oluşturmak için genellikle başladığınız noktaya dönmeniz veya `close()` komutunu kullanmanız gerekir.
    ```python
    import cadquery as cq # CadQuery kütüphanesini içe aktar
    from cadquery import exporters # Dışa aktarma için gerekli modül

    # XY düzleminde "L" şeklinde bir 2D eskiz oluşturalım
    # Komutları zincirleyerek adım adım şekli çiziyoruz
    eskiz_l_sekli = (
        cq.Workplane("XY")      # XY düzleminde çalışmaya başla
        .moveTo(0, 0)           # Kalemi (0,0) noktasına taşı (başlangıç)
        .lineTo(30, 0)          # Sağa doğru 30 birim çizgi çiz (X=30, Y=0)
        .lineTo(30, 10)         # Yukarı doğru 10 birim çizgi çiz (X=30, Y=10)
        .lineTo(10, 10)         # Sola doğru 20 birim çizgi çiz (X=10, Y=10) ('L'nin iç köşesi)
        .lineTo(10, 30)         # Yukarı doğru 20 birim çizgi çiz (X=10, Y=30)
        .lineTo(0, 30)          # Sola doğru 10 birim çizgi çiz (X=0, Y=30)
        .close()                # Başlangıç noktasına (0,0) dönerek şekli otomatik kapat
    )
    # Yukarıdaki komut zinciri, kapalı bir "L" harfi formunda 2D tel oluşturdu.

    # Oluşturulan 2D "L" eskizini Z ekseninde 8 birim kalınlaştırarak 3D prizmaya dönüştür
    model_l_prizma = eskiz_l_sekli.extrude(8) # Kalınlığı 8 yapalım

    # Oluşturulan 3D modeli 'l_prizma.step' adıyla STEP formatında dışa aktar
    exporters.export(model_l_prizma, 'l_prizma.step') # Dosya adını şekle uygun yapalım

    # 3D modeli görüntüleyiciye gönder (örn. CQ-editor), "L Şekli Prizma" adıyla göster
    show_object(model_l_prizma, name="L Şekli Prizma")
    # Bu artık kapalı bir dikdörtgen teli oluşturdu

    model_ozel = eskiz_ozel.extrude(5)
    show_object(model_ozel, name="Özel Yol Prizması")
    ```
<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/l_prizma.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

*   **Yaylar (`threePointArc`, `tangentArcPoint`)**: Düz çizgiler yerine yaylar çizmek için kullanılır.
    *   `threePointArc(point1, point2)`: Geçerli konumdan başlayıp `point1` ve `point2`'den geçen bir yay çizer.
    *   `tangentArcPoint(point)`: Geçerli konumdan başlayıp `point`'e ulaşan ve başlangıçtaki son segmente teğet olan bir yay çizer.
    ```python
    import cadquery as cq # CadQuery'i içe aktar
    from cadquery import exporters # Dışa aktarma modülünü içe aktar

    # XY düzleminde 2B kanat profili eskizi oluştur
    kanat_2B = (
        cq.Workplane("XY")          # XY düzleminde başla
        .lineTo(10, 0)              # Düz alt kenar çiz
        .tangentArcPoint((15, 8))   # Üst kenar için teğet yay çiz (yumuşak kavis)
        .close()                    # Eskizi başlangıç noktasına bağlayarak kapat
    )

    # 2B eskizi 75 birim kalınlaştırarak 3B kanat modelini oluştur
    kanat_3B = kanat_2B.extrude(75)

    # 3B kanat modelini görüntüle
    show_object(kanat_3B, name="3B Kanat") 

    # 3B modeli 'kanat.step' adıyla STEP dosyasına aktar
    exporters.export(kanat_3B, 'kanat.step')
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/kanat.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

```python
import cadquery as cq
import math
from cadquery import exporters

# --- Ay-Yıldız Parametreleri (Türk Bayrağına Göre Ayarlanmış) ---

# Ay (Hilal)
moon_outer_radius = 30    # Hilalin dış yayı yarıçapı
moon_inner_radius = 25    # İç yarıçapı dışa yakın tutalım
moon_offset_x = 8         # İç yayın merkezini biraz daha sağa kaydırarak hilali inceltelim
thickness = 3             # Daha ince bir model yapalım

# Yıldız
num_points = 5            # Yıldızın köşe sayısı
star_outer_radius = 9     # Yıldızı küçültelim
star_inner_radius = 3.5   # İç yarıçapı da orantılı küçültelim
star_center_x = moon_outer_radius * 1  # Merkezi dış yarıçapın %100'ü civarına kaydıralım (daha sağa)
star_center_y = 0         # Dikeyde merkezde kalsın
# Yıldızı döndürme: Genellikle bir köşe yukarı bakar. pi/2 radyan = 90 derece.
# Tam 90 derece yerine hafifçe sola yatık olması için pi/2'den biraz küçük bir değer deneyelim.
star_rotation_offset = math.pi * 0.45  # Yaklaşık 81 derece döndürme (deneyerek bulunur)


# --- 1. Hilal (Ay) Oluşturma ---
outer_cylinder = cq.Workplane("XY").circle(moon_outer_radius).extrude(thickness)
inner_cylinder = (
    cq.Workplane("XY")
    .moveTo(moon_offset_x, 0)
    .circle(moon_inner_radius)
    .extrude(thickness)
)
model_ay = outer_cylinder.cut(inner_cylinder)

# --- 2. Yıldız Oluşturma (Konum ve Döndürme Ayarlı) ---
star_points = []
total_vertices = 2 * num_points
angle_step = 2 * math.pi / total_vertices

for i in range(total_vertices):
    # Temel açıyı hesapla VE döndürme ofsetini ekle
    current_angle = i * angle_step + star_rotation_offset
    if i % 2 == 0:
        radius = star_outer_radius
    else:
        radius = star_inner_radius

    # Hesaplanan x,y'ye yıldızın merkez ofsetini ekle
    x = star_center_x + radius * math.cos(current_angle)
    y = star_center_y + radius * math.sin(current_angle)
    star_points.append((x, y))

eskiz_yildiz = (
    cq.Workplane("XY")
    .polyline(star_points)
    .close()
)
model_yildiz = eskiz_yildiz.extrude(thickness)

# --- 3. Ay ve Yıldızı Birleştirme ---
ay_yildiz_modeli = model_ay.union(model_yildiz)

# --- Göster ve Kaydet ---
show_object(ay_yildiz_modeli, name="Ay-Yıldız")
exporters.export(ay_yildiz_modeli, 'ay_yildiz_bayrak.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/ay_yildiz.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 0, 0);" />
</Layout>


-----

### 3. İleri Düzey Yollar: Spline (`spline`) ve Polyline (`polyline`)

Bazen önceden tanımlanmış şekiller veya basit çizgiler/yaylar yeterli olmaz. Daha serbest formlu yollar veya belirli noktalardan geçen kırıklı çizgiler oluşturmak istediğimizde `spline` ve `polyline` devreye girer.

*   **Polyline (`polyline`)**: Bir dizi noktayı düz çizgilerle birleştiren kırıklı bir yol oluşturur. Özellikle belirli koordinatlardan geçen keskin köşeli yollar çizmek için kullanışlıdır. `polyline` genellikle açık bir yol oluşturur, kapalı bir şekil elde etmek için son noktayı başlangıç noktasıyla birleştirmeniz veya `.close()` kullanmanız gerekir.

```python
import cadquery as cq             # CadQuery kütüphanesini içe aktar
from cadquery import exporters    # Dışa aktarma modülünü içe aktar

# Kırıklı yolun köşe noktaları (bir poligon tanımlar)
noktalar_polyline = [
    (0, 10),    # Üst tepe
    (2.4, 3.1),
    (9.5, 3.1),
    (3.8, -1.2),
    (6.0, -8.1),
    (0, -4.0),
    (-6.0, -8.1),
    (-3.8, -1.2),
    (-9.5, 3.1),
    (-2.4, 3.1),
    (0, 10)     # Başa dönüş (kapatmak için gerekli değil ama burada var)
]

# --- Açık 2B Poligon Oluşturma ---
eskiz_polyline = (
    cq.Workplane("XY")              # XY düzlemini seç
    .polyline(noktalar_polyline)   # Noktaları düz çizgilerle birleştir (son nokta ilk noktaya bağlanmaz)
)

# --- Kapalı 2B Poligon Oluşturma ---
kapali_eskiz_polyline = (
    cq.Workplane("XY")              # XY düzlemini seç
    .polyline(noktalar_polyline)   # Noktaları düz çizgilerle birleştir
    .close()                       # Şekli kapat (son noktayı ilk noktaya bağla)
)

# --- 3B Model Oluşturma ---
model_polyline = kapali_eskiz_polyline.extrude(3) # Kapalı 2B şekle 3 birim kalınlık ver

# --- Görselleştirme ve Dışa Aktarma ---
show_object(model_polyline, name="Polyline Tabanlı Şekil") # Modeli göster (CQ-editor vb. için)

exporters.export(model_polyline, 'yildiz.step') # Modeli STEP dosyası olarak kaydet
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/polyline.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

    **Ne zaman kullanılır?** Belirli koordinatlardan geçen ve keskin dönüşler içeren yollar veya profiller oluşturmak için idealdir. CNC yolu tanımlama veya belirli ölçülere sahip karmaşık bir profil çizme gibi durumlarda kullanışlıdır.

*   **Spline (`spline`)**: Daha organik ve akıcı eğriler için `spline` kullanılır. Bu komut, bir dizi kontrol noktasından yumuşak bir şekilde geçen bir eğri (genellikle B-spline) oluşturur. Eğrinin şekli, kontrol noktalarının konumuna bağlıdır.

    ```python
    import cadquery as cq             # CadQuery kütüphanesini içe aktar
    from cadquery import exporters    # Dışa aktarma modülünü içe aktar

    # Spline eğrisinin kontrol noktaları
    noktalar_spline = [
        (0, 0),
        (10, 15),
        (25, 10),
        (40, 20),
        (50, 0)
    ]

    # --- 2B Kapalı Eskiz Oluşturma ---
    eskiz_spline = (
        cq.Workplane("XY")              # XY düzlemini seç
        .spline(noktalar_spline)        # Noktalardan geçen spline eğrisi çiz
        .lineTo(50, -10)                # Düz çizgi ile (50, -10)'a git
        .lineTo(0, -10)                 # Düz çizgi ile (0, -10)'a git
        .close()                        # Şekli kapat (başlangıç noktasına dön)
    )

    # --- 3B Model Oluşturma ---
    model_spline = eskiz_spline.extrude(6) # Eskize 6 birim kalınlık ver

    # --- Görselleştirme ve Dışa Aktarma ---
    show_object(model_spline, name="Spline Tabanlı Şekil") # Modeli göster (CQ-editor vb.)
    exporters.export(model_spline, 'spline.step')           # Modeli STEP dosyası olarak kaydet
    ```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/spline.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

    **Ne zaman kullanılır?** Yumuşak geçişlere sahip, estetik açıdan önemli veya aerodinamik gibi organik formlar oluşturmak için kullanılır.

**Polyline vs Spline:** Temel fark, `polyline`'ın noktaları **düz çizgilerle** birleştirmesi, `spline`'ın ise noktalar arasından **yumuşak bir eğriyle** geçmesidir. İhtiyacınıza göre doğru aracı seçmek önemlidir.


----

### 4. Kopyalama ve Çoğaltma (Programatik Olarak)

Aynı 2D şekli birden çok kez çizmek istediğinizde, Python'un döngülerini kullanmak en verimli yoldur.

```python
import cadquery as cq # CadQuery kütüphanesini içe aktar
from cadquery import exporters # Dışa aktarma için gerekli modül

# XY düzleminde yeni bir çalışma düzlemi başlat
wp = cq.Workplane("XY")
# Daireler için kullanılacak yarıçap değerini tanımla
cap_yarıcapi = 5

# 3x3 bir grid (ızgara) üzerinde daireler çizmek için döngüler
for x_konum in [-20, 0, 20]:  # X ekseni boyunca kullanılacak konumlar
    for y_konum in [-20, 0, 20]: # Y ekseni boyunca kullanılacak konumlar (iç döngü)
        # Her bir (x_konum, y_konum) noktasına git ve orada bir daire çiz
        # wp = wp... yapısı, her yeni daireyi aynı çalışma düzlemine ekler
        wp = wp.moveTo(x_konum, y_konum).circle(cap_yarıcapi)

# Çalışma düzlemindeki tüm daireleri Z ekseni yönünde 5 birim uzatarak (extrude) 3D model oluştur
model_coklu_daire = wp.extrude(5)

# Oluşturulan 3D modeli 'box.step' adıyla STEP formatında dışa aktar
exporters.export(model_coklu_daire, 'box.step')

# Modeli görüntüleyiciye gönder (örn. CQ-editor), 'Çoklu Daireler' adıyla göster
show_object(model_coklu_daire, name="Çoklu Daireler")
```


<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/coklu_daire.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

Burada dikkat edilmesi gereken, `Workplane` nesnesinin durumunu koruyarak her seferinde yeni bir `moveTo` ve `circle` işlemi eklemektir. Her `circle` işlemi, `Workplane`'in yığınına (stack) yeni bir daire teli ekler. `extrude` komutu yığındaki tüm bu teller üzerinde çalışır.

-----

### 5. 2D Şekilleri Birleştirme ve Çıkarma (Genellikle 3D'de Yapılır)

CadQuery'de 2D seviyesinde doğrudan "boolean" (birleştirme, çıkarma, kesişim) operasyonları yapmak yaygın değildir. Genellikle şu yöntemler izlenir:

1.  **Ayrı Ayrı Extrude + 3D Boolean:** Farklı 2D eskizler oluşturulur, bunlar ayrı ayrı 3D katılara dönüştürülür (`extrude`) ve sonra bu 3D katılar üzerinde `union`, `cut`, `intersect` gibi 3D boolean operasyonları yapılır. (Bu en yaygın yöntemdir).
2.  **Tek Eskizde Çoklu Şekil:** Yukarıdaki kopyalama örneğinde olduğu gibi, aynı `Workplane` üzerinde birden fazla kapalı tel çizilir. `extrude` komutu, eğer bu teller kesişmiyorsa, hepsini ayrı ayrı katılaştırır. Eğer teller kesişiyorsa veya iç içe geçmişse, `extrude` genellikle bunları otomatik olarak birleştirir (implicit union) veya içtekini boşluk olarak kabul eder (implicit cut).

    ```python
    import cadquery as cq # CadQuery kütüphanesini içe aktar
    from cadquery import exporters # Dışa aktarma için gerekli modül

    # İç içe ve kesişen şekillerden oluşan 2D eskiz
    eskiz_karma = (
        cq.Workplane("XY")        # XY düzleminde çalışmaya başla
        .rect(40, 40)             # 40x40 boyutunda dış dikdörtgen çiz
        .moveTo(0,0).circle(10)   # Merkeze (0,0) git ve 10 yarıçaplı daire çiz (iç boşluk oluşturur)
        .moveTo(20,20).rect(15,15) # Sağ üste (20,20) git ve 15x15 kare çiz (dış dikdörtgenle kesişir/birleşir)
    )

    # 2D eskizi 10 birim kalınlaştırarak 3D model oluştur
    model_karma = eskiz_karma.extrude(10)

    # Oluşturulan 3D modeli 'box.step' dosyasına STEP formatında aktar
    exporters.export(model_karma, 'box.step')

    # Modeli görüntüleyiciye gönder (örn. CQ-editor), "İç İçe ve Kesişen" adıyla göster
    show_object(model_karma, name="İç İçe ve Kesişen")
    ```


<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/model_karma.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

-----

### 6. Text ve Yazı Ekleme (`text`)

Modellerinize yazı eklemek için `text` komutu kullanılır. Bu komut genellikle doğrudan 3D metin katısı oluşturur.

```python
import cadquery as cq # CadQuery kütüphanesini içe aktar
from cadquery import exporters # Dışa aktarma için gerekli modül

# XY düzleminde 3D metin modeli oluştur
metin_model = cq.Workplane("XY").text(
    txt="Gulderen Lab!", # Görüntülenecek metin
    fontsize=10,      # Yazı boyutu (puan cinsinden)
    distance=3,       # Metnin kalınlığı/derinliği (extrude mesafesi)
    halign="center",  # Yatayda ortala
    valign="center",  # Dikeyde ortala
    font="Arial"      # Kullanılacak yazı tipi (sistemde yüklü olmalı)
)

# Modeli STEP formatında dosyaya kaydet
# Dosya adını daha anlamlı hale getirdim: 'gulderen_lab_model.step' gibi olabilir.
exporters.export(metin_model, '3B_metin.step') # Modeli 'box.step' adıyla dışa aktar

# Oluşturulan modeli görüntüle (CQ-editor gibi bir ortamda çalışır)
show_object(metin_model) # Modeli göster
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/metin.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(255, 255, 255);" />
</Layout>

---

### 7. 🧱 2D Eskizden 3D Modele Geçiş: `extrude()`

Şimdiye kadar çeşitli 2D şekiller ve yollar oluşturmayı öğrendik. Peki bu düzlemsel eskizlere nasıl hacim kazandırırız? İşte burada CadQuery'nin en temel ve güçlü 3D oluşturma komutlarından biri olan `extrude()` devreye giriyor.

`extrude()`, bir veya daha fazla kapalı 2D teli (wire) veya yüzeyi (face) belirli bir mesafe boyunca dik olarak uzatarak katı bir 3D nesne oluşturur.

#### 🔹 Daireden Silindire

En basit örneklerden biri, bir daireyi uzatarak silindir oluşturmaktır:

```python
import cadquery as cq

silindir = (
    cq.Workplane("XY")  # XY düzleminde başla
    .circle(10)         # 10 birim yarıçaplı daire çiz
    .extrude(30)        # Bu daireyi Z yönünde 30 birim uzat
)
# Sonucu görüntüle
show_object(silindir, name="Daireden Silindir")
```

- Bu kod, 10 birim yarıçaplı 2D daireyi Z ekseni boyunca **30 birim yüksekliğinde** bir silindire dönüştürür.

#### 🔹 Dikdörtgenden Prizmaya

Benzer şekilde, bir dikdörtgeni uzatarak bir kutu (dikdörtgen prizma) oluşturabiliriz:

```python
import cadquery as cq

kutu = (
    cq.Workplane("XY")  # XY düzleminde başla
    .rect(40, 20)       # 40x20 boyutunda dikdörtgen çiz
    .extrude(10)        # Bu dikdörtgeni Z yönünde 10 birim uzat
)
# Sonucu görüntüle
show_object(kutu, name="Dikdörtgenden Prizma")
```

- 40x20 mm tabanlı dikdörtgen profil, Z ekseni boyunca **10 mm yüksekliğe** sahip bir katıya dönüşür.

---

### 🧠 Neden Extrude Önemlidir?

`extrude` komutu, parametrik modellemenin temel taşlarından biridir:

-   **Profil Tabanlı Modelleme:** Gerçek dünyadaki birçok nesne, belirli bir 2D profilin uzatılmasıyla veya döndürülmesiyle oluşturulabilir. `extrude` bu yaklaşımın temelini oluşturur.
-   **Basitlik ve Kontrol:** 2D eskizi kontrol etmek genellikle 3D formu doğrudan manipüle etmekten daha kolaydır. Eskizi değiştirip tekrar `extrude` uygulayarak modeli kolayca güncelleyebilirsiniz.
-   **Temel Yapı Taşı:** Daha karmaşık operasyonlar (kesme, birleştirme vb.) için genellikle önce `extrude` ile temel bir hacim oluşturulur.

---

### 🧪 Eğlenceli Bir Uygulama: Üçgen Prizma

`polyline` ile çizdiğimiz bir üçgeni `extrude` ile nasıl prizmaya dönüştürebileceğimizi görelim:

```python
# CadQuery'yi içe aktar
import cadquery as cq
# Dışa aktarma modülünü içe aktar
from cadquery import exporters


# 'prizma' nesnesini tanımla
prizma = (
    cq.Workplane("XY")                      # XY düzleminde başla
    .polyline([(0, 0), (20, 0), (10, 15)])  # Köşe noktalarıyla 2D çizgi çiz (açık üçgen)
    .close()                                # Çizgiyi kapatarak kapalı 2D şekil (üçgen) oluştur
    .extrude(10)                            # 2D üçgeni Z yönünde 10 birim uzatarak katı prizma yap
)

# Prizmayı 'prizma.step' olarak STEP formatında dışa aktar (veya .gltf)
# Blog'da göstermek için .gltf formatını tercih edebilirsiniz:
exporters.export(prizma, 'prizma.gltf') 

# Prizmayı görüntüleyicide göster (varsa)
show_object(prizma)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/prizma.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

- Bu örnekte, `polyline` ile oluşturduğumuz 2D üçgen profilini 10 birim yukarı doğru uzatarak basit bir üçgen prizma elde ettik.

📸 *Bu basit teknikle bile mimari detaylar, mekanik parçaların temel formları veya basit oyuncaklar oluşturmaya başlayabilirsiniz.*

---

### 🎯 Özetle (2D Eskiz ve Extrude):

-   `rect()`, `circle()`, `polygon()`, `polyline()`, `spline()` gibi komutlarla hassas **2D eskizler (profiller)** oluşturulur.
-   `moveTo()`, `lineTo()`, `threePointArc()`, `tangentArcPoint()` ile adım adım **özel yollar** çizilebilir.
-   `close()` komutu açık yolları kapatarak katı oluşturmaya uygun hale getirir.
-   Oluşturulan kapalı 2D eskizler, `extrude()` komutu kullanılarak kolayca **3D katı nesnelere** dönüştürülür.
-   Bu 2D çizim ve 3D'ye geçiş adımları, CadQuery ile modelleme yaparken en sık kullanacağınız temel yapı taşlarıdır.

---

### Sonuç

Bu bölümde CadQuery'nin güçlü 2D eskiz yeteneklerine derinlemesine bir bakış attık. Dikdörtgenler, daireler, çokgenler gibi temel şekillerden, `polyline` ve `spline` gibi serbest formlu yollara kadar çeşitli araçları inceledik. En önemlisi, bu 2D çizimleri `extrude` komutuyla nasıl 3 boyutlu katı modellere dönüştürebileceğimizi öğrendik.

Bu temel 2D çizim ve `extrude` bilgisi, CadQuery ile yapabileceklerinizin sadece başlangıcı. Artık kendi özel profillerinizi tasarlayıp onlara hacim kazandırarak çok daha çeşitli ve karmaşık modeller oluşturmaya hazırsınız.

Bir sonraki bölümde, `revolve`, `sweep` gibi diğer 3D oluşturma tekniklerine ve boolean operasyonları gibi model birleştirme/çıkarma yöntemlerine daha yakından bakacağız.

**Unutmayın:** En iyi öğrenme yolu denemektir! Farklı 2D şekiller çizin ve onları `extrude` ile 3D'ye dönüştürerek pratik yapın!

---

🚀 Sıradaki durağımız:  
**Boolean işlemleriyle** parçaları birleştirmek, kesmek ve aralarındaki ilişkileri yönetmek.  
Yani 3D tasarımda gerçek sihrin başladığı yere gidiyoruz!

-----

## 🔗 Boolean Operasyonları ve Detaylar

3D modelleme dünyasında, karmaşık parçalar çoğu zaman **basit şekillerin mantıklı bir şekilde birleştirilmesiyle** elde edilir. Bu işi CadQuery'de boolean işlemler üstlenir:

- 🔹 `union()` – Birleştir
- 🔹 `cut()` – Kes
- 🔹 `intersect()` – Kesişim

Bunlar geometriyi **mantıksal olarak işlemek** anlamına gelir. Tıpkı Lego parçaları gibi düşünebilirsin: Bazılarını birleştiririz, bazılarını keseriz.

---

### ◦ 🧱 union(): Şekilleri Birleştirmek

```python
model = (
    cq.Workplane("XY")
    .box(20, 20, 10)
    .faces(">Z").workplane()
    .polyline([-5, -5], [0, -5], [5, 5], [0, 5])
    .extrude(10)
)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/union-1.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu modelde:
- Alt kısmı bir kutu,
- Üst kısmı yamuk şeklinde tabandan yükseltilmiş prizma,
İkisi tek bir parça gibi birleşir: çünkü `extrude(10)` direkt olarak mevcut modele eklenir. Bu işlem **otomatik `union`** gibi çalışır.

---

### ◦ ✂️ `cut()`, `cutBlind()` ve `cutThruAll()` Arasındaki Farklar 🚀

CadQuery'de **kesme işlemleri** için birkaç farklı yöntem vardır. Bunların her biri farklı durumlarda avantaj sağlar:

- `cut()`: Belirli bir derinliğe kadar kesme (esnek ama genel)
- `cutBlind()`: Aynı işi yapar ama **anlam olarak daha nettir**
- `cutThruAll()`: Başladığı yerden modelin tamamını deler

Aynı kutuya üç farklı delik açarak farklarını gösterelim.

----

🧪 Örnek 1 — `cut()` Kullanımı

```python
import cadquery as cq
from cadquery import exporters # Dışa aktarma için

# Merkezlenmiş 20x20x20 kutu oluştur
kutu = cq.Workplane("XY").box(20, 20, 20)

# 'kutu'yu taşı (10,0,0), sonra tanımlanan silindiri keserek 'kutu2'yi oluştur
kutu2 = (
    kutu.translate((10, 0, 0)) # Önce kutuyu taşı
    .cut( # Sonra bu TAŞINMIŞ kutudan kes:
        cq.Workplane("XY") # Yeni bir düzlemde
        .cylinder(10, 5) # Yüksekliği 10, yarıçapı 5 olan silindir oluştur
        .translate((0, 0, 5)) # Bu silindiri Z'de 5 birim yukarı taşı
    )
)

# Dışa Aktarma
exporters.export(kutu2, 'box.step') # Kenarından yarısına kadar silindirik delik açılmış 'kutu'yu STEP olarak kaydet

# Görselleştirme (CQ-editor gibi bir ortamda)
show_object(kutu2) # Değiştirilmiş kutuyu ('kutu2') göster
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/cut_and_cutThruAll.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

📌 Bu modelde:

40x40 mm tabanlı bir kutu var.

Üst yüzeyden başlıyoruz ve 5 mm derinliğinde bir kör delik açıyoruz.

----

🧪 Örnek 2 — `cutBlind()` Kullanımı

```python
import cadquery as cq
from cadquery import exporters # Dışa aktarma

# 20x20x20 kutu oluştur
kutu = cq.Workplane("XY").box(20, 20, 20)

# 'kutu'yu taşı (10,0,0), üst yüzeyinde R=5 daire çiz
# ve bu daireyi -Z yönünde 10 birim keserek 'kutu2'yi oluştur.
kutu2 = (
    kutu.translate((10, 0, 0))
    .faces(">Z")        # Üst yüzey
    .workplane()        # Yüzeyde çalış
    .circle(5)          # R=5 daire çiz
    .cutBlind(-10)      # -Z yönünde 10 birim kes
)

# Dışa Aktarma
# 'kutu2'yi (taşınmış, kısmen delinmiş kutu) STEP olarak kaydet
exporters.export(kutu2, 'box_drilled.step')

# Görselleştirme (CQ-editor vb.)
# Sonucu ('kutu2') göster
show_object(kutu2)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/cut_and_cutThruAll.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

📌 cutBlind(-10) ile ne yaptığımız çok açık:
10 mm derinliğinde bir kör delik kesiyoruz.


----

🧪 Örnek 3 – cutThruAll() ile Tam Delik

```python
import cadquery as cq
from cadquery import exporters # Dışa aktarma fonksiyonları

# Merkezlenmiş 20x20x20 kutu oluştur
kutu = cq.Workplane("XY").box(20, 20, 20)

# 'kutu'yu değiştirerek 'kutu2'yi oluştur:
#   - (10,0,0) ötele
#   - Üst yüzeyi (+Z) seç
#   - Seçili yüzeyde çalışma düzlemi aç
#   - Yarıçapı 5 olan daire çiz
#   - Bu daireyi katı boyunca tamamen kes (del)
kutu2 = (
    kutu.translate((10, 0, 0))
    .faces(">Z")        # Üst yüzeyi seç
    .workplane()        # Seçili yüzeyde çalış
    .circle(5)          # Yarıçapı 5 olan daire çiz
    .cutThruAll()       # Katı boyunca tamamen kes
)

# Dışa Aktarma
# 'kutu2' (taşınmış ve üstten delinmiş kutu) nesnesini STEP olarak kaydet
exporters.export(kutu2, 'box_drilled.step')

# Görselleştirme (CQ-editor gibi bir ortamda)
# Sonucu ('kutu2') göster
show_object(kutu2)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/cut_and_cutThruAll_2.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte:

* Delik kutunun üst yüzünden başlar, alt yüzeyine kadar geçer.

* Parametre vermezsin, tüm modeli deler.

---

🔍 `cut()` – `cutBlind()` – `cutThruAll()` Karşılaştırması

✂️ `cut()`
- 📌 Açıklama: `extrude()` ile kesme  
- 📏 Derinlik Kontrolü: ✅ Var  
- 🕳️ Tam Delik: ❌  
- 👁️ Okunabilirlik: 🟡 Orta  
- 🎯 Kullanım: Esnek ama yoruma açık

---

✂️ `cutBlind()`
- 📌 Açıklama: Belirli derinliğe doğrudan kesme  
- 📏 Derinlik Kontrolü: ✅ Var  
- 🕳️ Tam Delik: ❌  
- 👁️ Okunabilirlik: ✅ Yüksek  
- 🎯 Kullanım: Açık, niyet belirten kör kesme

---

✂️ `cutThruAll()`
- 📌 Açıklama: Baştan sona tüm modeli deler  
- 📏 Derinlik Kontrolü: ❌ Yok  
- 🕳️ Tam Delik: ✅  
- 👁️ Okunabilirlik: ✅ Yüksek  
- 🎯 Kullanım: Hızlı ve tam delik işlemleri


----

### 🔀 `intersect()` ile Ortak Alanı Almak

Boolean işlemlerde `intersect()`, iki geometrinin **sadece kesişim alanını bırakır**, geri kalanı kaldırır.

---

🧪 🎨 Örnek – Kutunun İçine Sığan Kürenin Kesişimi

```python
import cadquery as cq
from cadquery import exporters # Dışa aktarma için

# 30x30x30 kutu oluştur
box = cq.Workplane("XY").box(30, 30, 30)

# R=20 merkezlenmiş küre oluştur
sphere = cq.Workplane("XY").sphere(20)

# Kutu ve kürenin kesişimini al
model = box.intersect(sphere)

# Modeli STEP olarak dışa aktar
exporters.export(model, 'kesisim.step')

# Modeli göster (CQ-editor vb.)
show_object(model)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/intersect.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

📌 Bu kodda:
- Küre kutudan büyük, ama merkezleri aynı.
- `intersect()` sadece kutunun içinde kalan küre kısmını alır.
- Sonuç: Küp şeklinde bir kesilmiş baloncuk, tam yarım küreden daha az, ama tam anlamıyla kutunun içine gömülmüş.

---

#### 🧠 Ne Zaman Kullanılır?

- İki şeklin kesişim alanını analiz etmek istiyorsan
- Parçaların birbirine **nerede dokunduğunu** çıkarmak istiyorsan
- Karmaşık geometri içinde fazlalıkları temizlemek için

---

### 💎 `chamfer()` ve `fillet()` – Kenar Yumuşatma Sanatı

Modelinize sadece işlev değil, **estetik** katmak istiyorsanız, bu iki sihirli komutu çok seveceksiniz:

---

#### 🔹 `chamfer()` – Eğimli Kırıklar

Köşeleri **düz bir açı** ile kırar, keskin ama şık bir görünüm verir.

```python
import cadquery as cq
from cadquery import exporters # Dışa aktarma için gerekli modül

# Modeli oluşturma adımları
model = (
    cq.Workplane("XY").box(30, 30, 10)  # XY düzleminde 30x30x10 boyutunda kutu oluştur
    .edges("|Z").chamfer(2)             # Z eksenine paralel kenarlara 2 birimlik pah kır
)

# Modeli STEP formatında dosyaya kaydet
# Dosya adını daha anlamlı hale getirdim:
exporters.export(model, 'pahli_kutu_30x30x10.step') 

# Oluşturulan modeli görüntüle (CQ-editor gibi bir ortamda)
show_object(model)
```
<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/chamfer.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

📌 Bu örnekte:
* 30x30x10 mm'lik bir kutu oluşturuluyor.
* Z yönünde dik duran tüm kenarlar, 2 mm'lik düz bir eğimle kırılıyor.
* Sonuç: Keskin ve teknik bir estetik.

🔹 fillet() – Yuvarlatılmış Akıcı Köşeler
Köşeleri dairesel bir yay ile yumuşatır, daha organik bir his kazandırır.

```python
import cadquery as cq
from cadquery import exporters # Dışa aktarma için gerekli modül

# Modeli oluşturma adımları
model = (
    cq.Workplane("XY").box(30, 30, 10)  # XY düzleminde 30x30x10 boyutunda kutu oluştur
    .edges("|Z").fillet(2)             # Z eksenine paralel kenarlara 2 birimlik radius (yuvarlatma) yap
)

# Modeli STEP formatında dosyaya kaydet
# Dosya adını yapılan işleme göre güncelledim:
exporters.export(model, 'radiuslu_kutu_30x30x10.step') 

# Oluşturulan modeli görüntüle (CQ-editor gibi bir ortamda)
show_object(model)
```
<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"></h1>

  <model-viewer
    src="/models/fillet.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

📌 Bu örnekte:
* Aynı kutunun kenarları, bu kez 2 mm yarıçaplı yumuşatmalarla akıcı bir forma dönüştürülüyor.
* Sonuç: Modern, dokunması keyifli bir yüzey.

---

### 🎯 Chamfer mı Fillet mı?

| İstediğin Etki            | Kullanılacak Komut |
|----------------------------|--------------------|
| Teknik, mekanik, keskin    | `chamfer()`         |
| Akıcı, ergonomik, modern   | `fillet()`          |

---

📐 İpucu:
* Mekanik parçalarda chamfer daha kullanışlıdır (örneğin vida girişleri).
* Elde tutulan objelerde (kutu, kumanda vs.) fillet rahatlık ve estetik sağlar.
* İstersen aynı modelde bazı kenarlara `chamfer()`, bazılarına `fillet()` de uygulayabilirsiniz. 🎨 

### ◦ 🎯 Seçicilerle Kenar ve Yüzey Seçme

CadQuery’nin en güçlü yanlarından biri, programatik olarak kenar ve yüzey seçimi yapabilmemizdir.
Bu yetenek sayesinde modeller üzerinde çok hassas işlemler gerçekleştirebilir ve tamamen parametrik, esnek tasarımlar oluşturabiliriz.

#### 📚 Temel Seçici Konsepti

CadQuery'de faces() ve edges() metodları, modelde belirli bölümleri seçmek için kullanılır.
Üstelik bu seçimler, basit ama güçlü notasyonlarla yapılır:

- `faces(">Z")`: Üst yüzey
- `edges("|Z")`: Z yönündeki dik kenarlar
- `faces("<X")`: Negatif X yönüne bakan yüzey

Bu seçimleri, `fillet()`, `chamfer()`, `cut()` gibi işlemlerde **nokta atışı** kullanabilirsin.

-----

#### 🔍 Yön Tabanlı Seçiciler

<span style='color: cyan;'>◦ Yüzey Seçimi</span>

* faces(">X"): Pozitif X yönüne bakan yüzeyler

* faces("<X"): Negatif X yönüne bakan yüzeyler

* faces(">Y"): Pozitif Y yönüne bakan yüzeyler

* faces("<Y"): Negatif Y yönüne bakan yüzeyler

* faces(">Z"): Pozitif Z yönüne bakan yüzeyler (üst yüzey)

* faces("<Z"): Negatif Z yönüne bakan yüzeyler (alt yüzey)

<span style='color: cyan;'>◦ Kenar Seçimi</span>

* edges("|X"): X eksenine paralel kenarlar

* edges("|Y"): Y eksenine paralel kenarlar

* edges("|Z"): Z eksenine paralel kenarlar (dikey kenarlar)

---

#### 🛠️ Gelişmiş Seçici Teknikleri

<span style='color: cyan;'>◦ Çoklu Seçimler</span>

Birden fazla bölgeyi aynı anda seçebilirsin:

```python
# Üst ve alt yüzeyleri birleştirerek seçme
result = box.faces(">Z").add(box.faces("<Z"))
```

```python
# X ve Y yönündeki kenarları seçme
result = box.edges("|X").add(box.edges("|Y"))


```

<span style='color: cyan;'>◦ Konum Bazlı Seçim</span>

Modeldeki konuma göre seçim yapabilirsin:

```python
# En üstteki yüzeyi seç
top_face = box.faces(">Z").sort(key=lambda f: f.Center().z).last()
```

```python
# En sağdaki dik kenarı seç
right_edge = box.edges("|Z").sort(key=lambda e: e.Center().x).last()

```

#### ✨ Pratik Uygulamalar

<span style='color: cyan;'>◦ Kenarlarda Pah (Chamfer) ve Yuvarlatma (Fillet)</span>

```python
# Üst kenarları pah kırma
result = box.edges(">Z").chamfer(0.5)
```

```python
# Alt kenarları yuvarlama
result = box.edges("<Z").fillet(1.0)
```

<span style='color: cyan;'>◦ Yüzeylerde Delik ve Pencere Açma</span>

```python
# Üst yüzeyde delik açmak
hole = Workplane("XY").circle(5).extrude(10)
result = box.faces(">Z").cut(hole)

```

```python
# Yan yüzeyde pencere açmak
window = Workplane("YZ").rect(10, 5).extrude(10)
result = box.faces(">X").cut(window)
```

#### 🔥 İleri Seviye Seçim Teknikleri

<span style='color: cyan;'>◦ Mantıksal Seçim Operasyonları</span>

```python
# VE işlemi: Z'ye paralel ve üst yarıda olan kenarlar
upper_z_edges = box.edges("|Z").intersect(box.edges(lambda e: e.Center().z > 0))

```

```python
# VEYA işlemi: X veya Y eksenine paralel kenarlar
horizontal_edges = box.edges("|X").add(box.edges("|Y"))

```

```python
# DEĞİL işlemi: Z'ye paralel olmayan kenarlar
non_vertical = box.edges().not_(box.edges("|Z"))

```

<span style='color: cyan;'>◦ Seçimi Sınırlandırma</span>

```python
# Z>5 olan tüm yüzeyleri seç
upper_region = box.faces().filter(lambda f: f.Center().z > 5)

```

```python
# En büyük 3 yüzeyi seç
largest_faces = box.faces().sort(key=lambda f: f.Area(), reverse=True).vals()[:3]

```

<span style='color: cyan;'>◦ Etiketleme (Tag) ve Seçme</span>

Etiketleyip sonra çağırmak da mümkün!

```python
# Üst yüzeyi etiketle
tagged_model = box.faces(">Z").tag("top_face")

# Etiketi kullanarak işlem yap
result = tagged_model.faces("#top_face").chamfer(0.5)
```
#### 🧠 En İyi Uygulamalar

✔️ Anlamlı Seçiciler Kullanın: Direkt sayılarla uğraşmak yerine yön, paralellik gibi kavramları kullanın.

✔️ Seçimi Kontrol Edin: .val().size() veya .vals() ile seçiminizi kontrol edin.

✔️ Debug Kullanımı: debug() ile modeli görselleştirerek doğru seçim yapıp yapmadığınızı test edin.

✔️ Katmanlı Yaklaşım: Karmaşık seçimleri küçük adımlara bölerek çalışın.

✔️ Parametrik Tasarım: Sabit değerlerden kaçının; değişkenlerle çalışarak daha esnek modeller oluşturun.

-----

### ⚛ Python’da Lambda Fonksiyonları 

Yukarıda birkaç örnekte lamda fonksiyonu kullandık. Konuyu bitirmeden önce bu fonksiyonu gözden geçirip iyice anlayalım. 

Python’da lambda fonksiyonları, küçük ve kısa fonksiyonları hızlıca tanımlamak için kullanılır. Genellikle bir kere kullanılacak veya çok kısa bir işlem yapacak fonksiyonlar için tercih edilir.
Haydi sıfırdan başlayıp ileri seviyeye doğru ilerleyelim! 🚀

----

#### 1. Lambda Nedir?

Lambda, "adsız fonksiyon" demektir. Yani, bir fonksiyona isim vermeden hızlıca tanımlayıp kullanmamıza olanak tanır.

Normal fonksiyon:

```python
def kare(x):
    return x * x
```

Lambda ile aynı şey:

```python
kare = lambda x: x * x
```
Gördüğünüz gibi, çok daha kısa!
Yani lambda x: x * x, bir x alır ve x * x sonucunu döndürür.

----

#### 2. Lambda'nın Basit Kullanımı

a. Tek Parametre

```python
topla5 = lambda x: x + 5
print(topla5(10))  # 15
```
Burada x parametresi 5 ile toplanıyor.

b. Birden Fazla Parametre

```python
carp = lambda a, b: a * b
print(carp(3, 4))  # 12
```
Lambda fonksiyonunda istediğin kadar parametre kullanabilirsin.

----

#### 3. Lambda'yı Fonksiyonlara Parametre Olarak Vermek

Lambda'lar özellikle filter, map, sort gibi işlemlerde çok kullanışlıdır.

a. `filter()` ile kullanımı

Bir listeden çift sayıları seçelim:

```python
sayilar = [1, 2, 3, 4, 5, 6]
ciftler = list(filter(lambda x: x % 2 == 0, sayilar))
print(ciftler)  # [2, 4, 6]
```

b. `map()` ile kullanımı

Listedeki tüm sayıları 2 ile çarpalım:

```python
carp2 = list(map(lambda x: x * 2, sayilar))
print(carp2)  # [2, 4, 6, 8, 10, 12]
```
c. `sorted()` ile özel sıralama

İsimleri uzunluklarına göre sıralayalım:

```python
isimler = ["Ada", "Mehmet", "Ali", "Zeynep"]
sirali = sorted(isimler, key=lambda isim: len(isim))
print(sirali)  # ['Ali', 'Ada', 'Mehmet', 'Zeynep']
```

#### 4. Lambda ile İleri Seviye Kullanımlar

a. Nesne Özelliklerine Göre Seçim

Bir listedeki 3D yüzeyleri alanlarına göre sıralamak:

```python
# Diyelim ki face bir nesne ve face.Area() metodu var
faces = [face1, face2, face3]
buyuktenKucuge = sorted(faces, key=lambda face: face.Area(), reverse=True)
```
Burada her face için `Area()` çağrılıyor ve ona göre sıralanıyor.

b. Karmaşık Filtreleme

Örneğin, bir kutunun Z ekseni yönünde yukarı bakan yüzeylerinden sadece alanı 10mm²'den büyük olanları seçelim:

```python
result = box.faces(">Z").filter(lambda face: face.Area() > 10)
```
Buradaki `lambda face: face.Area() > 10`, her yüzey (face) için alanı kontrol ediyor ve True/ False sonucuna göre filtreliyor.

----

#### 5. Lambda'nın Arkasında Yatan Felsefe

* Kısa işlemler için idealdir. Uzun ve karmaşık işlerde, normal def fonksiyonları daha uygundur.

* Fonksiyonel programlama tarzını destekler. Python’da veri akışı içinde küçük dönüşümler yapmak için çok etkilidir.

* Temiz kod yazımını teşvik eder. Özellikle tek satırlık işlemlerde kodu uzatmaktan kurtarır.

| Durum | Kullanım Şekli |
|:---|:---|
| Basit bir matematik işlemi | `lambda x: x + 2` |
| İki parametre ile işlem | `lambda a, b: a * b` |
| Liste işlemleri (filter/map) | `filter(lambda x: x > 5, liste)` |
| Nesne özelliklerine göre sıralama | `sorted(objeler, key=lambda o: o.ozellik)` |
| Karmaşık seçim ve filtreleme | `filter(lambda x: x.Area() > 10)` |


----


### 🧠 Özetle:

| İşlem        | Açıklama                              |
|--------------|----------------------------------------|
| `union()`     | Şekilleri birleştirir                 |
| `cut()`       | Şekil içinden malzeme çıkarır         |
| `intersect()` | Kesişim bölgesini bırakır             |
| `chamfer()`   | Kenarları kırar (eğimli)              |
| `fillet()`    | Kenarları yuvarlatır                  |

Bu işlemleri iyi kavrarsan, her parçayı **modüler** olarak tasarlayabilir, sonra bu parçaları istediğin gibi birleştirip kesebilirsin.

---

🚀 Artık CadQuery ile modelin içini oyabilir, parça birleştirebilir, estetik dokunuşlar ekleyebilirsiniz.  


------