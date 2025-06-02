---
# Dosya Adı: src/content/blog/cad-query-klavuzu-bolum-4.md

title: 'CAD Query ile Parametrik 3D Modelleme - 🚀 Bölüm 4: İleri CadQuery Özellikleri ve Teknikleri'
description: 'CadQueryde seçiciler (selectors), çalışma düzlemi manipülasyonu, koşullu modelleme, parametrik diziler, ayna görüntüsü ve daha karmaşık montaj tekniklerini öğrenin.'
publishDate: 2025-06-01 # Örnek tarih
tags: ['cadquery', 'python', '3d modelleme', 'parametrik tasarım', 'ileri cadquery', 'selectors', 'workplane', 'koşullu modelleme', 'montaj', 'array', 'mirror', 'cadquery örnekleri']
image:
  src: '/images/cadquery-python-3d-modeling-kapak.png' # Yeni bir kapak görseli olabilir
  alt: 'CadQuery ile ileri seviye 3D modelleme tekniklerini gösteren kapak görseli'
isDraft: false

# --- Seri Bilgileri ---
part: 4
totalPages: 8
seriesSlug: 'cad-query-klavuzu'
prevPageSlug: 'cad-query-klavuzu-bolum-3'
nextPageSlug: 'cad-query-klavuzu-bolum-5' # <<< DİKKAT: Sonraki bölümün slug'ını şimdiden belirleyelim (yoksa '' yapın)!
# --- Seri Bilgileri Sonu ---

---

# 🔧 Bölüm 4: İleri CadQuery Özellikleri  
Önceki bölümlerde CadQuery ile temel ve ileri seviye katı modelleme tekniklerini öğrendik: `extrude`, `revolve`, `sweep`, `loft` gibi komutlarla karmaşık formlar oluşturduk. Artık sıra, modellerimizi daha akıllıca, dinamik ve ölçeklenebilir hale getirmek için kullanılan bazı **ileri düzey özelliklere** geçiyor.

Bu bölümde şunları öğreneceğiz:
- 🎯 Nesneleri seçmek için güçlü `selector` sistemleri  
- 🔄 Çalışma düzlemini (`workplane`) manipüle etme ve referans değiştirme  
- ⚙️ Koşullu yapılarla akıllı modelleme  
- 🧱 Birden fazla parçayı yönetmek ve montaj kurmak (`Assembly`)  
- 📐 Parametrik diziler (arrays) oluşturma  
- 💎 Simetri uygulamaları ve ayna görüntüsü (`mirror`)  

Hazırsanız, CadQuery'nin daha sofistike ve parametrik olarak kontrol edilebilen yönlerine dalalım! 🚀

---

## 🎯 CadQuery'de Usta İşi Seçimler: `Selector`'lar ile Geometriye Hükmetmek

CadQuery'de model oluştururken, çoğu zaman tüm nesneye değil, onun belirli bir yüzeyine, kenarına veya köşesine işlem yapmak isteriz. İşte tam bu noktada `Selector` (Seçici) sistemi devreye girer. Tıpkı bir heykeltıraşın keskisini hassasiyetle kullanması gibi, `Selector`'lar da bize modelimizin istediğimiz geometrik bileşenlerini (yüzeyler, kenarlar, köşeler vb.) hassas bir şekilde filtreleme, gruplama ve onlara özel operasyonlar uygulama gücü verir. Özellikle büyük ve karmaşık modellerde veya parametrik tasarımlarda `Selector`'lar olmadan çalışmak neredeyse imkansız hale gelir.

### Seçicilerin Temel Mantığı: Yığın (Stack) ve Filtreleme

CadQuery, işlemleri bir "yığın" (stack) üzerinde uygular. Herhangi bir seçim yaptığınızda (örneğin, `.faces()`), yığının tepesine sadece seçilen elemanlar yerleştirilir. Sonraki komutlar (örneğin, `.fillet()`), yalnızca yığındaki bu seçili elemanlara uygulanır. Bu, operasyonlarınızı belirli geometrilere odaklamanızı sağlar.

### Temel `Selector` Kullanımı: Adım Adım Bir Örnek

En yaygın `Selector` türü, metin tabanlı (string) olanlardır. Gelin basit bir örnekle başlayalım:

```python
import cadquery as cq
from cadquery import exporters

# 1. XY düzleminde, genişliği 50 mm, derinliği 40 mm ve yüksekliği 30 mm olan bir kutu (dikdörtgen prizma) oluşturuluyor.
# Oluşan nesne, bir katı modeldir (Solid).
result = (
    cq.Workplane("XY")  # XY düzlemini başlangıç referansı olarak al
    .box(50, 40, 30)     # (X=50, Y=40, Z=30) boyutlarında kutu oluştur
)

# 2. Kutunun sadece üst yüzeyi seçiliyor.
# ">Z" yönü, Z ekseni boyunca yukarıyı ifade eder. Bu ifade, üst yüzeyi seçmek için kullanılır.
result = result.faces(">Z")  # Üstteki yüzeyi (Face) seç

# 3. Üst yüzeyde yer alan ve +X yönüne bakan kenarlar (Edge) seçiliyor.
# Bu, kutunun üst yüzeyinin sağ kenarlarını (X pozitif yöndekiler) hedef alır.
result = result.edges(">X")  # Üst yüzeyin +X yönündeki kenarlarını seç

# 4. Seçilen kenarlara 2 mm yarıçaplı pah (yuvarlatma/fillet) uygulanıyor.
# Bu işlem, sadece belirli kenarları yumuşatmak içindir.
result = result.fillet(2)  # Seçili kenarları 2 mm yarıçapla yuvarlat

# Nihai sonucu 3B görselleştirici ile göster (ör. CQ-editor veya Jupyter'de çalışıyorsanız işe yarar)
show_object(result)

# STEP formatında dosyayı dışa aktar (CAD yazılımları ile uyumlu evrensel format)
exporters.export(result, 'box.step')

```

Yukarıdaki kodu daha akıcı bir şekilde şöyle de yazabiliriz:

```python
import cadquery as cq
from cadquery import exporters

# XY düzleminden başlayan bir iş parçası (Workplane) tanımlanıyor.
# İşlemler sırasıyla zincirlenerek yapılır. Her adım bir nesne döndürür ve bir sonraki adıma bu nesne ile devam edilir.
result = (
    cq.Workplane("XY")       
    .box(50, 40, 30)          # 1. Adım: 50 mm x 40 mm tabanlı, 30 mm yüksekliğinde bir kutu (Solid) oluşturulur.
                              # Yığın durumu: [Kutu (Solid)]

    .faces(">Z")              # 2. Adım: Kutunun sadece üst yüzeyi seçilir.
                              # ">Z", pozitif Z yönünü (yani yukarıyı) ifade eder.
                              # Yığın durumu: [Üst yüzey (Face)]

    .edges(">X")              # 3. Adım: Üst yüzeydeki, pozitif X yönüne bakan kenarlar seçilir.
                              # Bu kenarlar genellikle sağ tarafta yer alır.
                              # Yığın durumu: [Seçili kenarlar (Edge)]

    .fillet(2)                # 4. Adım: Sadece bu seçilen kenarlara 2 mm yarıçaplı pah (yuvarlatma) uygulanır.
                              # Yığın durumu: [Kutu (Solid), kenarları yuvarlatılmış]
)

# 3B nesne görselleştirme — CQ-Editor veya Jupyter ile kullanılabilir.
show_object(result)

# Son modeli STEP formatında dosyaya dışa aktar.
# STEP formatı, SolidWorks, Fusion 360 gibi CAD yazılımlarıyla uyumludur.
exporters.export(result, 'box.step')

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Seçici ile Pah Oluşturma</h1>
  <model-viewer
    src="/models/secici_pahlama_1.gltf"
    alt="Bir 2D profilin Y ekseni etrafında döndürülmesiyle oluşturulmuş vazo modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte, `fillet(2)` işlemi tüm kutuya değil, zincirleme seçimlerle filtrelediğimiz belirli kenarlara uygulanmıştır.

### En Sık Kullanılan `Selector` Kuralları ve Anlamları

Aşağıdaki tablo, metin tabanlı `Selector`'larda sıkça karşılaşacağınız bazı temel kuralları ve ne anlama geldiklerini özetler. Bu kuralları bir kutu (box) üzerinde hayal etmek genellikle yardımcı olur.

| Seçici Kalıbı               | Açıklama                                                                    | Görselleştirme / Mini Örnek (Bir Kutu Üzerinde)        |
|----------------------------|-----------------------------------------------------------------------------|-------------------------------------------------------|
| `">Z"`                     | Z ekseninin pozitif yönündeki (en yüksek Z koordinatına sahip) eleman.      | Kutunun **üst** yüzeyi.                               |
| `"<Z"`                     | Z ekseninin negatif yönündeki (en düşük Z koordinatına sahip) eleman.       | Kutunun **alt** yüzeyi.                               |
| `">Y"`                     | Y ekseninin pozitif yönündeki eleman.                                       | Kutunun **arka** yüzeyi (genellikle).                  |
| `"<Y"`                     | Y ekseninin negatif yönündeki eleman.                                       | Kutunun **ön** yüzeyi (genellikle).                   |
| `">X"`                     | X ekseninin pozitif yönündeki eleman.                                       | Kutunun **sağ** yan yüzeyi.                            |
| `"<X"`                     | X ekseninin negatif yönündeki eleman.                                       | Kutunun **sol** yan yüzeyi.                            |
| ` "\|X"` (veya `parallel("X")`) | X eksenine paralel olan yüzeyler/kenarlar.                                | Kutunun X eksenine paralel **yan** yüzeyleri (üst/alt değil). |
| ` "\|Y"` (veya `parallel("Y")`) | Y eksenine paralel olan yüzeyler/kenarlar.                                | Kutunun Y eksenine paralel **yan** yüzeyleri.          |
| ` "\|Z"` (veya `parallel("Z")`) | Z eksenine paralel olan yüzeyler/kenarlar (genellikle dikey yüzeyler).    | Kutunun Z eksenine paralel **dikey** yüzeyleri.        |
| `"#Z"` (veya `perpendicular("Z")`)| Z eksenine dik olan yüzeyler/kenarlar.                                      | Kutunun **üst ve alt** yüzeyleri.                       |
| `"%Plane"`                 | Geometrik tipi `Plane` (Düzlem) olan yüzeyler.                              | Kutunun tüm **düz** yüzeyleri.                         |
| `"%Cylinder"`              | Geometrik tipi `Cylinder` (Silindir) olan yüzeyler.                         | Silindirik bir parçanın **yan** yüzeyi.                |
| `"%Sphere"`                | Geometrik tipi `Sphere` (Küre) olan yüzeyler.                               | Küresel bir parçanın yüzeyi.                          |
| `"%Circle"`               | Dairesel olan kenarlar veya yüzeyler.                                       | Bir silindirin **üst/alt dairesel kenarları**.       |
| `"last"`                   | Son oluşturulan veya seçilen eleman.                                        | `rect(2,2).rect(1,1).faces("last")` -> içteki dikdörtgenin yüzeyi. |
| `"first"`                  | İlk oluşturulan veya seçilen eleman.                                        |                                                       |
| `">X[0]"`                  | X ekseninin pozitif yönündeki ilk eleman (en büyük X koordinatına sahip).     | Kutunun sağ yan yüzeyi.                               |
| `">X[1]"`                  | X ekseninin pozitif yönündeki ikinci eleman (ikinci en büyük X koordinatına sahip). | (Eğer birden fazla varsa)                             |
| `"<Z[-1]"`                 | Z ekseninin negatif yönündeki son eleman (en düşük Z koordinatına sahip).    | Kutunun alt yüzeyi.                                   |
| `tag="myTag"`              | `.tag("myTag")` ile etiketlenmiş elemanları seçer.                          | (Aşağıdaki örneklerde göreceğiz)                     |


> 💡 Not: `"||Z"` gibi ifadeler CadQuery'de **geçersizdir**, `|Z` (tek dik çizgi) kullanılmalıdır.  

> `parallel()` ve `perpendicular()` fonksiyonları ise Python API üzerinden programatik seçim için kullanılır.

> **Not:** `edges()`, `faces()`, `vertices()` gibi farklı seçim metodları, bu kuralları kendi bağlamlarında (kenar, yüzey, köşe) yorumlar.

---

### `Selector` Kuralları için Detaylı Kod Örnekleri

Aşağıda, yukarıdaki tabloda listelenen her bir seçici kalıbı için açıklayıcı kod örnekleri bulunmaktadır. Örnekler, seçicinin neyi hedeflediğini ve nasıl kullanıldığını göstermek amacıyla, genellikle seçilen geometriye küçük bir değişiklik (pah, cep, çıkıntı vb.) uygular. Her örnek, kendi başına çalıştırılabilir bir CadQuery betiği olarak tasarlanmıştır.

---

#### `">Z"` Seçicisi ile Üst Yüzeye Cep Açma

`">Z"` seçicisi, Z ekseninin pozitif yönündeki (genellikle en yüksek Z koordinatına sahip) yüzeyi, kenarı veya köşeyi seçer. Bu örnekte, bir kutunun üst yüzeyini seçip üzerine dairesel bir cep açacağız.

```python
import cadquery as cq
from cadquery import exporters

# XY düzleminden başlayan bir iş parçası (Workplane) tanımlanıyor.
# 10x10x10 boyutunda bir temel kutu oluşturuluyor.
base_box = cq.Workplane("XY").box(10, 10, 10)
                                  # Yığın durumu: [Kutu (Solid)]

# Sadece üst yüzeyi (>Z) seç ve üzerine bir cep aç
result_gt_Z = (
    base_box.faces(">Z")            # 1. Adım: Kutunun sadece üst yüzeyi seçilir.
                                    # ">Z", pozitif Z yönünü (yani yukarıyı) ifade eder.
                                    # Yığın durumu: [Üst yüzey (Face)]

    .workplane()                  # 2. Adım: Seçili üst yüzey, yeni bir çalışma düzlemi olarak ayarlanır.
                                    # Yığın durumu: [Çalışma Düzlemi (Workplane) üst yüzeyde]

    .circle(2)                    # 3. Adım: Bu yeni çalışma düzlemine 2 birim yarıçaplı bir daire çizilir.
                                    # Yığın durumu: [Daire (Wire) + Çalışma Düzlemi]

    .cutBlind(-1)                 # 4. Adım: Çizilen daire profili kullanılarak katıdan -1 birim derinliğinde (içeri doğru) bir cep açılır.
                                    # Yığın durumu: [Cep açılmış Kutu (Solid)]
)

# 3B nesne görselleştirme — CQ-Editor veya Jupyter ile kullanılabilir.
# show_object(result_gt_Z, name="gt_Z_ust_yuzey_cep")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_gt_Z, 'gt_Z_ust_yuzey_cep.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">">Z" Seçicisi ile Üst Yüzeye Cep Açma</h1>
  <model-viewer
    src="/models/gt_Z_ust_yuzey_cep.gltf"
    alt="Bir kutunun >Z seçicisi ile seçilen üst yüzeyine açılmış dairesel cep modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte, `faces(">Z")` seçicisi ile kutunun sadece üst yüzeyi hedeflenmiş ve sonraki işlemler bu seçime uygulanmıştır.

---

#### `"<Z"` Seçicisi ile Alt Yüzeye Kare Cep Açma

`"<Z"` seçicisi, Z ekseninin negatif yönündeki (genellikle en düşük Z koordinatına sahip) elemanı seçer. Bu örnekte, bir kutunun alt yüzeyine kare bir cep açacağız.

```python
import cadquery as cq
from cadquery import exporters

# 10x10x10 boyutunda bir temel kutu oluşturuluyor.
base_box = cq.Workplane("XY").box(10, 10, 10)
                                  # Yığın durumu: [Kutu (Solid)]

# Sadece alt yüzeyi (<Z) seç ve üzerine kare bir cep aç
result_lt_Z = (
    base_box.faces("<Z")            # 1. Adım: Kutunun sadece alt yüzeyi seçilir.
                                    # "<Z", negatif Z yönünü (yani aşağıyı) ifade eder.
                                    # Yığın durumu: [Alt yüzey (Face)]

    .workplane()                  # 2. Adım: Seçili alt yüzey, yeni bir çalışma düzlemi olarak ayarlanır.
                                    # Yığın durumu: [Çalışma Düzlemi (Workplane) alt yüzeyde]

    .rect(3, 3)                   # 3. Adım: Bu yeni çalışma düzlemine 3x3 boyutlarında bir dikdörtgen (kare) çizilir.
                                    # Yığın durumu: [Dikdörtgen (Wire) + Çalışma Düzlemi]

    .cutBlind(-1)                 # 4. Adım: Çizilen dikdörtgen profili kullanılarak katıdan -1 birim derinliğinde bir cep açılır.
                                    # Yığın durumu: [Cep açılmış Kutu (Solid)]
)

# 3B nesne görselleştirme
# show_object(result_lt_Z, name="lt_Z_alt_yuzey_kare_cep")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_lt_Z, 'lt_Z_alt_yuzey_kare_cep.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"&lt;Z" Seçicisi ile Alt Yüzeye Kare Cep Açma</h1>
  <model-viewer
    src="/models/lt_Z_alt_yuzey_kare_cep.gltf"
    alt="Bir kutunun <Z seçicisi ile seçilen alt yüzeyine açılmış kare cep modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnek, `faces("<Z")` kullanarak modelin alt kısmına odaklanmayı ve orada değişiklik yapmayı gösterir.

---

#### `">Y"` Seçicisi ile Arka Yüzeye Beşgen Cep Açma

`">Y"` seçicisi, Y ekseninin pozitif yönündeki elemanı seçer. Standart bir görünümde bu genellikle modelin "arka" yüzeyidir. Bu örnekte, kutunun arka yüzeyine beşgen bir cep açacağız.

```python
import cadquery as cq
from cadquery import exporters

# 10x10x10 boyutunda bir temel kutu oluşturuluyor.
base_box = cq.Workplane("XY").box(10, 10, 10)
                                  # Yığın durumu: [Kutu (Solid)]

# Sadece +Y (arka) yüzeyi seç ve üzerine beşgen bir cep aç
result_gt_Y = (
    base_box.faces(">Y")            # 1. Adım: Kutunun sadece pozitif Y yönündeki (arka) yüzeyi seçilir.
                                    # Yığın durumu: [Arka yüzey (Face)]

    .workplane()                  # 2. Adım: Seçili arka yüzey, yeni bir çalışma düzlemi olarak ayarlanır.
                                    # Yığın durumu: [Çalışma Düzlemi (Workplane) arka yüzeyde]

    .polygon(5, 2.5)              # 3. Adım: Çalışma düzlemine 5 kenarlı ve dış teğet çember yarıçapı 2.5 olan bir poligon (beşgen) çizilir.
                                    # Yığın durumu: [Beşgen (Wire) + Çalışma Düzlemi]

    .cutBlind(-1)                 # 4. Adım: Çizilen beşgen profili kullanılarak katıdan -1 birim derinliğinde bir cep açılır.
                                    # Yığın durumu: [Cep açılmış Kutu (Solid)]
)

# 3B nesne görselleştirme
# show_object(result_gt_Y, name="gt_Y_arka_yuzey_besgen_cep")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_gt_Y, 'gt_Y_arka_yuzey_besgen_cep.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"&gt;Y" Seçicisi ile Arka Yüzeye Beşgen Cep Açma</h1>
  <model-viewer
    src="/models/gt_Y_arka_yuzey_besgen_cep.gltf"
    alt="Bir kutunun >Y seçicisi ile seçilen arka yüzeyine açılmış beşgen cep modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`faces(">Y")` seçicisi, modelin belirli bir yan yüzeyine (bu durumda arka) odaklanarak işlem yapmamızı sağlar.

---

#### `"<Y"` Seçicisi ile Ön Yüzey Kenarlarına Pah Kırma

`"<Y"` seçicisi, Y ekseninin negatif yönündeki elemanı seçer (genellikle "ön" yüzey). Bu örnekte, kutunun ön yüzeyini seçip bu yüzeydeki dikey kenarlara pah (chamfer) kıracağız.

```python
import cadquery as cq
from cadquery import exporters

# 10x10x10 boyutunda bir temel kutu oluşturuluyor.
base_box = cq.Workplane("XY").box(10, 10, 10)
                                  # Yığın durumu: [Kutu (Solid)]

# Sadece -Y (ön) yüzeyi seç, bu yüzeydeki dikey kenarlara pah kır
result_lt_Y_edges = (
    base_box.faces("<Y")          # 1. Adım: Kutunun sadece negatif Y yönündeki (ön) yüzeyi seçilir.
                                    # Yığın durumu: [Ön yüzey (Face)]

    .edges("|Z")               # 2. Adım: Seçili ön yüzeydeki Z eksenine paralel (dikey) kenarlar seçilir.
                                    # Yığın durumu: [Seçili dikey kenarlar (Edge listesi)]

    .chamfer(0.5)                # 3. Adım: Bu seçili kenarlara 0.5 birimlik pah (chamfer) kırılır.
                                    # Yığın durumu: [Pahlanmış Kutu (Solid)]
)

# 3B nesne görselleştirme
show_object(result_lt_Y_edges, name="lt_Y_on_yuzey_kenar_pah")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_lt_Y_edges, 'lt_Y_on_yuzey_kenar_pah.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"&lt;Y" Seçicisi ile Ön Yüzey Kenarlarına Pah Kırma</h1>
  <model-viewer
    src="/models/lt_Y_on_yuzey_kenar_pah.gltf"
    alt="Bir kutunun <Y seçicisi ile seçilen ön yüzeyinin dikey kenarlarına uygulanmış pah modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnek, bir yüzeyi seçtikten sonra o yüzey üzerindeki belirli kenarları (`edges("||Z")`) filtreleyerek daha hassas seçimler yapmayı gösterir.

---

#### `">X"` Seçicisi ile Sağ Yüzeye Delik Açma

**Açıklama:** `">X"` seçicisi, X ekseninin pozitif yönündeki elemanı seçer (genellikle "sağ" yan yüzey). Bu örnekte, kutunun sağ yüzeyine bir delik açacağız.

```python
import cadquery as cq
from cadquery import exporters

# 10x10x10 boyutunda bir temel kutu oluşturuluyor.
base_box = cq.Workplane("XY").box(10, 10, 10)
                                  # Yığın durumu: [Kutu (Solid)]

# Sadece +X (sağ) yüzeyi seç ve bu yüzeye bir delik aç
result_gt_X = (
    base_box.faces(">X")            # 1. Adım: Kutunun sadece pozitif X yönündeki (sağ) yüzeyi seçilir.
                                    # Yığın durumu: [Sağ yüzey (Face)]

    .workplane()                  # 2. Adım: Seçili sağ yüzey, yeni bir çalışma düzlemi olarak ayarlanır.
                                    # Yığın durumu: [Çalışma Düzlemi (Workplane) sağ yüzeyde]

    .hole(4)                      # 3. Adım: Çalışma düzlemine merkezlenmiş, 4 birim çapında bir delik açılır.
                                    # Delik, katı boyunca devam eder (cutThruAll gibi).
                                    # Yığın durumu: [Delikli Kutu (Solid)]
)

# 3B nesne görselleştirme
# show_object(result_gt_X, name="gt_X_sag_yuzey_delik")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_gt_X, 'gt_X_sag_yuzey_delik.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"&gt;X" Seçicisi ile Sağ Yüzeye Delik Açma</h1>
  <model-viewer
    src="/models/gt_X_sag_yuzey_delik.gltf"
    alt="Bir kutunun >X seçicisi ile seçilen sağ yüzeyine açılmış delik modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`faces(">X")` ve ardından `.workplane().hole()` kullanımı, belirli bir yüzeye hızla delik açmak için etkili bir yöntemdir.

---

#### `"<X"` Seçicisi ile Sol Üst Kenara Yuvarlatma

**Açıklama:** `"<X"` seçicisi, X ekseninin negatif yönündeki elemanı seçer (genellikle "sol" yan yüzey). Bu örnekte, kutunun sol yan yüzeyinin üst kenarını seçip yuvarlatacağız (fillet).

```python
import cadquery as cq
from cadquery import exporters

# 10x10x10 boyutunda bir temel kutu oluşturuluyor.
base_box = cq.Workplane("XY").box(10, 10, 10)
                                  # Yığın durumu: [Kutu (Solid)]

# Sadece -X (sol) ve üstteki (+Z) kenarı seçip yuvarlat
result_lt_X_edge = (
    base_box.edges("<X and >Z")   # 1. Adım: Negatif X yönünde ("<X") VE pozitif Z yönünde (">Z") olan kenar seçilir.
                                    # Bu, sol yan yüzeyin üst kenarıdır.
                                    # Yığın durumu: [Seçili kenar (Edge)]

    .fillet(1)                    # 2. Adım: Seçili kenara 1 birim yarıçaplı yuvarlatma (fillet) uygulanır.
                                    # Yığın durumu: [Yuvarlatılmış Kutu (Solid)]
)

# 3B nesne görselleştirme
# show_object(result_lt_X_edge, name="lt_X_sol_ust_kenar_fillet")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_lt_X_edge, 'lt_X_sol_ust_kenar_fillet.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"&lt;X" Seçicisi ile Sol Üst Kenara Yuvarlatma</h1>
  <model-viewer
    src="/models/lt_X_sol_ust_kenar_fillet.gltf"
    alt="Bir kutunun <X ve >Z seçicileriyle seçilen sol üst kenarına uygulanmış yuvarlatma (fillet) modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte `and` mantıksal operatörü, iki koşulu birden sağlayan belirli bir kenarı hedeflemek için kullanılmıştır.

---

#### `"|X"` (X'e Paralel) Yüzeylere Cep Açma

**Açıklama:** `"|X"` (veya `parallel("X")`) seçicisi, X eksenine paralel olan yüzeyleri veya kenarları seçer. Bir kutu için bu, genellikle YZ düzlemine paralel olan ön ve arka yüzeyler anlamına gelir.

```python
import cadquery as cq
from cadquery import exporters
# from cadquery import exporters # Eğer kullanacaksanız aktif edin
# from cq_editor import show_object # CQ-Editor gibi bir ortamda olduğunuzu varsayıyorum

# 1. Ana kutu
base_box_original = cq.Workplane("XY").box(10, 15, 20)

# 2. X'e dik yüzeyleri seç ve bu yüzeyler üzerine doğrudan çizim ve kesim yap
result_box_with_pockets = (
    base_box_original
    .faces("|X")  # X eksenine dik olan yüzeyleri seç (bu durumda 2 yüzey)
                  # Yığın durumu: [Face_negX, Face_posX] (iki adet Yüzey nesnesi)

    # AÇIKÇA .workplane() ÇAĞIRMIYORUZ.
    # .rect() komutu, yığındaki HER BİR yüzey için örtük olarak bir çalışma düzlemi oluşturur.
    # Bu örtük çalışma düzlemi, ilgili yüzeyin merkezinde ve yüzeye dik olarak konumlanır.
    .rect(3, 3)   # Her bir seçili yüzeyin (örtük çalışma düzlemine) 3x3 bir dikdörtgen çizer.
                  # Yığın durumu: [Wire_on_Face_negX, Wire_on_Face_posX] (iki adet Tel nesnesi)

    .cutBlind(-2) # Yığındaki her bir Tel nesnesini kullanarak, ilgili yüzeyden içeriye doğru
                  # 2 birim derinliğinde kesim yapar (cep açar).
                  # Yığın durumu: [Solid] (cepler açılmış son katı nesne)
)

# 3. 3B nesne görselleştirme
# show_object(base_box_original, name="Orijinal Kutu") # İsterseniz orijinali de görün
show_object(result_box_with_pockets, name="X_Dik_Yuzeylerde_Cep")

# 4. STEP dosyasına dışa aktar (isteğe bağlı)
# exporters.export(result_box_with_pockets, 'X_Dik_Yuzeylerde_Cep.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"|X" (X'e Paralel) Yüzeylere Cep Açma</h1>
  <model-viewer
    src="/models/parallel_X_yuzey_cep.gltf"
    alt="Bir kutunun X eksenine paralel olan ön ve arka yüzeylerine açılmış kare cepler modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`faces("|X")` seçicisi, birden fazla yüzeyi aynı anda seçip bunlara toplu işlem uygulamak için kullanışlıdır.

---

#### `"|Y"` (Y'ye Paralel) Kenarlara Yuvarlatma

**Açıklama:** `"|Y"` (veya `parallel("Y")`) seçicisi, Y eksenine paralel olan yüzeyleri veya kenarları seçer. Bu örnekte, bir kutunun Y eksenine paralel olan tüm kenarlarına yuvarlatma (fillet) uygulayacağız.

```python
import cadquery as cq
from cadquery import exporters

# 10x15x20 (x,y,z) boyutunda bir temel kutu oluşturuluyor.
base_box = cq.Workplane("XY").box(10, 15, 20)
                                  # Yığın durumu: [Kutu (Solid)]

# Y'ye paralel kenarları seç
result_parallel_Y_edges = (
    base_box.edges("|Y")         # 1. Adım: Y eksenine paralel olan tüm kenarlar seçilir.
                                    # Yığın durumu: [Y'ye paralel kenarlar (Edge listesi)]

    .fillet(0.5)                  # 2. Adım: Seçili kenarlara 0.5 birim yarıçaplı yuvarlatma uygulanır.
                                    # Yığın durumu: [Yuvarlatılmış Kutu (Solid)]
)

# 3B nesne görselleştirme
show_object(result_parallel_Y_edges, name="parallel_Y_kenar_fillet")

# Son modeli STEP formatında dosyaya dışa aktar.
exporters.export(result_parallel_Y_edges, 'parallel_Y_kenar_fillet.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"|Y" (Y'ye Paralel) Kenarlara Yuvarlatma</h1>
  <model-viewer
    src="/models/parallel_Y_kenar_fillet.gltf"
    alt="Bir kutunun Y eksenine paralel olan tüm kenarlarına uygulanmış yuvarlatma (fillet) modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`edges("|Y")` ile belirli bir yöne paralel tüm kenarlar kolayca seçilip modifiye edilebilir.

---

#### `"|Z"` (Z'ye Paralel) Yüzey Kenarlarına Pah Kırma

**Açıklama:** `"|Z"` (veya `parallel("Z")`) seçicisi, Z eksenine paralel (genellikle dikey) olan yüzeyleri veya kenarları seçer. Bu örnekte, bir kutu ve üzerine eklenmiş bir silindirden oluşan şeklin Z'ye paralel yüzeylerinin dış kenarlarına pah kıracağız.

```python
import cadquery as cq
from cadquery import exporters

# Bir kutu taban ve üzerine bir silindir ekleyelim
base_box_for_parallel_Z = cq.Workplane("XY").box(10, 10, 5)
                                  # Yığın durumu: [Taban Kutusu (Solid)]
cylinder_on_top = (
    cq.Workplane("XY")
    .cylinder(height=10, radius=3, centered=(True, True, False))
    .translate((0,0,2.5)) # Silindiri kutunun üstüne yerleştir (merkezi Z=2.5 olan kutunun üst yüzeyine)
)                                 # Yığın durumu: [Silindir (Solid)]

combined_shape_parallel_Z = base_box_for_parallel_Z.union(cylinder_on_top)
                                  # Yığın durumu: [Birleşik Kutu+Silindir (Solid)]


# Z'ye paralel (dikey) yüzeyleri seç ve bu yüzeylerin dış tellerine pah kır
result_parallel_Z_faces_chamfer = (
    combined_shape_parallel_Z.faces("|Z") # 1. Adım: Z eksenine paralel olan tüm yüzeyler seçilir (kutunun yanları, silindirin yanı).
                                    # Yığın durumu: [Z'ye paralel yüzeyler (Face listesi)]

    .wires()                        # 2. Adım: Seçili yüzeylerin dış sınırlarını oluşturan teller (kenar setleri) seçilir.
                                    # Yığın durumu: [Yüzey telleri (Wire listesi)]

    .chamfer(0.3)                   # 3. Adım: Bu tellere (kenarlara) 0.3 birimlik pah kırılır.
                                    # Yığın durumu: [Pahlanmış Kutu+Silindir (Solid)]
)

# 3B nesne görselleştirme
show_object(result_parallel_Z_faces_chamfer, name="parallel_Z_yuzey_kenar_pah")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_parallel_Z_faces_chamfer, 'parallel_Z_yuzey_kenar_pah.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"|Z" (Z'ye Paralel) Yüzey Kenarlarına Pah Kırma</h1>
  <model-viewer
    src="/models/parallel_Z_yuzey_kenar_pah.gltf"
    alt="Bir kutu ve üzerindeki silindirin Z eksenine paralel olan yüzeylerinin kenarlarına uygulanmış pah modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnek, karmaşık bir şeklin dikey yüzeylerini hedefleyip, bu yüzeylerin kenarlarına işlem yapmayı gösterir.

---

#### `"#Z"` (Z'ye Dik) Yüzeylere Cep Açma

**Açıklama:** `"#Z"` (veya `perpendicular("Z")`) seçicisi, Z eksenine dik olan yüzeyleri veya kenarları seçer. Bir kutu için bu genellikle üst ve alt yüzeylerdir. Bu örnekte, kutunun üst ve alt yüzeylerine kare cepler açacağız.

```python
import cadquery as cq
from cadquery import exporters

# 1. 10x10x10 boyutunda bir temel kutu oluşturuluyor.
base_box = cq.Workplane("XY").box(10, 10, 10)
                                  # Yığın Durumu: [Kutu (Solid)]

# 2. Z eksenine PARALEL olan yüzeyleri (yani yan yüzeyler) seç ve bu yüzeylere cep aç.
#    Bu yan yüzeylerin normal vektörleri Z eksenine DİKTİR.
result_perp_Z_faces_pockets = (
    base_box.faces("#Z")          # 1. Adım: Normali Z eksenine DİK olan yüzeyler seçilir.
                                    # Bu seçici ("#Z"), kutunun Z eksenine PARALEL olan
                                    # yan yüzeylerini (ön, arka, sağ, sol gibi) seçer.
                                    # Bir kutu için bu genellikle 4 yüzeydir ve bunlar eş düzlemli değildir.
                                    # Yığın Durumu: [Face_yan1, Face_yan2, Face_yan3, Face_yan4] (dört Yüzey nesnesi)

    # AÇIKÇA .workplane() ÇAĞIRMIYORUZ!
    # Bir sonraki 2D çizim komutu (.rect() gibi), yığındaki seçili HER BİR YÜZEY için
    # otomatik olarak (örtük olarak) bir çalışma düzlemi oluşturacaktır.
    # Bu örtük çalışma düzlemleri, ilgili yüzeyin merkezinde ve yüzeye dik (normaliyle aynı yönde)
    # olacak şekilde konumlandırılır.

    .rect(2, 2)                   # 2. Adım: Seçilen her bir yan yüzeyin üzerine (örtük çalışma düzlemine)
                                    # 2x2 boyutunda bir dikdörtgen çizilir.
                                    # Yığın Durumu: [Wire_yan1, Wire_yan2, Wire_yan3, Wire_yan4] (dört Tel nesnesi)

    .cutBlind(-0.5)               # 3. Adım: Yığındaki her bir Tel nesnesi kullanılarak,
                                    # telin ait olduğu orijinal yan yüzeyden içeriye doğru
                                    # (-0.5 birim) bir kesme işlemi (cep açma) gerçekleştirilir.
                                    # Negatif değer, çalışma düzleminin normalinin tersi yönde kesim yapar.
                                    # Yığın Durumu: [Cepli Kutu (Solid)] (yan yüzeylerinde cepler olan son katı nesne)
)

# 3. 3B nesne görselleştirme
# show_object(base_box, name="Orijinal Kutu") # İsterseniz orijinal kutuyu da görüntüleyebilirsiniz
show_object(result_perp_Z_faces_pockets, name="Z_Dik_Yuzeylerde_Cep")

# 4. Son modeli STEP formatında dosyaya dışa aktar (isteğe bağlı).
# exporters.export(result_perp_Z_faces_pockets, 'Z_Dik_Yuzeylerde_Cep.step') 
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"#Z" (Normali Z'ye Dik Olan Yan) Yüzeylere Cep Açma</h1>
  <model-viewer
    src="/models/perp_Z_dik_yuzey_cep.gltf" 
    alt="Bir kutunun Z eksenine paralel olan yan yüzeylerine açılmış ceplerin 3D modeli."
    auto-rotate
    camera-controls
    environment-image="neutral"        
    exposure="0.8"               
    shadow-intensity="1.0"        
    shadow-softness="1"        
    camera-orbit="30deg 135deg 105%" 
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`faces("#Z")` seçicisi, modelin yatay yüzeylerine (genellikle üst ve alt) aynı anda işlem yapmak için idealdir.

---

#### `"%Plane"` Seçicisi ile Düzlemsel Yüzey Kenarlarına Yuvarlatma

**Açıklama:** `"%Plane"` seçicisi, geometrik tipi `Plane` (Düzlem) olan yüzeyleri seçer. Bu örnekte, bir kutu taban ve üzerinde silindirik bir çıkıntı olan parçanın sadece düzlemsel yüzeylerinin kenarlarına yuvarlatma uygulayacağız.

```python
import cadquery as cq
from cadquery import exporters

# Bir kutu taban ve üzerinde silindirik bir çıkıntı oluşturalım
part_with_curve = (
    cq.Workplane("XY").box(10, 10, 2) # 1. Adım: Taban kutusu oluşturulur.
                                      # Yığın durumu: [Taban Kutusu (Solid)]
    .faces(">Z").workplane()          # 2. Adım: Tabanın üst yüzeyi seçilir ve WP ayarlanır.
                                      # Yığın durumu: [WP tabanın üstünde]
    .cylinder(height=3, radius=2, centered=(True, True, False)) # 3. Adım: Silindir eklenir (otomatik union).
                                      # Yığın durumu: [Kutu+Silindir (Solid)]
)

# Sadece düzlem (Plane) tipindeki yüzeyleri seç
result_plane_faces_fillet = (
    part_with_curve.faces("%Plane")   # 4. Adım: Parçadaki tüm düzlemsel yüzeyler seçilir.
                                      # (Kutunun tüm yüzeyleri, silindirin taban yüzeyi)
                                      # Yığın durumu: [Düzlemsel Yüzeyler (Face listesi)]

    .wires()                          # 5. Adım: Seçili yüzeylerin dış kenarları (telleri) alınır.
                                      # Yığın durumu: [Teller (Wire listesi)]

    .fillet(0.2)                      # 6. Adım: Bu tellere (kenarlara) 0.2 birim yarıçaplı yuvarlatma uygulanır.
                                      # Yığın durumu: [Kenarları yuvarlatılmış Kutu+Silindir (Solid)]
)

# 3B nesne görselleştirme
# show_object(result_plane_faces_fillet, name="type_plane_yuzey_kenar_fillet")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_plane_faces_fillet, 'type_plane_yuzey_kenar_fillet.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"%Plane" Seçicisi ile Düzlemsel Yüzey Kenarlarına Yuvarlatma</h1>
  <model-viewer
    src="/models/type_plane_yuzey_kenar_fillet.gltf"
    alt="Bir kutu ve üzerindeki silindirden oluşan parçanın sadece düzlemsel yüzeylerinin kenarlarına uygulanmış yuvarlatma modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`faces("%Plane")` geometrik tip seçicisi, modeldeki farklı geometrik formlar arasından sadece düz yüzeyleri hedeflemenizi sağlar.

---

#### `"%Cylinder"` Seçicisi ile Silindirik Yüzeye Cep Açma

**Açıklama:** `"%Cylinder"` seçicisi, geometrik tipi `Cylinder` (Silindir) olan yüzeyleri seçer. Bu örnekte, bir plaka üzerindeki deliklerin silindirik iç yüzeylerini seçecek ve bu deliklerin merkezlerine vida görevi görecek basit silindirler yerleştireceğiz.

```python
# CadQuery kütüphanesini 'cq' olarak içe aktar
import cadquery as cq
from cadquery import exporters

# 🧱 1. Plaka oluştur
# XY düzleminde başlayıp 60x40x5 boyutlarında bir kutu (plaka) oluştur.
plaka = cq.Workplane("XY").box(60, 40, 5)

# 📌 2. 4 köşeye delikler aç
# Deliklerin X,Y merkez koordinatları listesi.
delik_yerleri = [
    (-20, -15), (20, -15),
    (-20,  15), (20,  15)
]

# Plakanın üst yüzeyini seçip yeni bir çalışma düzlemi oluştur.
# Bu düzleme, belirtilen noktalarda 5 çapında delikler aç.
model = plaka.faces(">Z").workplane() # Plakanın üst yüzeyinde çalış
for x, y in delik_yerleri:
    model = model.pushPoints([(x, y)]).hole(5) # Noktaları ekle ve del

# ✅ 3. Delik yüzeylerini seç
# Modeldeki tüm silindirik yüzeyleri (açılan deliklerin iç yüzeyleri) seç.
delik_yuzeyleri = model.faces("%cylinder") # "%cylinder" silindirik yüzeyleri seçer

# 📍 4. Her bir delik silindiri merkezine vida yerleştir (silindir olarak)
# Vidaları birleştirmek için boş bir Workplane oluştur.
vidalar = cq.Workplane("XY")
for face in delik_yuzeyleri.objects: # Seçilen her delik yüzeyi için
    center = face.Center() # Yüzeyin merkezini al
    # Yeni bir XY düzleminde, delik merkezine ötelenmiş, 2 yarıçaplı, 10 yükseklikte silindir (vida) oluştur.
    vida = cq.Workplane("XY").transformed(offset=center).circle(2).extrude(10)
    vidalar = vidalar.union(vida) # Oluşturulan vidayı 'vidalar' grubuna ekle

# 🎨 5. Göster
# Oluşturulan geometrileri 3D görüntüleyicide göster.
show_object(model, name="plaka")
show_object(vidalar, name="vidalar", options={"color": (0.8, 0.2, 0.2)}) # Vidaları kırmızımsı renkte göster
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"%Cylinder" Seçicisi ile Silindirik Yüzeye Cep Açma</h1>
  <model-viewer
    src="/models/type_cylinder_vida.gltf"
    alt="Bir kutu ve üzerindeki silindirden oluşan parçanın sadece silindirik yan yüzeyine açılmış dikdörtgen cep modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`faces("%Cylinder")` ile modelinizdeki eğrisel silindirik yüzeyleri (bu örnekte delik iç yüzeyleri) hassas bir şekilde seçebilir ve bu seçimi sonraki işlemler için kullanabilirsiniz.

---

#### `"%Sphere"` Seçicisi ile Küresel Yüzeyden Çıkıntı Oluşturma

**Açıklama:** `"%Sphere"` seçicisi, geometrik tipi `Sphere` (Küre) olan yüzeyleri seçer. Bu örnekte, bir kutu ve üzerine eklenmiş bir küreden oluşan parçanın sadece küresel yüzeyinden küçük bir dairesel çıkıntı oluşturacağız.

```python
import cadquery as cq
from cadquery import exporters

z_kaydirma = 3.5
# Kürenin Z eksenindeki kaydırma miktarı.

# Taban model: Kutu ve Z'de kaydırılmış kürenin birleşimi.
part_with_sphere_face = (
    cq.Workplane("XY").box(10, 10, 2)
    .union(
        cq.Workplane("XY").sphere(3).translate((0, 0, z_kaydirma))
    )
)

# Modelden küresel yüzeyi seç.
sphere_face = part_with_sphere_face.faces("%Sphere").val()

# Orijinal modeli göster.
show_object(part_with_sphere_face, name="orijinal_model", options={"color": (0.6, 0.6, 0.6)})

# Küresel yüzeyin merkezini al.
center = sphere_face.Center()
# Yüzey merkezindeki normal vektörü al.
normal = sphere_face.normalAt(center)

# Normal boyunca ve ek Z ofsetiyle yeni bir nokta oluştur.
offset_point = center + normal.multiply(1) + cq.Vector(0, 0, z_kaydirma/2)
# Bu ofset noktasında yeni bir çalışma düzlemi oluştur.
wp_offset = cq.Workplane("XY").transformed(offset=offset_point)

# Yeni düzlemde daire çiz ve ekstrüde et.
res_offset = wp_offset.circle(1).extrude(0.5)

# Ekstrüde edilmiş sonucu göster.
show_object(res_offset, name="extrude_offset", options={"color": (0.2, 0.7, 0.3)})
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"%Sphere" Seçicisi ile Küresel Yüzeyden Çıkıntı Oluşturma</h1>
  <model-viewer
    src="/models/type_sphere_yuzey_cikinti.gltf"
    alt="Bir kutu ve üzerindeki küreden oluşan parçanın sadece küresel yüzeyinden oluşturulmuş dairesel çıkıntı modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`faces("%Sphere")` seçicisi, modeldeki küresel geometrilere özel işlemler yapmak için kullanılır.

---

#### `"%Circle"` Seçicisi ile Dairesel Kenarlara Pah Kırma

**Açıklama:** `"%Circle"` seçicisi, dairesel olan kenarları veya yüzeyleri (eğer yüzey dairesel bir düzlemse) seçer. Genellikle silindirlerin veya deliklerin dairesel kenarlarını seçmek için kullanılır.

```python
import cadquery as cq
from cadquery import exporters

# Yüksekliği 10, yarıçapı 5 olan bir silindir oluşturuluyor.
cylinder_shape = cq.Workplane("XY").cylinder(height=10, radius=5)

# Silindirin dairesel kenarlarını (üst ve alt çemberler) seçip pah kır.
result_circular_edges_chamfer = (
    cylinder_shape.edges("%Circle")  # Bu, geometrik tipi 'Circle' olan kenarları seçer.
    .chamfer(1)                      # Seçili dairesel kenarlara 1 birimlik pah kır.
)

# 3B nesne görselleştirme (Eğer Jupyter veya cq-editor gibi bir ortam kullanıyorsanız)
show_object(result_circular_edges_chamfer, name="attr_circular_kenar_pah")

# Son modeli STEP formatında dosyaya dışa aktar
exporters.export(result_circular_edges_chamfer, 'attr_circular_kenar_pah.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"%Circle" Seçicisi ile Dairesel Kenarlara Pah Kırma</h1>
  <model-viewer
    src="/models/attr_circular_kenar_pah.gltf"
    alt="Bir silindirin üst ve alt dairesel kenarlarına uygulanmış pah modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`edges("%Circle")`, dairesel geometrilere sahip parçaların kenarlarını kolayca hedeflemenizi sağlar.

---

#### `Workplane.last()` Metodu ile Yığındaki Son Yüzeye Silindir Ekleme

**Açıklama:** `Workplane.last()` metodu, bir Workplane yığınındaki (stack) en son geometrik elemanı (bu örnekte bir yüzeyi) seçer. Bu örnekte, bir kutunun tüm yüzeyleri seçildikten sonra, bu yüzeyler yığınındaki sonuncu yüzeyi `.last()` ile alıp üzerine bir silindir ekleyeceğiz.

```python
import cadquery as cq
from cadquery import exporters

# 1. Ana şekil: 10x15x5 mm boyutlarında bir kutu oluştur
my_box = cq.Workplane("XY").box(10, 15, 5)

# 2. Kutunun tüm yüzeylerini seç ve yığına ekle
all_faces_wp = my_box.faces()
# print(f"Yığındaki yüzey sayısı: {all_faces_wp.size()}") # 6 yüzey

# 3. Yüzeyler yığınındaki son yüzeyi seç (.last() metodu sıralamaya göre çalışır)
last_face_wp = all_faces_wp.last()
# print(f".last() ile seçilen öğe sayısı: {last_face_wp.size()}") # 1 yüzey

# 4. (İsteğe bağlı) Seçilen son yüzeyin geometrisini (Face nesnesini) al
# selected_last_face_obj = last_face_wp.val()
# print(f"Son seçilen yüzey merkezi: {selected_last_face_obj.Center()}")

# 5. Son yüzey üzerine yeni bir işlem ekle: 2 birim yarıçaplı, 3 birim yüksekliğinde silindir
# last_face_wp, sadece seçilen son yüzeyi içerir ve bu yüzeyin düzlemi aktif çalışma düzlemidir.
result_with_cylinder = last_face_wp.workplane().circle(2).extrude(3)

# 6. Görselleştirme (CQ-Editor veya Jupyter ortamlarında kullanılır)
# show_object(my_box, name="Ana_Kutu", options={"alpha":0.7}) # Ana kutuyu yarı şeffaf göster
# show_object(last_face_wp, name="Secilen_Son_Yuzey", options={"color": (0,0,255)}) # Seçilen yüzeyi mavi göster
show_object(result_with_cylinder, name="Kutu_ve_Detay") # Sonucu göster

# 7. STEP dosyasına dışa aktar
# Not: feature_on_last_face aslında sadece eklenen silindiri değil,
# ana kutu ile birleşmiş (union) sonucu içerir çünkü CadQuery bağlamsal çalışır.
# Eğer sadece silindiri dışa aktarmak isterseniz, zincirleme farklı olmalı.
# Ancak burada, `.last()` ile seçilen yüzeyin üzerinde işlem yapılmış nihai şekli aktarıyoruz.
exporters.export(result_with_cylinder, 'box_with_cylinder_on_last_face.step')

# Not: Belirli bir yüzeyi (örneğin en üst yüzeyi) güvenilir bir şekilde seçmek için
# .faces(">Z") gibi yön seçicileri veya etiketleme (tagging) kullanmak daha robust bir yöntemdir.
# .last() yığındaki mevcut sıralamaya göre sonuncuyu alır.
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"last" Seçicisi ile Son Oluşturulan Yüzeye Cep Açma</h1>
  <model-viewer
    src="/models/special_last_yuzey_cep.gltf"
    alt="İki katlı bir yapının en son eklenen katısının üst yüzeyine 'last' seçicisi ile seçilip açılmış cep modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`Workplane.last()` metodu, özellikle bir dizi seçim veya işlem sonucunda yığının en sonuna eklenen geometriye hızla erişmek ve üzerinde çalışmaya devam etmek için kullanışlıdır.

---

#### `Workplane.first()` Metodu ile Yığındaki İlk Yüzeye Cep (Pocket) Açma

**Açıklama:** `Workplane.first()` metodu, bir Workplane yığınındaki (stack) en baştaki (ilk) geometrik elemanı (bu örnekte bir yüzeyi) seçer. Bu örnekte, bir kutunun tüm yüzeyleri seçildikten sonra, bu yüzeyler yığınındaki ilk yüzeyi `.first()` ile alıp, o yüzeyin üzerine dikdörtgen şeklinde bir cep (kesim) yapacağız.

```python
import cadquery as cq
from cadquery import exporters

# 1. 20x30x10 mm boyutlarında bir kutu oluştur
base_solid = cq.Workplane("XY").box(20, 30, 10)

# 2. Kutunun tüm yüzeylerini seç
all_faces_wp = base_solid.faces()

# 3. Yüzeyler arasından sıralamaya göre ilk yüzeyi seç
first_face_wp = all_faces_wp.first()

# 4. Seçilen ilk yüzeyin merkezini yazdır (debug amaçlı)
selected_first_face_obj = first_face_wp.val()
print(f"İlk seçilen yüzeyin merkezi: {selected_first_face_obj.Center()}")

# 5. İlk yüzeye 8x6 mm boyutlarında, 4 mm derinliğinde bir cep oluştur
result_with_pocket = (
    first_face_wp.workplane()
    .center(3, -4)      # Cebi biraz kaydır
    .rect(8, 6)         # Dikdörtgen şekli çiz
    .cutBlind(-4)       # İçeri doğru 4 mm kes
)

# 6. İşlem yapılmış katıyı görselleştir
show_object(result_with_pocket, name="Kutu_Uzerinde_Cep")

# 7. STEP formatında dışa aktar
exporters.export(result_with_pocket, 'box_with_pocket_on_first_face.step')

# Not: .first() sıralamaya bağlı çalışır ve her zaman beklenen yüzeyi vermez.
# Belirli yönlerde yüzey seçmek için .faces("<Z") gibi seçiciler daha güvenilirdir.

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6"><code>.first()</code> Metodu ile Yığındaki İlk Yüzeye Cep Açma</h1>
  <model-viewer
    src="/models/box_with_pocket_on_first_face.gltf"
    alt="Bir kutunun yüzeyleri yığınındaki ilk yüzeye `.first()` metodu ile seçilip dikdörtgen bir cep açılmış model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`Workplane.first()` metodu, yığındaki ilk öğeye erişerek üzerinde karmaşık işlemler de dahil olmak üzere çeşitli modifikasyonlar yapmanıza olanak tanır. Bu örnekte olduğu gibi, seçilen yüzeye bir cep açmak, bu metodun pratik uygulamalarından biridir.


---

#### `">X[0]"` Seçicisi ile En Sağdaki Yüzeye Cep Açma

**Açıklama:** `">X[0]"` seçicisi, X ekseninin pozitif yönünde bulunan elemanlar arasından, X koordinatı en büyük olanı (en dıştakini, yani indeksi `[0]` olanı) seçer. Bu örnekte, X ekseni boyunca aralıklı iki kutudan en sağdakinin sağ yüzeyine cep açacağız.

```python
import cadquery as cq
from cadquery import exporters

# X ekseni boyunca aralıklı iki kutu oluşturalım
box_left_for_index = cq.Workplane("XY").box(5, 5, 5).translate((-5, 0, 0))
box_right_for_index = cq.Workplane("XY").box(5, 5, 5).translate((5, 0, 0))
combined_boxes_for_index = box_left_for_index.union(box_right_for_index)
                                  # Yığın durumu: [Birleşik İki Kutu (Solid)]

# +X yönündeki yüzeylerden, X koordinatı en büyük olanı ([0] indeksi) seç
# Bu, en sağdaki kutunun sağ yüzeyi olacaktır.
result_gt_X_index0_pocket = (
    combined_boxes_for_index.faces(">X[0]") # 1. Adım: +X yönündeki yüzeylerden en +X'te olanı (en sağdaki) seçilir.
                                  # Yığın durumu: [En Sağdaki Yüzey (Face)]
    .workplane()                  # 2. Adım: Seçili yüzey yeni bir çalışma düzlemi olur.
    .circle(1).cutBlind(-1)       # 3. Adım: Bu yüzeye 1 birim yarıçaplı, -1 birim derinliğinde cep açılır.
                                  # Yığın durumu: [Cepli Birleşik Kutu (Solid)]
)

# 3B nesne görselleştirme
show_object(result_gt_X_index0_pocket, name="indexed_gt_X_0_cep")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_gt_X_index0_pocket, 'indexed_gt_X_0_cep.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">">X[0]" Seçicisi ile En Sağdaki Yüzeye Cep Açma</h1>
  <model-viewer
    src="/models/indexed_gt_X_0_cep.gltf"
    alt="X ekseninde aralıklı iki kutudan en sağdakinin sağ yüzeyine '>X[0]' ile seçilip açılmış cep modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

İndeksli seçiciler (`[0]`, `[1]` vb.), belirli bir yönde sıralanmış elemanlar arasından istenilen sıradakini seçmek için kullanılır. `[0]` genellikle en uçtakini ifade eder.

---

#### `">X[1]"` Seçicisi ile İkinci En Sağdaki Yüzeye Silindir Oluşturma

**Açıklama:** `">X[1]"` seçicisi, X ekseninin pozitif yönünde bulunan elemanlar arasından, X koordinatı ikinci en büyük olanı (indeksi `[1]` olanı) seçer. Bu örnekte, üç kutudan en sağdakinin sol yüzeyine silindir oluşturacağız.

```python
import cadquery as cq
from cadquery import exporters

# 1. Her biri 10x10x10 mm boyutlarında üç kutu oluştur
box1 = cq.Workplane("XY").box(10, 10, 10)
box2 = cq.Workplane("XY").transformed(offset=(15, 0, 0)).box(10, 10, 10)
box3 = cq.Workplane("XY").transformed(offset=(30, 0, 0)).box(10, 10, 10)

# 2. Kutuları birleştir (union işlemi ile)
combined = box1.union(box2).union(box3)

# 3. Pozitif X yönündeki ikinci yüzeyi seç (>X[1])
target_face_wp = combined.faces(">X[1]")

# 4. Seçilen yüzeye silindir ekle (yarıçap 2 mm, yükseklik 5 mm)
result = target_face_wp.workplane().circle(2).extrude(3)

# 5. Sonucu görselleştir
show_object(result, name="Birlesik_Kutular_Silindirli")

# 6. STEP olarak dışa aktar
exporters.export(result, "combined_boxes_with_cylinder_on_X1.step")

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">">X[1]" Seçicisi ile İkinci En Sağdaki Yüzeye Silindir Oluşturma</h1>
  <model-viewer
    src="/models/indexed_gt_X_1_silindir.gltf"
    alt="X ekseninde aralıklı üç kutudan ortadakinin sağ yüzeyine '>X[1]' ile seçilip açılmış cep modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`[1]` indeksi, bir yöndeki sıralamada ikinci elemanı seçer. Bu, birden fazla benzer özelliğe sahip geometriler arasında ayrım yapmak için kullanışlıdır.

---

#### `"<Z[-1]"` Seçicisi ile En Alt Yüzeye Yazı İşleme

**Açıklama:** `"<Z[-1]"` seçicisi, Z ekseninin negatif yönünde bulunan elemanlar arasından Z koordinatı en düşük olan "sonuncuyu" (veya en uçtakini) seçer. Yönlü seçicilerde (`<Z`, `>Z` vb.) `[0]` zaten en uçtakini seçtiği için, `<Z[-1]` genellikle `<Z[0]` veya sadece `<Z` ile aynı sonucu verir. Bu örnekte, üst üste duran iki kutudan en alttakinin alt yüzeyine yazı işleyeceğiz.

```python
import cadquery as cq
from cadquery import exporters

# Üst üste iki kutu oluşturalım
box_bottom_for_neg_idx = cq.Workplane("XY").box(5, 5, 5)
box_top_for_neg_idx = cq.Workplane("XY").box(5, 5, 5).translate((0, 0, 5))
combined_stacked_boxes_neg_idx = box_bottom_for_neg_idx.union(box_top_for_neg_idx)
                                  # Yığın durumu: [Birleşik İki Kutu (Solid)]

# Z'nin negatif yönündeki yüzeylerden Z koordinatı en düşük olanı (en alttaki) seç
# "<Z" veya "<Z[0]" genellikle aynı sonucu verir.
result_lt_Z_index_neg1_text = (
    combined_stacked_boxes_neg_idx.faces("<Z[-1]") # 1. Adım: En düşük Z koordinatına sahip yüzey (en alt yüzey) seçilir.
                                          # Yığın durumu: [En Alt Yüzey (Face)]
    .workplane()                              # 2. Adım: Seçili yüzey yeni bir çalışma düzlemi olur.
    .text("Alt", fontsize=2, distance=-0.5,  # 3. Adım: "Alt" yazısı 0.5 birim derinliğinde (distance) yüzeye işlenir.
          halign="center", valign="center")
                                          # Yığın durumu: [Yazı İşlenmiş Kutu (Solid)]
)

# 3B nesne görselleştirme
show_object(result_lt_Z_index_neg1_text, name="indexed_lt_Z_neg1_yazi")

# Son modeli STEP formatında dosyaya dışa aktar.
# exporters.export(result_lt_Z_index_neg1_text, 'indexed_lt_Z_neg1_yazi.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"&lt;Z[-1]" Seçicisi ile En Alt Yüzeye Yazı İşleme</h1>
  <model-viewer
    src="/models/indexed_lt_Z_neg1_yazi.gltf"
    alt="Üst üste iki kutudan en alttakinin alt yüzeyine '<Z[-1]' ile seçilip işlenmiş 'Alt' yazısı modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Negatif indeksleme (`[-1]`) Python listelerinden alışık olduğumuz son elemanı seçme mantığını yansıtabilir, ancak yönlü seçicilerde genellikle `[0]` veya indekssiz kullanım (örn: `<Z`) en uçtaki elemanı zaten verir.

---

#### `tag="myTag"` Seçicisi ile Etiketlenmiş Yüzeylere İşlem Yapma

**Açıklama:** `tag="myTag"` seçicisi, daha önce `.tag("myTag")` metodu ile "myTag" (veya herhangi bir özel isimle) etiketlenmiş olan geometrik elemanları seçer. Bu, karmaşık modellerde belirli elemanlara kolayca yeniden erişmek için çok güçlü bir yöntemdir.

```python
import cadquery as cq
from cadquery import exporters

# 1) XY düzleminde 10×10×5 mm boyutlarında temel bir kutu oluşturun
result = cq.Workplane("XY").box(10, 10, 5)

# 2) Kutu yüzeylerinden +X yönündeki yüzeyi "yan_delik_yuzeyi" olarak etiketleyin
#    (bu etiketle bir sonraki işlemi kolayca seçebileceğiz)
result = (
    result
        .faces(">X")             # +X yüzeyini seç
        .tag("yan_delik_yuzeyi")  # seçilen yüzeye etiket ekle
)

# 3) Etiketli yüzeyi seçip, 3×3 mm kılavuz dikdörtgenin köşelerine 1 mm çaplı delikler açın
result = (
    result
        .faces(tag="yan_delik_yuzeyi")  # daha önce etiketlenen yüzeyi yakala
        .workplane()                     # yüzeye paralel yeni bir çalışma düzlemi oluştur
        .rect(3, 3, forConstruction=True)  # kılavuz dikdörtgen çiz (konstrüksiyon)
        .vertices()                      # dikdörtgenin köşe noktalarını al
        .hole(1)                         # her köşeye 1 mm çapında delik aç
)

# 4) Sonucu görüntüleyin ve dilerseniz STEP dosyası olarak dışa aktarın
show_object(result, name="kutudaki_delikler")
# cq.exporters.export(result, "etiketli_delikli_kutu.step")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">`tag="myTag"` Seçicisi ile Etiketlenmiş Yüzeylere İşlem Yapma</h1>
  <model-viewer
    src="/models/tag_etiketle_secim_islem.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Etiketleme (`.tag()` ve `tag="..."`), modelin farklı oluşturma aşamalarında tanımlanmış belirli geometrilere daha sonra kolay ve güvenilir bir şekilde erişmek için vazgeçilmez bir tekniktir.

---

### Seçicileri Birleştirme: `and`, `or` ve Gruplama

Seçicilerin gücü, onları mantıksal operatörlerle birleştirebilmemizden gelir:

*   **`or`**: Koşullardan herhangi birini sağlayan elemanları seçer.
    *   Örnek: `.edges("<X or >Y")` -> Sol kenarları VEYA arka yüzeydeki kenarları seçer.
*   **`and`**: Tüm koşulları aynı anda sağlayan elemanları seçer (genellikle zincirleme ile de sağlanır).
    *   Örnek: `.faces(">Z").edges(">X")` aslında "Üst yüzeyde VE +X yönünde olan kenarlar" anlamına gelir.
    *   Açıkça yazmak için: `.edges(">Z and >X")` (Bu, genellikle `.faces(">Z").edges(">X")` kadar okunabilir olmayabilir ama bazı durumlarda kullanışlıdır.)
*   **`( )`**: Koşulları gruplamak için parantezler kullanılır.
    *   Örnek: `.edges("(>X or <X) and >Z")` -> X ekseni boyunca uzanan (+X veya -X) kenarlardan SADECE üst yüzeyde (>Z) olanları seçer.

### Pratik Örneklerle `Selector` Becerilerinizi Geliştirin

Gelin, `Selector`'ların ne kadar esnek ve güçlü olduğunu gösteren birkaç örnek daha inceleyelim:

**Örnek 1: Belirli Kenarlara Pah Verme (Chamfer)**

```python
import cadquery as cq

result_chamfer = (
    cq.Workplane("XY")
    .box(60, 40, 30)
    # Sol kenarları VEYA arka yüzeydeki kenarları VEYA alt yüzeydeki kenarları seç
    .edges("<X or >Y or <Z")
    .chamfer(3)                # Sadece bu seçili kenarlara pah kır
)
# show_object(result_chamfer)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Mantık Operatörleri Kullanarak Seçicilerle İşlem Yapma</h1>
  <model-viewer
    src="/models/mantik_operatorlerle_secim_islemi.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte, kutunun sol tarafındaki, arka tarafındaki ve altındaki tüm kenarlara pah kırıyoruz.

**Örnek 2: Belirli Bir Yüzeye Delik Açma**

```python
import cadquery as cq

result_hole = (
    cq.Workplane("XY")
    .box(30, 30, 10)
    .faces(">Z")           # Sadece üst yüzeyi seç
    .workplane()           # Yeni çalışma düzlemini seçili yüzeyin üzerine taşı
    .circle(5)             # Bu çalışma düzlemine bir daire çiz
    .cutThruAll()          # Daireyi kullanarak tüm katı boyunca kes (delik aç)
)
# show_object(result_hole)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">"&gt;Z" Seçicisi İle Modelde Delik Oluşturma</h1>
  <model-viewer
    src="/models/gt_Z_secim_islemi.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Burada, önce kutunun üst yüzeyini seçip, ardından o yüzeyi yeni bir çalışma düzlemi olarak kullanarak üzerine bir daire çizip delik açıyoruz.

**Örnek 3: Koşullu Kenar Seçimi ve Farklı İşlemler**

```python
import cadquery as cq
from cadquery import exporters

# 1) 20x30x30 mm boyutlarında temel bir kutu oluştur
#    Sırasıyla: X=20 mm, Y=30 mm, Z=30 mm
result = cq.Workplane("XY").box(20, 30, 30)

# 2) Z eksenine paralel ve uzunluğu 25 mm'den büyük kenarlara 1.5 mm yarıçaplı pah (fillet) uygula
#    Bu örnekte, yalnızca 30 mm uzunluğundaki dikey kenarlar seçilecek
result = (
    result
    .edges("|Z")                          # Z yönüne paralel tüm kenarları seç
    .filter(lambda e: e.Length() > 25)   # Yalnızca 25 mm'den uzun olanları al (yani 30 mm)
    .fillet(1.5)                          # Kenarları yuvarlat (fillet) - yarıçap: 1.5 mm
)

# 3) Üst yüzeydeki kısa kenarlara 1 mm pah (chamfer) uygula
#    20 mm uzunluğundaki kenarlar seçilecek (çünkü kutunun üstü 20x30 mm)
result = (
    result
    .faces(">Z")                          # Üst (pozitif Z) yüzeyi seç
    .edges()                              # O yüzeydeki tüm kenarları al
    .filter(lambda e: e.Length() < 25)   # Yalnızca 25 mm'den kısa olanları seç (yani 20 mm)
    .chamfer(1)                           # Kenarlara düz pah kır (chamfer) - mesafe: 1 mm
)

# 4) Modeli STEP dosyası olarak dışa aktar
exporters.export(result, "box.step")

show_object(result)

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Koşullu Kanar Seçimi ve Seçilen Kenarla İşlem Yapma</h1>
  <model-viewer
    src="/models/kosullu_secim_islemi.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>
Bu örnek, `Length` gibi özelliklere dayalı koşullu seçimlerin ve farklı seçim setlerine farklı işlemler uygulamanın gücünü gösterir.

**Örnek 4: Etiketleme (Tagging) ile Hassas Kontrol**

Karmaşık modellerde, belirli geometrileri daha sonra kolayca seçebilmek için "etiketleyebilirsiniz".

```python
import cadquery as cq
from cadquery import exporters

# 1) 20x20x10 mm boyutlarında temel bir kutu oluştur
#    Üst ve alt yüzeyler daha sonra işlem yapılmak üzere etiketlenecek
result_tagged = (
    cq.Workplane("XY")
    .box(20, 20, 10)             # Temel kutu: X=20, Y=20, Z=10 mm
    .faces(">Z")
    .tag("top_face")            # Üst yüzeyi "top_face" etiketiyle işaretle
    .end()                      # Kutuya geri dön
    .faces("<Z")
    .tag("bottom_face")         # Alt yüzeyi "bottom_face" etiketiyle işaretle
    .end()                      # Kutuya geri dön

    # 2) Etiketli üst yüzeyde 5x5 mm’lik bir cep aç
    .faces(tag="top_face")      # Üst yüzeyi seç (etiketle)
    .rect(5, 5)                 # 5x5 mm dikdörtgen çiz
    .cutBlind(-2)               # 2 mm derinliğinde içeriye cep (negatif Z yönünde)

    # 3) Etiketli alt yüzeyden 3 mm yüksekliğinde bir silindir çıkart
    .faces(tag="bottom_face")  # Alt yüzeyi seç (etiketle)
    .workplane()               # O yüzeyde yeni bir çalışma düzlemi oluştur
    .circle(3)                 # Çapı 6 mm (yarıçapı 3 mm) olan daire çiz
    .extrude(3)                # 3 mm yukarıya doğru silindir oluştur (pozitif Z yönü)
)


# 4) Sonucu STEP olarak kaydet
exporters.export(result_tagged, "box.step")

show_object(result_tagged)
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Yüzey Etiketleme ve Etikete Dayalı İşlem Yapma</h1>
  <model-viewer
    src="/models/etiketli_secim_islemi.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Etiketleme, modelinizin farklı aşamalarında oluşturulmuş belirli elemanlara tekrar tekrar erişmeniz gerektiğinde son derece kullanışlıdır. `.end()` komutu, yığındaki bir önceki duruma (genellikle ana katı nesneye) dönmenizi sağlar.

### Neden Bu Kadar Önemli? Selector'ların Faydaları

*   **Parametrik Tasarım:** Model boyutları değişse bile, `">Z"` gibi göreceli seçiciler sayesinde doğru yüzeyler seçilmeye devam eder.
*   **Otomasyon:** Tekrarlayan işlemleri (örneğin, bir türdeki tüm deliklerin kenarlarına pah kırmak) kolayca otomatikleştirmenizi sağlar.
*   **Karmaşıklık Yönetimi:** Büyük modellerde, istediğiniz küçük bir detaya odaklanmanızı ve sadece onu değiştirmenizi mümkün kılar.
*   **Okunabilirlik ve Bakım:** İyi yazılmış seçiciler, kodunuzun ne yapmaya çalıştığını daha anlaşılır hale getirir.

### Sonuç: Seçicilerle Ustalaşın!

CadQuery'deki `Selector` sistemi, ilk başta biraz karmaşık görünebilir, ancak pratik yaptıkça ve farklı senaryolarda kullandıkça ne kadar güçlü ve vazgeçilmez olduğunu göreceksiniz. Bol bol deneme yapmaktan çekinmeyin! Farklı seçicileri birleştirin, etiketlemeyi kullanın ve modelinizin geometrisi üzerinde tam kontrol sahibi olmanın keyfini çıkarın. Bu beceri, CadQuery ile verimli ve etkili bir şekilde çalışmanızın anahtarıdır.

---

## 🔄 Workplane Manipülasyonu ve Referans Değiştirme  
`Workplane` (çalışma düzlemi), CadQuery'nin en güçlü ve esnek özelliklerinden biridir. Ancak çoğu zaman varsayılan XY düzleminde kalıyoruz. Gerçek gücü ise çalışma düzlemini yeniden konumlandırarak kullanmaktan gelir.

### `transformed()` ile Workplane Taşıma
```python
import cadquery as cq

# 1. Montaj Nesnesi Oluşturma
assy = cq.Assembly()

# 2. Referans (Orijinal) Konumda Bir Nesne (İsteğe Bağlı, Karşılaştırma İçin)
# Bu, taşınmış workplane'in etkisini daha net görmemize yardımcı olacak.
reference_box_size = 5
reference_box = (
    cq.Workplane("XY")
    .box(reference_box_size, reference_box_size, reference_box_size)
    .val() # Solid al
)
assy.add(reference_box, name="reference_origin_box", color=cq.Color("gray"))

# 3. Workplane'i Taşıma ve Döndürme Parametreleri
offset_vector = (20, 10, 15)  # (X, Y, Z) öteleme
rotation_angles = (0, 0, 45)   # (X, Y, Z) eksenleri etrafında derece cinsinden döndürme
                               # Bu örnekte Z ekseni etrafında 45 derece döndürüyoruz.

# 4. Taşınmış ve Döndürülmüş Workplane Üzerinde Nesne Oluşturma
# Temel bir XY düzlemiyle başlıyoruz.
# Ardından .transformed() ile bu düzlemi öteliyor ve döndürüyoruz.
# Sonraki tüm işlemler (circle, extrude) bu yeni, dönüştürülmüş düzlemde gerçekleşir.
transformed_object_solid = (
    cq.Workplane("XY")
    .transformed(offset=offset_vector, rotate=rotation_angles) # Workplane'i dönüştür
    .circle(5)                                                # Dönüştürülmüş düzlemde daire çiz
    .extrude(10)                                              # Dönüştürülmüş düzleme dik olarak ekstrüde et
    .val() # Solid al
)

# 5. Oluşturulan Nesneyi Montaja Ekleme
# .transformed() zaten nesneyi doğru global konuma ve yönelime yerleştirdiği için
# Assembly'e eklerken ek bir 'loc' parametresine genellikle ihtiyaç duyulmaz.
assy.add(transformed_object_solid, name="transformed_cylinder", color=cq.Color("blue"))

# (İsteğe Bağlı) Taşınmış Çalışma Düzleminin Kendisini Görselleştirmek (Sadece gösterim amaçlı)
# Gerçek bir katı olmadığı için doğrudan montaja eklenemez ama
# ince bir kutu ile temsil edebiliriz.
if "show_object" in locals(): # Sadece görselleştirme ortamında çalışsın
    plane_visualization_thickness = 0.1
    transformed_plane_viz = (
        cq.Workplane("XY")
        .transformed(offset=offset_vector, rotate=rotation_angles)
        .box(15, 15, plane_visualization_thickness, centered=(True, True, False)) # Düzlemi temsil eden ince bir kutu
        .val()
    )
    assy.add(transformed_plane_viz, name="transformed_plane_visualization", color=cq.Color(0.8, 0.8, 0.2, 0.3)) # Yarı saydam sarı

# 6. Montajı GLTF Olarak Kaydetme
output_filename = "transformed_workplane_assembly.gltf"
assy.save(output_filename)

# Eğer CQ-editor veya Jupyter gibi bir ortamda çalışıyorsanız, sonucu görmek için:
if "show_object" in locals():
    show_object(assy, name="TransformedWorkplaneAssembly")

print(f"Montaj '{output_filename}' olarak kaydedildi.")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Çalışma Düzlemini Taşıyarak Çizim Yapma</h1>
  <model-viewer
    src="/models/transformed_workplane_assembly.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### `Plane` Sınıfı ile Özel Düzlem Tanımlama
```python
import cadquery as cq

# 1. Montaj Nesnesi Oluşturma
assy = cq.Assembly()

# 2. Referans (Orijinal) Konumda Bir Nesne (İsteğe Bağlı, Karşılaştırma İçin)
reference_box_size = 5
reference_box = (
    cq.Workplane("XY")
    .box(reference_box_size, reference_box_size, reference_box_size)
    .val()
)
assy.add(reference_box, name="reference_origin_box", color=cq.Color("gray"))

# 3. Özel Düzlem Parametreleri
custom_origin = (10, 15, 5) # Düzlemin orijin noktası

# Düzlemin normal vektörü (bu, yeni düzlemin yerel Z ekseni olacak)
# Örneğin, global XZ düzlemine paralel ama Y eksenine bakan bir düzlem
custom_normal = cq.Vector(0, 1, 0) # Düzlemin normali +Y yönünde olsun

# Düzlemin yerel X ekseni yönü. Normal vektörüne dik olmalı.
# Eğer normal (0,1,0) ise, xDir (1,0,0) veya (0,0,1) gibi bir şey olabilir.
# CadQuery, verdiğiniz xDir'ı normale dik hale getirecektir.
# Ya da doğrudan dik bir vektör sağlayabilirsiniz.
custom_xDir = cq.Vector(1, 0, 0) # Yerel X ekseni global X ekseni ile aynı yönde olsun

# Bu xDir, custom_normal'e zaten dik.
# Eğer dik olmasaydı, CadQuery xDir'ı şu şekilde ayarlardı:
# yDir_temp = normal.cross(xDir_provided)
# xDir_final = yDir_temp.cross(normal) -> normalize edilmiş hali

# 4. Özel Düzlemi (cq.Plane) Tanımlama
# origin, normal ve xDir kullanarak bir Plane nesnesi oluşturuyoruz.
# CadQuery, bu bilgilerden yola çıkarak tam bir sağ el koordinat sistemi (xDir, yDir, zDir=normal) oluşturur.
try:
    custom_plane = cq.Plane(
        origin=custom_origin,
        normal=custom_normal,
        xDir=custom_xDir
    )
except ValueError as e:
    print(f"Hata: Düzlem oluşturulamadı - {e}")
    print("Lütfen 'normal' ve 'xDir' vektörlerinin birbirinden bağımsız olduğundan emin olun.")
    # Bu durumda devam etmek için varsayılan bir düzlem kullanalım
    custom_plane = cq.Plane.named("XY").translate(custom_origin)


# (İsteğe Bağlı) Oluşturulan düzlemin eksenlerini kontrol edebilirsiniz:
# print(f"Özel Düzlem Orijini: {custom_plane.origin}")
# print(f"Özel Düzlem X Ekseni: {custom_plane.xDir}")
# print(f"Özel Düzlem Y Ekseni: {custom_plane.yDir}") # Otomatik olarak hesaplanır
# print(f"Özel Düzlem Z Ekseni (Normal): {custom_plane.zDir}")


# 5. Özel Düzlem Üzerinde Bir Çalışma Düzlemi (Workplane) Oluşturma ve Nesne Modelleme
custom_object_solid = (
    cq.Workplane(custom_plane)  # Tanımladığımız özel düzlemi kullan
    .rect(10, 20)               # Bu özel düzlem üzerinde dikdörtgen çiz
    .extrude(5)                 # Özel düzlemin normaline (yerel Z) dik olarak ekstrüde et
    .val()                      # Solid al
)

# 6. Oluşturulan Nesneyi Montaja Ekleme
assy.add(custom_object_solid, name="object_on_custom_plane", color=cq.Color("green"))

# (İsteğe Bağlı) Özel Çalışma Düzleminin Kendisini Görselleştirmek
if "show_object" in locals(): # Sadece görselleştirme ortamında çalışsın
    plane_visualization_thickness = 0.1
    custom_plane_viz_wp = cq.Workplane(custom_plane) # Görselleştirme için de aynı düzlemi kullan
    custom_plane_viz = (
        custom_plane_viz_wp
        .box(12, 22, plane_visualization_thickness, centered=(True, True, False)) # Düzlemi temsil eden ince bir kutu
        .val()
    )
    assy.add(custom_plane_viz, name="custom_plane_visualization", color=cq.Color(0.8, 0.2, 0.8, 0.3)) # Yarı saydam mor

# 7. Montajı GLTF Olarak Kaydetme
output_filename = "custom_plane_assembly.gltf"
assy.save(output_filename)

# Eğer CQ-editor veya Jupyter gibi bir ortamda çalışıyorsanız, sonucu görmek için:
if "show_object" in locals():
    show_object(assy, name="CustomPlaneAssembly")

print(f"Montaj '{output_filename}' olarak kaydedildi.")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Özel Bir Düzlemde Çizim Yapma</h1>
  <model-viewer
    src="/models/custom_plane_assembly.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### Örnek: Eğik Bir Yüzeye Paralel Çizim
```python
import cadquery as cq
import math # Açı dönüşümü için

# 1. Eğim ve Montaj Parametreleri
angle_degrees = 30  # Eğim açısı (derece cinsinden)
rotation_tuple = (angle_degrees, 0, 0) # Global X ekseni etrafında 30 derece döndür

cylinder_radius = 2
cylinder_height = 15
cylinder_color = cq.Color(0.2, 0.5, 0.8, 1.0) # Mavi tonu (R, G, B, Alpha)

base_plate_size_x = 40
base_plate_size_y = 30
base_plate_thickness = 2
base_plate_color = cq.Color(0.7, 0.7, 0.7, 1.0) # Gri tonu

# 2. Eğimli Çalışma Düzlemi Oluşturma
# cq.Plane.named("XY") -> Orijinde, normali (0,0,1) olan bir düzlem oluşturur.
# .rotated(rotation_tuple) -> Bu düzlemi belirtilen Euler açılarıyla döndürür.
inclined_cq_plane = cq.Plane.named("XY").rotated(rotation_tuple)

# 3. Eğimli Düzlem Üzerinde Silindir Oluşturma
# Eğimli düzlemi kullanarak bir Workplane başlatıyoruz.
# Bu Workplane'in yerel koordinatları eğimli düzleme göre olacaktır.
# Silindiri oluştururken, `.val()` ile ham katıyı (Solid) elde ederiz.
# Daha sonra bu katıyı Assembly'e eklerken bir cq.Location ile konumlandıracağız.
# Ancak, eğimli düzlemde oluşturduğumuz için zaten doğru yönde olacaktır.
# Yalnızca global koordinat sistemindeki nihai konumunu ayarlamamız gerekebilir.

# Silindiri eğimli düzlemin *orijininde* oluşturalım
inclined_wp_for_cylinder = cq.Workplane(inclined_cq_plane)
cylinder_solid = (
    inclined_wp_for_cylinder
    .circle(cylinder_radius)
    .extrude(cylinder_height)
    .val()  # Katı nesneyi (Solid) al
)

# 4. Taban Plakası Oluşturma (Global XY düzleminde)
base_plate_solid = (
    cq.Workplane("XY")
    .box(base_plate_size_x, base_plate_size_y, base_plate_thickness)
    .translate((0, 0, -base_plate_thickness / 2)) # Orijini plakanın merkezine al
    .val() # Katı nesneyi (Solid) al
)

# 5. Montajı (Assembly) Oluşturma
assy = cq.Assembly()

# 6. Parçaları Montaja Ekleme
# Silindiri eklerken, eğer eğimli düzlemin orijini global orijinden farklı bir yerde
# olsaydı, bir cq.Location ile konumunu ayarlamamız gerekirdi.
# Şu anki durumda, inclined_cq_plane global orijinde oluşturulduğu için
# cylinder_solid zaten doğru konum ve yöndedir.
assy.add(cylinder_solid, name="inclined_cylinder", color=cylinder_color)

# Taban plakasını ekleyelim
assy.add(base_plate_solid, name="base_plate", color=base_plate_color)

# (İsteğe Bağlı) Silindiri eğimli düzlem üzerinde biraz kaydırmak istersek:
#   - Ya inclined_wp_for_cylinder üzerinde .center() kullanırdık.
#   - Ya da cylinder_solid'i montaja eklerken bir cq.Location ile taşırdık.
#   Örneğin, eğimli düzlemin yerel x ekseninde 5 birim kaydırmak için:
#   kaydirma_vektoru_egimli_duzlemde = cq.Vector(5, 0, 0)
#   global_kaydirma = inclined_cq_plane.toWorldCoords(kaydirma_vektoru_egimli_duzlemde) - inclined_cq_plane.origin
#   assy.add(cylinder_solid, name="inclined_cylinder_offset", color=cylinder_color, loc=cq.Location(global_kaydirma))
#   (Yukarıdaki örnek için, `inclined_cylinder` eklemesini yorum satırına alın)


# 7. Montajı Kaydetme (GLTF, STEP vb.)
assy.save("egik_duzleme_paralel_cizim.gltf") # GLTF formatında kaydet
# assy.save("egimli_montaj.step") # STEP formatında da kaydedebilirsiniz

# Eğer CQ-editor veya Jupyter gibi bir ortamda çalışıyorsanız, sonucu görmek için:
if "show_object" in locals():
    show_object(assy, name="EğimliMontaj")

print("Montaj 'egik_duzleme_paralel_cizim.gltf' olarak kaydedildi.")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Eğimli Bir Yüzeye Paralel Çizim Yapma</h1>
  <model-viewer
    src="/models/egik_duzleme_paralel_cizim.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

`Workplane`'i doğru şekilde manipüle edebilmek, 3D modelleme yeteneklerinizi kat be kat artırır. Özellikle simülasyonlar, mekanizmalar veya eğrisel yüzeyler üzerinde çalışırken bu bilgi çok değerli olur.

---

## ⚙️ Koşullu Modelleme ve Kontrol Yapıları  
Python’un doğal kontrol yapılarını (if/else, for, while) kullanarak CadQuery’yi daha akıllı hale getirebilirsiniz. Bu, aynı modeli farklı boyutlarla veya farklı yapılandırmalarla hızlıca üretmenize olanak tanır.

### Örnek: if/else Yapısıyla Kontrollü Şekil
```python
import cadquery as cq

# --- Parametreler ---
use_cylinder_base = True           # Taban şekli silindir mi olsun?
hole_type = "round"                # Delik tipi: "round", "square", "none"
hole_diameter = 8
square_hole_size = 7
add_top_chamfer = True            # Üst kenarlara pah kırılacak mı?
chamfer_amount = 1.5
detail_level = "low"              # "high" detaylı, "low" sade model
material_type = "metal"           # Malzeme tipi: "metal" veya "plastic"

# --- Montaj nesnesi başlat ---
assy = cq.Assembly()
base_part_name = "base_main_body"

# --- Adım 1: Taban Katı Modelini Oluştur ---
base_solid = None
if use_cylinder_base:
    print("Silindirik taban oluşturuluyor.")
    base_height = 20
    base_radius = 15
    base_wp = cq.Workplane("XY").cylinder(base_height, base_radius)
    base_solid = base_wp.val()
    base_part_name = "base_cylinder"
else:
    print("Kutu şeklinde taban oluşturuluyor.")
    base_width = 30
    base_depth = 25
    base_height = 20
    base_wp = cq.Workplane("XY").box(base_width, base_depth, base_height)
    base_solid = base_wp.val()
    base_part_name = "base_box"

# --- Akıcı modelleme için katıyı yeniden Workplane'e yükle ---
result_wp = cq.Workplane(obj=base_solid) if base_solid else cq.Workplane("XY")

# --- Adım 2: Üst Yüzeye Delik Aç ---
if base_solid:
    if hole_type == "round":
        print("Yuvarlak delik açılıyor.")
        result_wp = result_wp.faces(">Z").workplane().circle(hole_diameter / 2).cutThruAll()
    elif hole_type == "square":
        print("Kare delik açılıyor.")
        result_wp = result_wp.faces(">Z").workplane().rect(square_hole_size, square_hole_size).cutThruAll()
    elif hole_type == "none":
        print("Delik açılmıyor.")
    else:
        print(f"UYARI: Geçersiz delik tipi: '{hole_type}'")
else:
    print("UYARI: Taban yok, delik açılamaz.")

# --- Adım 3: Üst Kenarlara Pah Kırma ---
if base_solid and add_top_chamfer:
    print("Üst kenarlara pah uygulanıyor.")
    top_outer_edges = result_wp.faces(">Z").edges()
    if top_outer_edges.vals():
        result_wp = top_outer_edges.chamfer(chamfer_amount)
    else:
        print("Pah uygulanacak kenar bulunamadı.")
elif base_solid:
    print("Pah uygulanmıyor.")

# --- Geçici: Final katıyı çıkar ---
if result_wp.solids:
    final_base_solid = result_wp.val()
    base_color = cq.Color("lightgray")
    if material_type == "metal":
        base_color = cq.Color("steelblue")
    elif material_type == "plastic":
        base_color = cq.Color("yellow")
    assy.add(final_base_solid, name=base_part_name, color=base_color)

# --- Adım 4: Yüksek Detay Seçildiyse Ek Parçalar Ekle ---
if detail_level == "high":
    print("Yüksek detay modu: yan kabartmalar ekleniyor.")
    if not use_cylinder_base and final_base_solid:
        try:
            emboss_wp = cq.Workplane(obj=result_wp.val())
            emboss_solid = (
                emboss_wp.faces("<X")
                .workplane(centerOption="CenterOfBoundBox")
                .rect(5, base_height * 0.6, forConstruction=True)
                .vertices()
                .circle(1)
                .extrude(2)
                .val()
            )
            assy.add(emboss_solid, name="side_embossments", color=cq.Color("darkblue"))
        except Exception as e:
            print(f"HATA: Kabartma eklenemedi: {e}")
elif detail_level == "low":
    print("Düşük detay modu: Ek geometri eklenmedi.")
else:
    print(f"UYARI: Geçersiz detay seviyesi: '{detail_level}'")

# --- Adım 5: Malzeme Tipine Göre Bilgilendirme ---
if material_type == "metal":
    print("Malzeme: Metal (renk: çelik mavisi)")
elif material_type == "plastic":
    print("Malzeme: Plastik (renk: sarı)")
else:
    print(f"UYARI: Bilinmeyen malzeme tipi: '{material_type}'")

# --- Adım 6: Montajı Dışa Aktar ---
output_filename = f"parametrik_montaj_{'Cylinder' if use_cylinder_base else 'Box'}_{hole_type}Hole.gltf"
try:
    assy.save(output_filename)
    print(f"\nMontaj '{output_filename}' dosyasına kaydedildi.")
except Exception as e:
    print(f"\nHATA: Kaydedilemedi: {e}")
    print("Montaj nesnesi boş olabilir.")

# --- Görselleştirme (Varsa) ---
if "show_object" in locals():
    show_object(assy, name="ParametrikMontaj")

print("\n--- Modelleme Tamamlandı ---")
print(f"Kullanılan Parametreler:\n"
      f"  - use_cylinder_base={use_cylinder_base}\n"
      f"  - hole_type='{hole_type}'\n"
      f"  - add_top_chamfer={add_top_chamfer}\n"
      f"  - detail_level='{detail_level}'\n"
      f"  - material_type='{material_type}'")

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">if/else Kontrol Yapısı İle Kontrollü Şekil Oluşturma</h1>
  <model-viewer
    src="/models/parametrik_montaj_Cylinder_roundHole.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### Örnek: For Döngüsüyle Tekrar Eden Yapı
```python
import cadquery as cq
import math

# --- Parametreler ---
# Bu değerleri değiştirerek modelin nasıl değiştiğini gözlemleyin.

# 1. Dairesel Desen Parametreleri
num_cylinders_in_circle = 6       # Dairesel bir düzende kaç silindir olacağı
circle_pattern_radius = 30        # Silindirlerin yerleştirileceği dairenin yarıçapı
cylinder_height = 10
cylinder_radius = 3

# 2. Doğrusal Desen Parametreleri
num_boxes_in_row = 4              # Bir sırada kaç kutu olacağı
box_spacing = 15                  # Kutular arasındaki boşluk
box_size_x = 10
box_size_y = 8
box_size_z = 5
start_offset_x = - ( (num_boxes_in_row -1) * box_spacing + box_size_x ) / 2 # Sırayı ortalamak için

# 3. Izgara (Grid) Desen Parametreleri
grid_rows = 3
grid_cols = 5
grid_spacing_x = 12
grid_spacing_y = 10
sphere_radius = 2.5
grid_start_x = - ( (grid_cols -1) * grid_spacing_x ) / 2
grid_start_y = - ( (grid_rows -1) * grid_spacing_y ) / 2

# 4. Spiral Desen Parametreleri (daha karmaşık)
num_points_on_spiral = 50
spiral_max_radius = 25
spiral_height_increase = 0.5 # Her nokta için Z'deki artış
spiral_rotations = 3
spiral_sphere_radius = 1

# --- Montaj Nesnesi ---
assy = cq.Assembly(name="ForLoopPatterns")

# --- 1. Dairesel Düzende Silindirler Oluşturma ---
print(f"\n--- 1. Dairesel Düzende {num_cylinders_in_circle} Silindir Oluşturuluyor ---")
angle_step = 360.0 / num_cylinders_in_circle # Her silindir arasındaki açı

for i in range(num_cylinders_in_circle):
    angle = math.radians(i * angle_step) # Açıyı radyana çevir
    x_pos = circle_pattern_radius * math.cos(angle)
    y_pos = circle_pattern_radius * math.sin(angle)

    # Her silindiri kendi konumunda bir Workplane üzerinde oluştur
    cylinder = (
        cq.Workplane("XY")
        .center(x_pos, y_pos) # Silindirin merkezini ayarla
        .cylinder(cylinder_height, cylinder_radius)
        .val() # Solid al
    )
    assy.add(cylinder, name=f"CircularCylinder_{i+1}", color=cq.Color("blue"))

# --- 2. Doğrusal Düzende Kutular Oluşturma ---
print(f"\n--- 2. Doğrusal Düzende {num_boxes_in_row} Kutu Oluşturuluyor ---")
current_x_pos = start_offset_x
for i in range(num_boxes_in_row):
    # Kutuyu oluştur ve konumlandır
    # .translate() ile mevcut Workplane'deki nesneyi taşıyabiliriz
    # ya da her seferinde yeni bir Workplane.center() kullanabiliriz.
    box = (
        cq.Workplane("XY")
        .center(current_x_pos, -circle_pattern_radius - 20) # Y'de biraz aşağı taşıyalım
        .box(box_size_x, box_size_y, box_size_z)
        .val()
    )
    assy.add(box, name=f"LinearBox_{i+1}", color=cq.Color("green"))
    current_x_pos += box_spacing + box_size_x # Bir sonraki kutunun başlangıç pozisyonu

# --- 3. Izgara (Grid) Düzende Küreler Oluşturma (iç içe for döngüsü) ---
print(f"\n--- 3. Izgara Düzende {grid_rows * grid_cols} Küre Oluşturuluyor ---")
for r in range(grid_rows): # Satırlar için döngü
    current_y_grid = grid_start_y + r * grid_spacing_y
    for c in range(grid_cols): # Sütunlar için döngü (iç döngü)
        current_x_grid = grid_start_x + c * grid_spacing_x
        sphere = (
            cq.Workplane("XY")
            .center(current_x_grid, current_y_grid)
            .center(0, circle_pattern_radius + 20) # XZ düzleminde, diğerlerinden yukarıda
            .sphere(sphere_radius)
            .val()
        )
        # Renkleri satır ve sütuna göre değiştirelim
        color_r = r / max(1, grid_rows -1) # 0-1 arası
        color_g = c / max(1, grid_cols -1) # 0-1 arası
        assy.add(sphere, name=f"GridSphere_R{r}_C{c}", color=cq.Color(color_r, color_g, 0.5))

# --- 4. Spiral Düzende Küreler Oluşturma (daha karmaşık bir for döngüsü) ---
print(f"\n--- 4. Spiral Düzende {num_points_on_spiral} Küre Oluşturuluyor ---")
for i in range(num_points_on_spiral):
    # Döngü ilerledikçe parametreleri hesapla
    ratio = i / max(1, (num_points_on_spiral - 1)) 
    current_angle = ratio * spiral_rotations * 2 * math.pi 
    current_radius = ratio * spiral_max_radius
    current_z_offset_for_spiral = ratio * num_points_on_spiral * spiral_height_increase 

    x_spiral = current_radius * math.cos(current_angle)
    y_spiral = current_radius * math.sin(current_angle)

    z_base_for_spiral = -40 

    spiral_sphere = (
        cq.Workplane("XY")
        .center(x_spiral, y_spiral) 
        .translate((0, 0, z_base_for_spiral + current_z_offset_for_spiral)) 
        .sphere(spiral_sphere_radius)
        .val()
    )
    
    spiral_color_val = 0.2 + 0.8 * ratio 
    assy.add(spiral_sphere, name=f"SpiralSphere_{i}", color=cq.Color(spiral_color_val, 0.3, 1 - spiral_color_val)) # Sadece bu satır kalmalı.

# --- Taban Plakası (Tüm desenleri üzerinde tutmak için) ---
print("\n--- Taban Plakası Oluşturuluyor ---")
overall_size_estimate = (circle_pattern_radius + grid_cols * grid_spacing_x) * 1.2
base_plate = (
    cq.Workplane("XY")
    .box(overall_size_estimate, overall_size_estimate, 2)
    .translate((0,0,-1 - max(cylinder_height, box_size_z, spiral_sphere_radius*2)/2 )) # Tüm nesnelerin altına
    .val()
)
assy.add(base_plate, name="BasePlate", color=cq.Color("salmon"))


# --- Montajı Dışa Aktarma ---
output_filename = "for_loop_patterns_assembly.gltf"
try:
    assy.save(output_filename)
    print(f"\nMontaj '{output_filename}' olarak başarıyla kaydedildi.")
except Exception as e:
    print(f"\nMontaj kaydedilirken hata oluştu: {e}")

# Sonuçları gösterme (CQ-editor veya Jupyter gibi bir ortamda)
if "show_object" in locals():
    show_object(assy, name="ForLoopAssembly")

print("\n--- Model Oluşturma Tamamlandı ---")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">For Döngüsü İle Çizim Yapma</h1>
  <model-viewer
    src="/models/for_loop_patterns_assembly.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Koşullar ve döngüler sayesinde modelleme süreciniz artık statik değil — parametrik, dinamik ve çok yönlü oluyor.

---

# 🧱 Montaj ve Çoklu Parça Modelleme  

Gerçek dünya tasarımları genellikle tek bir parça değil, birden fazla bileşenden oluşur. CadQuery'nin `Assembly` sınıfı sayesinde bu tür kompleks yapıları organize biçimde oluşturabilir ve görselleştirebilirsiniz.

## Temel Montaj Kavramları

Montaj işlemi, CAD tasarımınızın farklı parçalarını bir araya getirerek bir bütün oluşturmanızı sağlar. CadQuery'de montaj, aşağıdaki temel adımları içerir:

1. Parçaları oluşturma
2. Bir `Assembly` nesnesi başlatma
3. Parçaları uygun konum ve renklerle montaja ekleme
4. İsteğe bağlı olarak montajı kaydetme veya görselleştirme

### Basit Montaj Oluşturma

```python
import cadquery as cq
import math
# CadQuery ve gerekli modülleri içe aktarıldı

# ---------------------------------------------------------------------
# Ana Parametreler (Değişiklik yapmak için burayı kullanabilirsiniz)
# ---------------------------------------------------------------------

# --- Tabure Genel Ayarları ---
NUM_LEGS = 4                         # Taburede kaç ayak olacağını belirler
STOOL_TOP_DIAMETER = 280.0           # Üst yüzeyin çapı (mm)
STOOL_TOP_THICKNESS = 20.0           # Üst yüzeyin kalınlığı (mm)
LEG_PLACEMENT_RADIUS_FACTOR = 0.85   # Ayakların yerleşim yarıçapını üst yüzeye göre ayarlar

# --- Ayak Ayarları ---
LEG_HEIGHT = 350.0                   # Ayak yüksekliği
LEG_WIDTH = 30.0                     # Ayak genişliği
LEG_DEPTH = 30.0                     # Ayak derinliği
LEG_HAS_MOUNTING_HOLE = True         # Ayaklarda montaj deliği var mı?
LEG_HOLE_DIAMETER = 6.0              # Montaj deliğinin çapı
LEG_HOLE_DEPTH_FACTOR = 0.25         # Deliğin ayak yüksekliğine göre oranı
LEG_HOLE_OFFSET_X = 0.0              # Deliğin X yönündeki ofseti
LEG_HOLE_OFFSET_Y = 0.0              # Deliğin Y yönündeki ofseti

# --- Renkler ---
COLOR_TOP = cq.Color("DarkOrange")   # Üst yüzey rengi
COLOR_LEG = cq.Color("SteelBlue")    # Ayak rengi

# --- Çıktı Ayarları ---
OUTPUT_FILENAME_BASE = "parametrik_tabure"  # Dosya adı (uzantısız)

# ---------------------------------------------------------------------
# Modül 1: Parametrik Ayak (Leg) Fonksiyonu
# ---------------------------------------------------------------------
def create_leg(height, width, depth,
               has_mounting_hole=False,
               hole_diameter=5,
               hole_depth_factor=0.3,
               hole_offset_x=0,
               hole_offset_y=0):
    """Bir dikdörtgen prizma şeklinde ayak oluşturur. İsteğe bağlı olarak montaj deliği açar."""
    leg_body = cq.Workplane("XY").box(width, depth, height)  # Temel kutu şekillendirildi
    leg_body = leg_body.translate((0, 0, height / 2))  # Altı orijine hizalandı

    if has_mounting_hole:
        actual_hole_depth = height * hole_depth_factor
        leg_body = (
            leg_body.faces(">Z")
            .workplane(centerOption="CenterOfBoundBox")
            .center(hole_offset_x, hole_offset_y)
            .circle(hole_diameter / 2)
            .cutBlind(-actual_hole_depth)  # Delik kesildi
        )
    return leg_body


# ---------------------------------------------------------------------
# Modül 2: Parametrik Tabure Üstü (Stool Top) Fonksiyonu
# ---------------------------------------------------------------------
def create_stool_top(diameter, thickness):
    """Dairesel bir disk şeklinde tabure üstünü oluşturur."""
    stool_top_body = cq.Workplane("XY").circle(diameter / 2).extrude(thickness)
    return stool_top_body


# ---------------------------------------------------------------------
# Ana Program: Modülleri Kullanarak Tabure Montajı
# ---------------------------------------------------------------------

# 1. Ana parçaları oluştur
tabure_ustu_parcasi = create_stool_top(STOOL_TOP_DIAMETER, STOOL_TOP_THICKNESS)

# 2. Montajı oluştur
ana_montaj = cq.Assembly()

# 3. Tabure üstünü montaja ekle
top_z_position = LEG_HEIGHT
ana_montaj.add(
    tabure_ustu_parcasi,
    name="TabureUstu",
    loc=cq.Location(cq.Vector(0, 0, top_z_position)),
    color=COLOR_TOP
)

# 4. Ayakları dairesel olarak yerleştir ve montaja ekle
placement_radius = (STOOL_TOP_DIAMETER / 2) * LEG_PLACEMENT_RADIUS_FACTOR
angle_step_deg = 360.0 / NUM_LEGS

for i in range(NUM_LEGS):
    current_angle_deg = i * angle_step_deg
    current_angle_rad = math.radians(current_angle_deg)

    leg_x = placement_radius * math.cos(current_angle_rad)  # X konumu hesaplandı
    leg_y = placement_radius * math.sin(current_angle_rad)  # Y konumu hesaplandı

    current_leg_object = create_leg(
        height=LEG_HEIGHT,
        width=LEG_WIDTH,
        depth=LEG_DEPTH,
        has_mounting_hole=LEG_HAS_MOUNTING_HOLE,
        hole_diameter=LEG_HOLE_DIAMETER,
        hole_depth_factor=LEG_HOLE_DEPTH_FACTOR,
        hole_offset_x=LEG_HOLE_OFFSET_X,
        hole_offset_y=LEG_HOLE_OFFSET_Y
    )

    leg_orientation_deg = current_angle_deg  # Ayak, merkeze bakacak şekilde döndürülecek
    leg_location = cq.Location(
        cq.Vector(leg_x, leg_y, 0),
        cq.Vector(0, 0, 1),
        leg_orientation_deg
    )

    ana_montaj.add(
        current_leg_object,
        name=f"Ayak_{i+1}",
        loc=leg_location,
        color=COLOR_LEG
    )


# ---------------------------------------------------------------------
# Sonuçları Gösterme ve Kaydetme
# ---------------------------------------------------------------------

# CQ-Editor veya benzeri bir ortamda sonucu göster
if 'show_object' in locals() or 'show_object' in globals():
    show_object(ana_montaj, name="Parametrik Tabure Montajı")
else:
    print("show_object fonksiyonu bulunamadı. Muhtemelen CQ-Editor dışında çalıştırılıyor.")
    print("Montaj oluşturuldu ve belirtilen formatlarda kaydedilecek.")

# --- GLTF Formatında Kaydetme ---
gltf_dosya_adi = f"{OUTPUT_FILENAME_BASE}.gltf"
print(f"\nMontaj GLTF formatında kaydediliyor: {gltf_dosya_adi}")
try:
    ana_montaj.save(gltf_dosya_adi)
    print(f"'{gltf_dosya_adi}' başarıyla kaydedildi.")
    print("Bu dosyayı https://gltf-viewer.donmccurdy.com/  gibi bir GLTF görüntüleyicide açabilirsiniz.")
except Exception as e:
    print(f"GLTF kaydetme sırasında bir hata oluştu: {e}")
    print("Lütfen CadQuery'nin (sürüm 2.2+) ve bağımlılıklarının (trimesh, pygltf) doğru kurulduğundan emin olun.")
    print("Kurulum için: pip install cadquery trimesh pygltf")

# --- İsteğe Bağlı: STEP Formatında Kaydetme ---
step_dosya_adi = f"{OUTPUT_FILENAME_BASE}.step"
print(f"\nMontaj STEP formatında kaydediliyor: {step_dosya_adi}")
try:
    ana_montaj.save(step_dosya_adi, export_edges=True)
    print(f"'{step_dosya_adi}' başarıyla kaydedildi.")
except Exception as e:
    print(f"STEP kaydetme sırasında bir hata oluştu: {e}")

print("\nTüm işlemler tamamlandı.")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Montaj Örneği</h1>
  <model-viewer
    src="/models/parametrik_tabure.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte, CadQuery ile parametrik bir tabure tasarladık. Üst yüzey ve ayakları ayrı fonksiyonlarda oluşturup, Assembly ile montajladık. Sonucu GLTF ve STEP formatlarında dışa aktararak CAD ve 3D görüntüleme araçlarıyla uyumlu hale getirdik.

## Fonksiyonlarla Modüler Tasarım

Karmaşık montajlarda, her parçayı ayrı bir fonksiyonda tanımlamak kodunuzu daha okunabilir ve yeniden kullanılabilir hale getirir:

```python
import cadquery as cq
from math import sin, cos, pi
from cadquery import Face, Shell, Solid

# --- GEOMETRİ OLUŞTURMA FONKSİYONLARI ---

def helis_olustur(ana_yaricap, radyal_sapma, adim, yukseklik, z_sapmasi=0, gecis_orani=1e-1):
    """
    Yumuşak başlangıç/bitişli helis eğrisi oluşturur.
    ana_yaricap: Helisin temel yarıçapı.
    radyal_sapma: Helis boyunca yarıçapa eklenecek/çıkarılacak miktar (diş yüksekliği için).
    adim: Vida adımı.
    yukseklik: Helisin toplam Z yüksekliği.
    z_sapmasi: Helisin başlangıç/bitişindeki Z ekseni boyunca yumuşatma miktarı.
    gecis_orani: Yumuşak geçişin toplam yüksekliğe oranı.
    """
    if gecis_orani == 0: gecis_orani = 1e-9
    def fonksiyon(t): # t: 0.0 ile 1.0 arasında parametre
        t = max(0.0, min(1.0, t))
        anlik_z_sapmasi, anlik_r_sapmasi = 0, 0
        if t > gecis_orani and t < 1 - gecis_orani: # Orta kısım
            anlik_z_sapmasi, anlik_r_sapmasi = z_sapmasi, radyal_sapma
        elif t <= gecis_orani: # Başlangıç geçişi
            faktor = sin(pi / 2 * t / gecis_orani)
            anlik_z_sapmasi, anlik_r_sapmasi = z_sapmasi * faktor, radyal_sapma * faktor
        else: # Bitiş geçişi
            t_ussu = max(0.0, min(1.0, (t - (1 - gecis_orani)) / gecis_orani))
            faktor = sin(pi / 2 * (1 - t_ussu))
            anlik_z_sapmasi, anlik_r_sapmasi = z_sapmasi * faktor, radyal_sapma * faktor
        
        z_degeri = yukseklik * t + anlik_z_sapmasi
        r_degeri = ana_yaricap + anlik_r_sapmasi
        aci_radyan = 0 if adim == 0 or yukseklik == 0 else 2 * pi / (adim / yukseklik) * t
        x = r_degeri * sin(-aci_radyan)
        y = r_degeri * cos(aci_radyan)
        return x, y, z_degeri
    return fonksiyon

def yiv_katisi_olustur(temel_yaricap, adim, yukseklik, z_gecis_sapmasi, radyal_kalinlik_sapmasi, 
                       segment_sayisi_N=100, maks_derece=3, yumusatma_tipi=None):
    """
    Helisel diş geometrisi (katı model) oluşturur.
    temel_yaricap: Dişin başladığı temel yarıçap.
    radyal_kalinlik_sapmasi: Dişin radyal kalınlığı/derinliği.
                               Pozitif: dışa doğru (vida). Negatif: içe doğru (somun/delik).
    Diğer parametreler 'helis_olustur' ve CadQuery'ye özgüdür.
    """
    # Dişin iç (veya dış) yüzeyini oluşturan helisler
    kenar1_alt = cq.Workplane("XY").parametricCurve(helis_olustur(temel_yaricap, 0, adim, yukseklik, -z_gecis_sapmasi), N=segment_sayisi_N, maxDeg=maks_derece, smoothing=yumusatma_tipi).val()
    kenar1_ust = cq.Workplane("XY").parametricCurve(helis_olustur(temel_yaricap, 0, adim, yukseklik, z_gecis_sapmasi), N=segment_sayisi_N, maxDeg=maks_derece, smoothing=yumusatma_tipi).val()
    
    # Dişin dış (veya iç) yüzeyini oluşturan helisler
    # radyal_kalinlik_sapmasi, temel_yaricap'a göre dişin ne kadar dışa/içe uzanacağını belirler.
    kenar2_alt = cq.Workplane("XY").parametricCurve(helis_olustur(temel_yaricap, radyal_kalinlik_sapmasi, adim, yukseklik, -z_gecis_sapmasi / 10), N=segment_sayisi_N, maxDeg=maks_derece, smoothing=yumusatma_tipi).val()
    kenar2_ust = cq.Workplane("XY").parametricCurve(helis_olustur(temel_yaricap, radyal_kalinlik_sapmasi, adim, yukseklik, z_gecis_sapmasi / 10), N=segment_sayisi_N, maxDeg=maks_derece, smoothing=yumusatma_tipi).val()

    if not all([kenar1_alt, kenar1_ust, kenar2_alt, kenar2_ust]):
        print("HATA: Dişli kenarlarından biri oluşturulamadı.")
        return None
    
    # Kenarlardan yüzeyler oluştur
    yuzey_temel_silindir = Face.makeRuledSurface(kenar1_alt, kenar1_ust)
    yuzey_sapma_silindir = Face.makeRuledSurface(kenar2_alt, kenar2_ust)
    yuzey_alt_kapak = Face.makeRuledSurface(kenar1_alt, kenar2_alt)
    yuzey_ust_kapak = Face.makeRuledSurface(kenar1_ust, kenar2_ust)
    
    kabuk_yuzeyleri = [yuzey_temel_silindir, yuzey_sapma_silindir, yuzey_alt_kapak, yuzey_ust_kapak]
    kabuk = Shell.makeShell(kabuk_yuzeyleri)

    if not kabuk.isValid():
        print("HATA: Dişli için oluşturulan kabuk geçerli değil.")
        return None
        
    try:
        yiv_katisi = Solid.makeSolid(kabuk)
    except Exception as e:
        print(f"HATA: Dişli katısı oluşturulurken (Solid.makeSolid): {e}")
        return None

    if not yiv_katisi.isValid():
        print("HATA: Dişli için oluşturulan katı geçerli değil.")
        return None
    return cq.Workplane(obj=yiv_katisi)

# --- TASARIM PARAMETRELERİ ---

# Vida Özellikleri
vida_adim = 1.5                # Vida adımı
vida_govde_uzunlugu = 20       # Vida gövde uzunluğu
vida_dis_dibi_yaricapi = 5     # Vida diş dibi yarıçapı (minor radius)
vida_dis_yuksekligi = 1.0      # Dişin radyal yüksekliği (kök yarıçapından dışa doğru)
vida_dis_ucu_yaricapi = vida_dis_dibi_yaricapi + vida_dis_yuksekligi # Vida diş ucu yarıçapı (major radius)
vida_cekirdek_yaricapi = vida_dis_dibi_yaricapi - 0.1 # Vida çekirdek yarıçapı (hafif içerde)
yiv_z_gecis_mesafesi = 0.4      # Dişlerin Z ekseninde başlangıç/bitiş yumuşatma mesafesi

# Vida Başı Özellikleri
baslik_yuksekligi = 4
baslik_cap_katsayisi = 2.5 # Diş tepe çapına göre başlık çapı faktörü
baslik_capi = vida_dis_ucu_yaricapi * baslik_cap_katsayisi
altigen_kenar_sayisi = 6

# Plaka Özellikleri
plaka_genisligi = 60
plaka_derinligi = 60
plaka_kalinligi = 10
# Plakanın üst yüzeyinin Z konumu (vida başlığından biraz aşağıda)
plaka_ust_z_konumu = -(baslik_yuksekligi + 5) 
delik_merkez_x, delik_merkez_y = 0, 0

# İç Diş (Plakadaki Yivli Delik) Özellikleri (Vida ile eşleşmeli)
ic_yiv_anma_yaricapi = vida_dis_ucu_yaricapi # İç dişin tepe yarıçapı (deliğin ilk açılacağı yarıçap)
ic_yiv_derinligi = vida_dis_yuksekligi        # İç dişin radyal derinliği
# Yivlerin plaka boyunca tam oluşması için biraz paylı uzunluk
ic_yiv_uzunlugu = plaka_kalinligi + vida_adim * 0.5 

# --- 1. VİDA OLUŞTURMA ---
print("1. Vida oluşturuluyor...")

# Dış vida dişleri (pozitif radyal_kalinlik_sapmasi)
vida_disleri_wp = yiv_katisi_olustur(
    temel_yaricap=vida_dis_dibi_yaricapi,
    adim=vida_adim,
    yukseklik=vida_govde_uzunlugu,
    z_gecis_sapmasi=yiv_z_gecis_mesafesi,
    radyal_kalinlik_sapmasi=vida_dis_yuksekligi, # Pozitif: dışa doğru diş
    segment_sayisi_N=100
)

# Vida silindirik çekirdeği
vida_cekirdegi_wp = cq.Workplane("XY").circle(vida_cekirdek_yaricapi).extrude(vida_govde_uzunlugu)

# Diş ve çekirdeği birleştir
vida_govdesi_ve_disleri_wp = None
if vida_disleri_wp and vida_cekirdegi_wp:
    try:
        # union daha hızlı, fuse daha toleranslı
        vida_govdesi_ve_disleri_wp = vida_disleri_wp.union(vida_cekirdegi_wp.val())
        if not vida_govdesi_ve_disleri_wp.val().isValid():
            vida_govdesi_ve_disleri_wp = vida_disleri_wp.fuse(vida_cekirdegi_wp.val(), tol=1e-3)
    except Exception as e:
        print(f"HATA: Vida gövdesi ve diş birleştirilemedi: {e}")
if not (vida_govdesi_ve_disleri_wp and vida_govdesi_ve_disleri_wp.val().isValid()):
    print("HATA: Vida gövde+diş oluşturma başarısız.")
    exit()

# Vida başlığı
vida_basligi_wp = (
    cq.Workplane("XY")
    .polygon(altigen_kenar_sayisi, baslik_capi) # 2. argüman: köşeler arası dış çap
    .extrude(baslik_yuksekligi)
    .translate((0, 0, vida_govde_uzunlugu))
)

# Tam vida (gövde+diş+başlık)
tam_vida_wp = None
try:
    tam_vida_wp = vida_govdesi_ve_disleri_wp.union(vida_basligi_wp.val())
    if not tam_vida_wp.val().isValid():
        tam_vida_wp = vida_govdesi_ve_disleri_wp.fuse(vida_basligi_wp.val(), tol=1e-3)
except Exception as e:
    print(f"HATA: Vida başlığı birleştirilemedi: {e}")

if not (tam_vida_wp and tam_vida_wp.val().isValid()):
    print("HATA: Tam vida oluşturma başarısız.")
    exit()
print("Vida başarıyla oluşturuldu.")

# --- 2. PLAKA VE YİVLİ DELİK OLUŞTURMA ---
print("\n2. Plaka ve yivli delik oluşturuluyor...")

# Temel plaka
plaka_temel_wp = (
    cq.Workplane("XY")
    .box(plaka_genisligi, plaka_derinligi, plaka_kalinligi)
    .translate((delik_merkez_x, delik_merkez_y, plaka_ust_z_konumu - plaka_kalinligi / 2))
)

# Plakaya, iç yivin en dış çapında (anma yarıçapı) bir ön delik aç
# Bu, iç yivlerin ekleneceği temel boşluğu oluşturur.
plaka_delikli_wp = (
    plaka_temel_wp
    .faces(">Z[0]") # Plakanın üst yüzeyini seç (>Z[0] en üstteki Z-yönlü yüzey)
    .workplane(centerOption="CenterOfBoundBox") # Yüzey merkezine çalışma düzlemi
    .moveTo(0, 0) # Çalışma düzlemi zaten plakanın delik merkezinde olmalı
    .hole(diameter=ic_yiv_anma_yaricapi * 2, depth=plaka_kalinligi + vida_adim) # Delik çapı, biraz taşsın
)
# Not: Plaka (delik_merkez_x, delik_merkez_y, Z) merkezli olduğu için,
# .faces(">Z[0]").workplane() ile oluşturulan çalışma düzleminin merkezi de (0,0) olacaktır.
# Eğer delik_merkez_x veya delik_merkez_y sıfırdan farklı olsaydı, moveTo(0,0) yine doğru olurdu
# çünkü workplane zaten o X,Y koordinatlarına göre konumlanmış olurdu.

# İç yivleri oluştur (negatif radyal_kalinlik_sapmasi ile içe doğru)
ic_yivler_wp = yiv_katisi_olustur(
    temel_yaricap=ic_yiv_anma_yaricapi, # Dişler bu yarıçaptan içeri doğru oluşacak
    adim=vida_adim,
    yukseklik=ic_yiv_uzunlugu,
    z_gecis_sapmasi=yiv_z_gecis_mesafesi,
    radyal_kalinlik_sapmasi=-ic_yiv_derinligi, # Negatif: içe doğru diş
    segment_sayisi_N=80
)

# İç dişleri plakanın deliğiyle hizala ve birleştir
yivli_plaka_wp = None
if ic_yivler_wp and ic_yivler_wp.val().isValid():
    # Dişlerin Z=0 noktası, plakanın deliğinin alt yüzeyinin biraz altında başlamalı
    # Bu, yumuşak geçişin plaka dışında kalmasını sağlar.
    # Plakanın alt yüzey Z'si: plaka_ust_z_konumu - plaka_kalinligi
    # Dişlerin Z başlangıcı:
    ic_yivlerin_z_kaydirma_miktari = (plaka_ust_z_konumu - plaka_kalinligi) - (ic_yiv_uzunlugu - plaka_kalinligi) / 2 - vida_adim * 0.1
    
    ic_yivler_konumlandirilmis_wp = ic_yivler_wp.translate(
        (delik_merkez_x, delik_merkez_y, ic_yivlerin_z_kaydirma_miktari)
    )

    try:
        yivli_plaka_wp = plaka_delikli_wp.union(ic_yivler_konumlandirilmis_wp.val())
        if not (yivli_plaka_wp and yivli_plaka_wp.val().isValid()):
            yivli_plaka_wp = plaka_delikli_wp.fuse(ic_yivler_konumlandirilmis_wp.val(), tol=1e-3)
    except Exception as e:
        print(f"HATA: Plakaya iç dişler birleştirilemedi: {e}")
else:
    print("HATA: İç dişler oluşturulamadı.")

if not (yivli_plaka_wp and yivli_plaka_wp.val().isValid()):
    print("HATA: Yivli plaka oluşturma başarısız.")
    exit()
print("Plaka ve yivli delik başarıyla oluşturuldu.")

# --- 3. MONTAJ VE GÖSTERİM ---
print("\n3. Modeller gösteriliyor...")

montaj = cq.Assembly(name="Vida_Plaka_Montaji")
montaj.add(tam_vida_wp, name="Vida", color=cq.Color("gray"))
montaj.add(yivli_plaka_wp, name="YivliPlaka", color=cq.Color("steelBlue"))

# Ortamınızda 'show_object' varsa gösterir (örn: CQ-Editor)
if "show_object" in locals() or "show_object" in globals():
    show_object(montaj)
else:
    print("show_object fonksiyonu bulunamadı. Lütfen CadQuery destekli bir ortamda çalıştırın.")

# Montajı dışa aktar
cikti_dosya_adi = "vida_plaka_montaji.gltf"
try:
    montaj.save(cikti_dosya_adi)
    print(f"\nMontaj '{cikti_dosya_adi}' olarak başarıyla kaydedildi.")
except Exception as e:
    print(f"\nMontaj kaydedilirken hata oluştu: {e}")

print("\n--- Çalışma Tamamlandı ---")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Deliği Yivli Plaka ve Yivli Vida Örneği </h1>
  <model-viewer
    src="/models/vida_plaka_montaji.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu gelişmiş örnekte, parametreli parçalar oluşturduk ve hatta pime opsiyonel bir yiv ekledik. Parametreli parçalar, tasarımınızı kolayca değiştirmenize olanak tanır.


## Montajlarda İç İçe Yapılar

Karmaşık tasarımlarda, iç içe montajlar oluşturabilirsiniz. Bu, modüler bir yaklaşımla büyük sistemleri organize etmenize yardımcı olur:

```python
import cadquery as cq
from cadquery import Assembly, Color, Vector  # CadQuery temel modülleri

# --- Parça Oluşturma Fonksiyonları ---

def vida_olustur(uzunluk=20, govde_cap=5, bas_cap=8):
    """Vida parçası oluşturur: Gövde + başlık + üstte yuva."""
    bas_yukseklik = bas_cap / 2  # Başlığın yüksekliği çapının yarısı
    govde = cq.Workplane("XY").circle(govde_cap/2).extrude(uzunluk)  # Silindirik gövde oluşturuldu
    if govde_cap > 0:
        govde = govde.faces("<Z").chamfer(govde_cap * 0.1)  # Alt kenara pah eklendi

    # Vida başlığı oluşturuluyor
    bas_tam = (
        cq.Workplane("XY")
        .workplane(offset=uzunluk)
        .circle(bas_cap/2)
        .extrude(bas_yukseklik)
    )
    if bas_cap > 0:
        # Üst yüzeydeki tüm kenarlara pah uygula
        bas_tam = bas_tam.faces(">Z").edges().chamfer(bas_cap * 0.05)

    # Vida başlığına yuva kesiliyor (vida anahtarı için)
    yuva_derinligi = bas_yukseklik * 0.6
    yuva_kesigi = (
        cq.Workplane("XY")
        .workplane(offset=uzunluk + bas_yukseklik)
        .slot2D(bas_cap*0.7, bas_cap*0.15, angle=0)
        .extrude(-yuva_derinligi)
    )
    vida_tam = govde.union(bas_tam)  # Gövde ve başlık birleştirildi
    vida = vida_tam.cut(yuva_kesigi)  # Yuva kesilerek vida tamamlandı
    return vida


def kutu_olustur(genislik=20, derinlik=20, yukseklik=30, duvar_kalinligi=2, delik_cap=None):
    """İç boşluklu kutu oluşturur. Köşelere fillet ve isteğe bağlı üst delik."""
    dis_kutu = (
        cq.Workplane("XY")
        .box(genislik, derinlik, yukseklik)
        .edges("|Z").fillet(genislik/10)  # Dikey köşelere yuvarlatma
    )
    ic_bosluk_z_taban = -yukseklik/2 + duvar_kalinligi
    ic_bosluk_yukseklik = yukseklik - duvar_kalinligi
    ic_bosluk = (
        cq.Workplane("XY", origin=(0,0, ic_bosluk_z_taban))
        .box(genislik - 2*duvar_kalinligi,
             derinlik - 2*duvar_kalinligi,
             ic_bosluk_yukseklik,
             centered=(True, True, False))  # İç boşluk
    )
    kutu = dis_kutu.cut(ic_bosluk)  # Dış kutudan iç boşluk çıkarıldı
    if delik_cap and delik_cap > 0:
        kutu = (
            kutu.faces(">Z")
            .workplane(centerOption="CenterOfBoundBox")
            .circle(delik_cap/2)
            .cutThruAll()  # Üst yüze delik açıldı
        )
    return kutu


def baglanti_parcasi(genislik=20, derinlik=20, yukseklik=5, delik_cap_oran=0.25):
    """Bağlantı plakası oluşturur. Merkezde isteğe bağlı delik açılır."""
    parca = (
        cq.Workplane("XY")
        .box(genislik, derinlik, yukseklik)
        .edges("|Z").fillet(genislik/10)  # Köşelere yuvarlatma
    )
    delik_capi = genislik * delik_cap_oran * 2
    if delik_capi > 0:
        parca = (
            parca.faces(">Z")
            .workplane()
            .circle(delik_capi/2)
            .cutThruAll()  # Merkezde delik açıldı
        )
    return parca


def plaka_olustur(genislik=40, derinlik=40, yukseklik=10, delik_cap=None, fillet_radius=2):
    """Dikdörtgen plaka oluşturur. Köşelere fillet ve merkeze isteğe bağlı delik."""
    plaka = cq.Workplane("XY").box(genislik, derinlik, yukseklik)  # Temel kutu
    if fillet_radius > 0:
        plaka = plaka.edges("|Z").fillet(fillet_radius)  # Dikey kenarlara yuvarlatma

    if delik_cap and delik_cap > 0:
        plaka = (
            plaka.faces(">Z")  # Üst yüz seçildi
            .workplane(centerOption="CenterOfBoundBox")
            .circle(delik_cap/2)
            .cutThruAll()  # Delik kesimi
        )
    return plaka


# --- Ölçüler ve Parametreler ---
delik_serbest_payi = 0.3  # Delikler için serbestlik payı

# Yan Grup Kutu ve Bağlantı Ölçüleri
kutu_genislik_yan = 40
kutu_derinlik_yan = 40
kutu_yukseklik_yan = 30
kutu_duvar_kalinligi_yan = 3
baglanti_kalinlik_yan = 5

# Yan Grup Vida Ölçüleri
vida_govde_cap_yan = 5
vida_bas_cap_yan = 8
vida_uzunluk_yan = kutu_yukseklik_yan - kutu_duvar_kalinligi_yan + baglanti_kalinlik_yan - 5

# Orta Grup Vida Ölçüleri
orta_vida_govde_cap = 10
orta_vida_bas_cap = 16
orta_vida_uzunluk = 20  # Plakadan geçecek uzunluk

# Orta Taban Plaka Ölçüleri
orta_taban_genislik = kutu_genislik_yan
orta_taban_derinlik = kutu_derinlik_yan
orta_taban_yukseklik = 12
orta_taban_fillet = orta_taban_yukseklik / 4
orta_taban_delik_cap = orta_vida_govde_cap + delik_serbest_payi  # Vida için delik


# --- Montaj İşlemleri ---

# Ana montaj nesnesi oluşturuldu
ana_montaj = Assembly(name="AnaMontaj")

# Yan grup parçaları oluşturuldu
yesil_kutu_sag = kutu_olustur(kutu_genislik_yan, kutu_derinlik_yan, kutu_yukseklik_yan, kutu_duvar_kalinligi_yan,
                               delik_cap=vida_govde_cap_yan + delik_serbest_payi)
kahverengi_parca_sol = baglanti_parcasi(kutu_genislik_yan, kutu_derinlik_yan, baglanti_kalinlik_yan,
                                        delik_cap_oran=(vida_govde_cap_yan + delik_serbest_payi)/(2*kutu_genislik_yan))
vida_sol = vida_olustur(vida_uzunluk_yan, govde_cap=vida_govde_cap_yan, bas_cap=vida_bas_cap_yan)
vida_sag = vida_olustur(vida_uzunluk_yan, govde_cap=vida_govde_cap_yan, bas_cap=vida_bas_cap_yan)

# Orta grup parçaları oluşturuldu
orta_taban_plakasi = plaka_olustur(
    genislik=orta_taban_genislik,
    derinlik=orta_taban_derinlik,
    yukseklik=orta_taban_yukseklik,
    delik_cap=orta_taban_delik_cap,
    fillet_radius=orta_taban_fillet
)
sari_vida_orta = vida_olustur(
    uzunluk=orta_vida_uzunluk,
    govde_cap=orta_vida_govde_cap,
    bas_cap=orta_vida_bas_cap
)


# Orta grubu oluştur
orta_montaj = Assembly(name="OrtaGrup_Vida")
z_konum_orta_taban = orta_taban_yukseklik / 2
orta_montaj.add(orta_taban_plakasi, name="orta_taban", color=Color(0.6, 0.6, 0.8),
                loc=cq.Location(Vector(0, 0, z_konum_orta_taban)))
orta_taban_ust_yuzey_z = z_konum_orta_taban + (orta_taban_yukseklik / 2)

z_konum_sari_vida_orta = orta_taban_ust_yuzey_z - orta_vida_uzunluk
orta_montaj.add(sari_vida_orta, name="sari_vida_orta", color=Color(1.0, 0.8, 0.0),
                loc=cq.Location(Vector(0, 0, z_konum_sari_vida_orta)))


# Sol ve Sağ gruplar oluşturuldu
yan_grup_mesafe_x = orta_taban_genislik * 0.8 + kutu_genislik_yan * 0.5

# Sol grup: kahverengi bağlantı + vida
sol_montaj = Assembly(name="SolGrup")
z_konum_sol_kahverengi = baglanti_kalinlik_yan / 2
sol_montaj.add(kahverengi_parca_sol, name="sol_kahverengi", color=Color(0.6, 0.3, 0.2),
               loc=cq.Location(Vector(0, 0, z_konum_sol_kahverengi)))
sol_parca_ust_yuzey_z = z_konum_sol_kahverengi + (baglanti_kalinlik_yan / 2)
vida_z_konum_sol = sol_parca_ust_yuzey_z - vida_uzunluk_yan
sol_montaj.add(vida_sol, name="sol_vida", color=Color(0.9, 0.9, 0.9),
               loc=cq.Location(Vector(0, 0, vida_z_konum_sol)))

# Sağ grup: yeşil kutu + vida
sag_montaj = Assembly(name="SagGrup")
z_konum_sag_yesil = kutu_yukseklik_yan / 2
sag_montaj.add(yesil_kutu_sag, name="sag_yesil", color=Color(0.2, 0.8, 0.2),
               loc=cq.Location(Vector(0, 0, z_konum_sag_yesil)))
sag_parca_ust_yuzey_z = z_konum_sag_yesil + (kutu_yukseklik_yan / 2)
vida_z_konum_sag = sag_parca_ust_yuzey_z - vida_uzunluk_yan
sag_montaj.add(vida_sag, name="sag_vida", color=Color(0.9, 0.9, 0.9),
               loc=cq.Location(Vector(0, 0, vida_z_konum_sag)))

# Ana montaja gruplar eklendi
ana_montaj.add(orta_montaj, name="orta_grup", loc=cq.Location(Vector(0, 0, 0)))
ana_montaj.add(sol_montaj, name="sol_grup", loc=cq.Location(Vector(-yan_grup_mesafe_x, 0, 0)))
ana_montaj.add(sag_montaj, name="sag_grup", loc=cq.Location(Vector(yan_grup_mesafe_x, 0, 0)))

# GLTF formatında kaydet
dosya_adi = "kompleks_montaj_orta_vida.gltf"
ana_montaj.save(dosya_adi)

# Görüntüleme komutları
if "show_object" in locals():
    show_object(ana_montaj)
elif "display" in get_ipython().kernel.shell_handlers:
    display(ana_montaj)

print(f"Montaj '{dosya_adi}' olarak kaydedildi.")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Kompleks Montajlama Örneği</h1>
  <model-viewer
    src="/models/kompleks_montaj_orta_vida.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte, üç farklı alt montaj (sol grup, sağ grup ve orta grup) oluşturduk ve bunları ana montaj içinde belirli konumlara yerleştirdik. Bu yapıyla, karmaşık sistemlerde parça yönetimi ve konumlandırma daha anlaşılır ve modüler hale getirildi.

## Mate (Eşleştirme) Sistemleri

CadQuery ayrıca, parçaları birbirine göre belirli kısıtlamalarla konumlandırmanıza olanak tanıyan 'mate' sistemlerini destekler:

```python
# CadQuery kütüphanesini içe aktarıyoruz.
import cadquery as cq

# Kutu için sabit boyutları tanımlıyoruz:
KUTU_GEN = 60     # Genişlik (X ekseni)
KUTU_DER = 40     # Derinlik (Y ekseni)
KUTU_YUK = 30     # Yükseklik (Z ekseni)
DUVAR_KALIN = 2   # Kutunun duvar kalınlığı
KAPAK_KALINLIK = 4  # Kapak kalınlığı

def kutu_olustur():
    """
    Dış kutuyu oluşturur ve iç kısmını oyarak boşluk bırakır (kutunun içi boşaltılır).
    - Box (dikdörtgen prizma) oluşturulur.
    - Üst yüzeyden (z>0) başlayarak içe doğru shell (kabuk) uygulanır.
    - Böylece bir "kutu" modeli elde edilir.
    """
    dis = cq.Workplane("XY").box(KUTU_GEN, KUTU_DER, KUTU_YUK, centered=(True, True, False))
    # Yukarıdaki satırda:
    # - Workplane: XY düzleminde çalışıyoruz (taban düzlemi)
    # - box(): belirtilen boyutlarda bir dikdörtgenler prizması oluşturur
    # - centered: X ve Y ekseninde merkeze göre konumlandırma, Z'de ise alt kenar sıfıra oturur

    ic = dis.faces(">Z").shell(-DUVAR_KALIN)
    # shell() fonksiyonu ile sadece üst yüzeyden (">Z") başlayarak içe doğru kabuk yapıyoruz
    # Bu işlem kutunun içini boşaltır ama tabanı hariç tüm yüzleri kalınlıklı tutar
    return ic

def kapak_olustur():
    """
    Sadece tek parça bir kapak oluşturur.
    - Boyutları kutuya uyacak şekilde aynıdır, sadece yükseklik farklıdır.
    """
    kapak = cq.Workplane("XY").box(KUTU_GEN, KUTU_DER, KAPAK_KALINLIK, centered=(True, True, False))
    # Kapak da kutu gibi oluşturulur ama daha kalın olabilir (örneğimizde 4 mm)
    return kapak

def montaj_olustur():
    """
    Kutu ve kapak parçalarını birleştirerek bir montaj oluşturur.
    - Her iki parçayı ayrı ayrı ekler.
    - Yüzeyleri kullanarak aralarında bir "Plane" tipinde hizalama yapar.
    """

    kutu = kutu_olustur()
    kapak = kapak_olustur()

    # Montaj nesnesi oluşturuyoruz
    asm = cq.Assembly()

    # Parçaları montaja ekliyoruz:
    asm.add(kutu, name="kutu", color=cq.Color("skyblue"))  # Kutuya mavi tonu veriyoruz
    asm.add(kapak, name="kapak", color=cq.Color("orange"))  # Kapağa turuncu renk veriyoruz

    # HIZALAMA / MATE (Tasarım kısıtlaması):
    # - "kutu@faces@>Z": kutunun üst yüzeyi (yukarı bakan yüzey)
    # - "kapak@faces@<Z": kapağın alt yüzeyi (aşağı bakan yüzey)
    # - "Plane": bu iki yüzey aynı düzlemde olsun demektir (temas ve düzlemsel hizalama)
    asm.constrain("kutu@faces@>Z", "kapak@faces@<Z", "Plane")

    # Kısıtlamalara göre pozisyonları çözüyoruz:
    asm.solve()

    return asm

# Montajı oluşturuyoruz:
montaj = montaj_olustur()

# CQ-Editor'de göstermek için özel komut (CadQuery GUI aracı için)
show_object(montaj)

# Modeli GLTF formatında dışa aktarıyoruz (WebGL uyumlu 3D format)
montaj.save("mate_sistemi_ornegi.gltf")

# Eğer show_object mevcutsa tekrar göster (bazı ortamlarda gerekli olabilir)
if "show_object" in locals():
    show_object(montaj)

# Kullanıcıya bilgi veriyoruz:
print("Montaj 'mate_sistemi_ornegi.gltf' olarak kaydedildi.")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Eşleştirme Örneği</h1>
  <model-viewer
    src="/models/mate_sistemi_ornegi.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine cep açılmış ve etiketlenmiş ön yüzeyinden çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

Bu örnekte, `constrain` metodu ile kapak ve kutu arasında bir düzlem kısıtlaması (Plane constraint) uyguladık. `solve()` metodunu çağırarak kısıtlamaların gerçekleştirilmesini sağladık.

## Pratik İpuçları

### Montaj Performansını İyileştirme

Karmaşık montajlarda performansı artırmak için bazı ipuçları:

1. Detay seviyesini dengelemek için `tolerance` parametresini kullanın
2. Çok fazla parçadan oluşan montajları alt montajlar halinde organize edin
3. Gereksiz yüksek hassasiyetten kaçının

### Montajları Dışa Aktarma

CadQuery ile montajlarınızı çeşitli formatlarda dışa aktarabilirsiniz:

```python
# STEP formatında dışa aktarma (endüstri standardı)
montaj.save("montaj_dosyasi.step")

# GLTF formatında dışa aktarma (web ve 3D görselleştirme için)
montaj.save("montaj_dosyasi.gltf")

# STL formatında dışa aktarma (3D baskı için)
# Not: STL formatı assembly'yi desteklemez, parçaları ayrı ayrı kaydetmeniz gerekir
cq.exporters.export(montaj.toCompound(), "montaj_compound.stl")
```

### Renk Tanımlamaları

Renkleri çeşitli şekillerde tanımlayabilirsiniz:

```python
# İsimle renk tanımlama
renk1 = Color("red")
renk2 = Color("steelblue")

# RGB değerleriyle renk tanımlama (0-1 aralığında)
renk3 = Color(0.2, 0.5, 0.8)       # Mavi tonu
renk4 = Color(0.8, 0.3, 0.3)       # Kırmızı tonu

# RGBA değerleriyle renk tanımlama (şeffaflık dahil)
renk5 = Color(0.2, 0.5, 0.8, 0.7)  # %70 opak mavi
```

---

## 📐 Parametrik Dizi Oluşturma (Arrays)  
Tekrarlayan yapılar, plakalardaki delik sıraları, dişliler ya da ısı emici kanatçıklar gibi öğeleri manuel olarak modellemek hem zaman alır hem de hataya açıktır. `eachpoint()` ve `pushPoints()` gibi yöntemlerle dizi oluşturmak, bu işi kolaylaştırır.

### `pushPoints()` ile Nokta Dizisi
```python
import cadquery as cq

# Ana plaka (taban) oluştur: 60x40 mm yüzey alanı, 20 mm kalınlık
taban = cq.Workplane("XY").box(60, 40, 20)

# 3x2 grid oluştur: x ekseninde -20, 0, 20 / y ekseninde -10, 10
grid_points = [
    (x, y) for x in [-20, 0, 20] for y in [-10, 10]
]

# Tabanın üst yüzeyinde çalış, her noktaya silindirik çıkıntı ekle
model = (
    taban.faces(">Z")         # Üst yüzeye geç
    .workplane()              # O yüzeyde yeni bir iş düzlemi başlat
    .pushPoints(grid_points) # Belirlenen noktalara sırayla geç
    .circle(4)                # Her noktada 4 mm yarıçaplı daire çiz
    .extrude(10)              # Daireleri yukarı 10 mm yükselterek silindire çevir
)

# Montaj nesnesi oluştur (görsel gruplama ve çıktı için)
montaj = cq.Assembly(name="pushPoints örneği")
montaj.add(model, name="plaka_üzerinde silindir", color=cq.Color("gray"))

# Modeli görüntüle
show_object(montaj)

# Montajı .gltf formatında dosyaya kaydet (ör. 3D görüntüleme veya paylaşım için)
montaj.save("pushPoints_ornegi.gltf")

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">pushPoints Örneği</h1>
  <model-viewer
    src="/models/pushPoints_ornegi.gltf"
    alt="Bir kutunun etiketlenmiş üst yüzeyine grid oluşturulmuş ve her bir noktadan çıkıntı oluşturulmuş model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

### `eachpoint()` ile Dinamik Dizi
```python
import cadquery as cq

# 📏 1. Taban plakası ölçüleri
plaka_genisligi = 100
plaka_uzunlugu = 80
plaka_kalinligi = 10

# 📌 2. Pim verileri: (x, y, yarıçap, yükseklik)
pim_verileri = [
    (-30, 20, 5, 15),
    (0, 25, 8, 10),
    (30, 20, 5, 15),
    (-20, -15, 4, 20),
    (20, -15, 4, 20),
    (0, -20, 6, 12)
]

# 🧱 3. Taban plakası oluştur
taban_plakasi = cq.Workplane("XY").box(plaka_genisligi, plaka_uzunlugu, plaka_kalinligi)

# 📍 4. Pim konumlarını (Location) hazırla
pim_konumlari_cq = [
    cq.Location(cq.Vector(x, y, plaka_kalinligi / 2)) for x, y, r, h in pim_verileri
]

# 🔄 5. eachpoint için callback fonksiyonu
current_pim_index = 0

def callback_ile_pim_olustur(loc):
    global current_pim_index
    if current_pim_index >= len(pim_verileri):
        return None

    x, y, r, h = pim_verileri[current_pim_index]
    current_pim_index += 1

    # Pim şeklini oluştur ve konuma yerleştir
    return (
        cq.Workplane("XY")
        .circle(r)
        .extrude(h)
        .val()
        .located(loc)
    )

# 🔁 6. Pimleri oluştur
current_pim_index = 0
pimler_wp = (
    cq.Workplane("XY")
    .pushPoints(pim_konumlari_cq)
    .eachpoint(callback_ile_pim_olustur, useLocalCoordinates=False)
)

# ➕ 7. Taban ile pimleri birleştir
gecerli_pimler = [obj for obj in pimler_wp.objects if obj is not None]
son_montaj_objesi = (
    taban_plakasi.union(cq.Compound.makeCompound(gecerli_pimler))
    if gecerli_pimler else taban_plakasi
)

# 📦 8. Montaj oluştur ve göster
montaj = cq.Assembly(name="eachpoint_montaj")
montaj.add(son_montaj_objesi, name="plaka_ve_pimler", color=cq.Color("gray"))

show_object(montaj)

# 💾 9. GLTF olarak kaydet
montaj.save("eachpoint_montaj.gltf")

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">eachpoint Örneği</h1>
  <model-viewer
    src="/models/eachpoint_montaj.gltf"
    alt="Bir taban plakasının üst yüzeyine farklı yarıçap ve yüksekliklerde pimler yerleştirilmiş 3B model."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color: rgb(245, 246, 243);" />
</Layout>


Dizi komutlarıyla aynı yapıyı çok hızlı ve tutarlı şekilde çoğaltabilirsiniz. Bu özellikle üretim mühendisliği ve prototipleme süreçlerinde çok faydalıdır.

---

## 💎 Ayna Görüntüsü ve Simetri Uygulamaları (`mirror()`)

Simetri, tasarımlarda hem estetik bir denge hem de fonksiyonel verimlilik sağlar. CadQuery'deki `mirror()` metodu, seçili Çalışma Düzlemi (Workplane) üzerindeki katıların (Solid) veya 2D şekillerin (Face, Wire) bir ayna düzlemine göre simetrisini almanızı sağlar. Bu, özellikle simetrik parçaların yarısını tasarlayıp diğer yarısını otomatik olarak oluşturmak için idealdir.

**Temel Kullanım:**

`mirror()` metodu genellikle iki ana argüman alır:

1.  `mirrorPlane`: Aynalamanın yapılacağı düzlemi belirtir.
    *   **Hazır Düzlemler:** `"XY"`, `"YZ"`, `"XZ"` gibi string ifadelerle global eksen düzlemleri seçilebilir.
    *   **Bir Yüzey (Face):** Mevcut bir katının yüzeyi ayna düzlemi olarak kullanılabilir.
    *   **Özel `cq.Plane` Nesnesi:** `cq.Plane(origin=(x,y,z), normal=(nx,ny,nz))` ile özel bir ayna düzlemi tanımlanabilir.
2.  `basePointVector` (isteğe bağlı): Ayna düzleminin üzerinde bulunduğu bir noktayı belirtir. Eğer `mirrorPlane` string ifadelerle (`"XY"`, `"YZ"`, `"XZ"`) veriliyorsa, bu nokta varsayılan olarak `(0,0,0)` kabul edilir. Eğer bir `Face` veya normal vektörüyle tanımlanmış `cq.Plane` kullanılıyorsa, bu parametre genellikle gereksizdir veya düzlemin konumunu netleştirmek için kullanılabilir.

**Davranış:** `mirror()` komutu, Çalışma Düzlemi yığınındaki mevcut katıyı/şekli, aynalanmış versiyonuyla **değiştirir**. Orijinali ve aynalanmış kopyayı bir arada tutmak istiyorsanız, orijinali bir değişkende saklamanız veya `union()` gibi bir komutla birleştirmeniz gerekir.

---

### Örnek 1: Basit Bir Parçanın Yarısını Tasarlayıp Tamamlama

Simetrik bir "L" braket oluşturalım. Önce yarısını tasarlayıp sonra aynalayarak tamamlayacağız.

```python
import cadquery as cq

# 🔷 1. Yarım L-braket (X pozitif taraf)
yarim = (
    cq.Workplane("XY")
    .hLine(30).vLine(10).hLineTo(10).vLineTo(40).hLineTo(0)
    .close()
    .extrude(5)
)

# 🔁 2. X=0 düzlemine göre (YZ) aynala
ayna = yarim.mirror("YZ")

# 🔗 3. Birleştir → Tam braket
braket = cq.Workplane().add(yarim.val()).add(ayna.val())

# 🧱 4. Montaj objesi
montaj = cq.Assembly(name="simetrik_braket")
montaj.add(braket, name="braket", color=cq.Color("steelblue"))

# 🖥️ 5. Gösterim (CQ-Editor için)
show_object(montaj)

# 💾 6. Dışa aktar (gltf)
montaj.save("simetrik_braket.gltf")

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Simetrik L Braket</h1>
  <model-viewer
    src="/models/simetrik_braket.gltf"
    alt="Simetrik olarak aynalanmış L şeklinde braket modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color: rgb(245, 246, 243);" />
</Layout>


Bu örnekte, `orijinal_yarim`'ı sakladık çünkü `mirror()` komutu `yarim_braket_wp`'yi değiştirdi.

---

### Yaygın Ayna Düzlemleri ve Etkileri:

| `mirrorPlane` | `basePointVector` (varsayılan) | Aynalama Ekseni (Sonuç) | Açıklama                                     |
|---------------|--------------------------------|-------------------------|----------------------------------------------|
| `"XY"`        | `(0,0,0)`                      | Z ekseni boyunca        | Nesneyi XY düzlemine (z=0) göre yukarı/aşağı aynalar. |
| `"YZ"`        | `(0,0,0)`                      | X ekseni boyunca        | Nesneyi YZ düzlemine (x=0) göre sağa/sola aynalar.    |
| `"XZ"`        | `(0,0,0)`                      | Y ekseni boyunca        | Nesneyi XZ düzlemine (y=0) göre öne/arkaya aynalar.   |

---

### Örnek 2: Simetrik Deliklere Sahip Plaka

Önce plakanın çeyreğini delikleriyle birlikte tasarlayıp, sonra iki kere aynalayarak tam plakayı oluşturalım.

```python
import cadquery as cq

# 🔷 1. Plaka ölçüleri
uzunluk = 60
genislik = 40
kalinlik = 6
delik_cap = 5
kenardan_uzaklik = 10

# 🔹 2. Çeyrek plaka (pozitif X ve Y)
ceyrek_wp = (
    cq.Workplane("XY")
    .box(uzunluk/2, genislik/2, kalinlik, centered=False)  # (0,0)'dan başlayarak
    .faces(">Z").workplane(origin=(0,0,0))
    .center((uzunluk/2)-kenardan_uzaklik, (genislik/2)-kenardan_uzaklik)
    .circle(delik_cap/2)
    .cutThruAll()
)

# 🔁 3. X eksenine göre aynala → yarım plaka
ceyrek = ceyrek_wp.val()
ayna_x = ceyrek_wp.mirror("YZ", (0,0,0)).val()
yarim_wp = cq.Workplane().add(ceyrek).add(ayna_x)

# 🔁 4. Y eksenine göre aynala → tam simetrik plaka
yarim = yarim_wp.val()
ayna_y = yarim_wp.mirror("XZ", (0,0,0)).val()
tam_wp = cq.Workplane().add(yarim).add(ayna_y)

# 🧱 5. Montaj olarak göster
montaj = cq.Assembly(name="simetrik_plaka")
montaj.add(tam_wp, name="plaka", color=cq.Color("steelBlue"))

show_object(montaj)

# 💾 6. .gltf olarak dışa aktar
montaj.save("simetrik_plaka.gltf")

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Simetrik Delikli Plaka</h1>
  <model-viewer
    src="/models/simetrik_plaka.gltf"
    alt="Delikleri simetrik olarak aynalanmış bir dikdörtgen plaka modeli."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color: rgb(245, 246, 243);" />
</Layout>


---

### Örnek 3: Özel Bir Ayna Düzlemi Kullanma

Bazen standart eksen düzlemleri yeterli olmaz. Örneğin, bir nesneyi 45 derecelik bir açıyla aynalamak isteyebilirsiniz.

```python
import cadquery as cq

# 🔷 1. Başlangıç nesnesi: 10x5x20 mm kutu, X yönüne 10 mm ötelenmiş
nesne_wp = (
    cq.Workplane("XY")
    .box(10, 5, 20)
    .translate((10, 0, 0))
)

# 🔁 2. Aynalama düzlemi: Orijinden geçen, normali (1,1,0) olan özel düzlem (y = -x düzlemi)
ayna_düzlemi_normali = cq.Vector(1, 1, 0)
ayna_düzlemi_noktasi = cq.Vector(0, 0, 0)

# 3. Nesneyi özel düzleme göre aynala
aynali_nesne_wp = nesne_wp.mirror(
    mirrorPlane=ayna_düzlemi_normali,
    basePointVector=ayna_düzlemi_noktasi
)

# ➕ 4. Orijinal ve aynalı nesneleri birleştir
birlesik_model = (
    cq.Workplane()
    .add(nesne_wp.val())
    .add(aynali_nesne_wp.val())
)

# 🧱 5. Montaj oluştur ve göster
montaj = cq.Assembly(name="ayna_ornek")
montaj.add(birlesik_model, name="orijinal_ve_aynali", color=cq.Color("orange"))

show_object(montaj)

# 💾 6. .gltf olarak kaydet
montaj.save("ayna_ornek.gltf")

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">mirror() Örneği</h1>
  <model-viewer
    src="/models/ayna_ornek.gltf"
    alt="Bir kutu nesnesinin özel bir düzleme göre aynalanmış hali."
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color: rgb(245, 246, 243);" />
</Layout>


---

### İpuçları ve En İyi Uygulamalar:

1.  **Simetri Merkezini Düşünün:** Tasarımınızın genel simetri merkezini (genellikle `(0,0,0)`) düşünerek başlamak, aynalama işlemlerini basitleştirir.
2.  **`basePointVector` Kullanımı:** Eğer ayna düzleminiz orijinden geçmiyorsa (örneğin, `mirrorPlane="YZ"` ama `x=10` düzlemine göre aynalamak istiyorsanız), `basePointVector=(10,0,0)` gibi bir değer kullanmanız gerekir.
3.  **Adım Adım Aynalama:** Çoklu simetriye sahip karmaşık parçalar için (Örnek 2'deki gibi), simetriyi adım adım uygulamak (önce bir eksen, sonra diğeri) daha yönetilebilirdir.
4.  **Orijinali Korumak:** `mirror()` komutu yığındaki nesneyi değiştirdiği için, orijinal nesneye daha sonra ihtiyacınız olacaksa `.val()` ile bir değişkende saklamayı unutmayın.
5.  **Kombinasyon:** Aynalama, `union()`, `cut()`, `intersect()` gibi diğer boolean operasyonlarıyla birlikte çok güçlü bir tasarım aracı haline gelir.

Aynalama, tasarım sürecinizi önemli ölçüde hızlandırabilir, tekrarlayan işleri azaltabilir ve mükemmel simetrik parçalar oluşturmanızı garanti altına alabilir. Bu komutu farklı senaryolarda deneyerek ustalaşabilirsiniz!

---

## ✅ Bölüm 4 Özeti: İleri Seviye CadQuery Yetenekleri  
Bu bölümde, CadQuery'nin gerçek gücünü ortaya koyan gelişmiş özellikleri keşfettik:

- **Selectors**: Karmaşık modellerde spesifik yüzeyleri, kenarları ve köşeleri seçebildik.
- **Workplane Manipülasyonu**: Çalışma düzlemini taşıyarak yeni perspektifler kazandık.
- **Koşullu Yapılar**: Python kontrol yapılarıyla akıllı, değişken tabanlı modeller oluşturduk.
- **Montaj Yönetimi**: `Assembly` ile çok parçalı yapıları düzenli şekilde birleştirdik.
- **Parametrik Diziler**: `pushPoints` ve `eachpoint` ile tekrarlayan yapıları hızlıca ürettik.
- **Simetri ve Aynalama**: `mirror()` ile simetrik parçalar tasarladık.

Artık modelleme becerileriniz yalnızca geometrik değil, aynı zamanda mantıklı, dinamik ve parametrik!

Bir sonraki bölümde, bu tüm araçları kullanarak gerçek bir proje yapacağız: **bir dişli kutusu tasarımı**. Hazırlanan parçaları bir araya getirecek, montaj haline sokacak ve görselleştirme yapacağız.

--- 