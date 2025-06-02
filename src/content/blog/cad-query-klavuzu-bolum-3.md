---
# Dosya Adı: src/content/blog/cad-query-klavuzu-bolum-3.md

title: 'CAD Query ile Parametrik 3D Modelleme - 🌀 Bölüm 3: İleri Seviye Modelleme Teknikleri'
description: 'CadQuery ile revolve (döndürme), sweep (süpürme), loft (profil birleştirme) gibi ileri katı modelleme tekniklerini öğrenin. Rotate ile dönüşümleri ve Assembly ile basit montajları keşfedin.'
publishDate: 2025-05-01
tags: ['cadquery', 'python', '3d modelleme', 'parametrik tasarım', 'ileri modelleme', 'revolve', 'sweep', 'loft', 'rotate', 'transformasyon', 'assembly', 'montaj', 'cadquery örnekleri', 'katı modelleme']
image:
  src: '/images/cadquery-python-3d-modeling-kapak.png'
  alt: 'CadQuery ve Python ile parametrik 3D modelleme konseptini gösteren kapak görseli'
isDraft: false

# --- Seri Bilgileri ---
part: 3
totalPages: 8
seriesSlug: 'cad-query-klavuzu'
prevPageSlug: 'cad-query-klavuzu-bolum-2'
nextPageSlug: 'cad-query-klavuzu-bolum-4'
# --- Seri Bilgileri Sonu ---
---

# 🌀 Bölüm 3: İleri Seviye Modelleme Teknikleri

Önceki bölümde CadQuery'nin temellerini, 2D eskizleri, `extrude` ile katı oluşturmayı, Boolean operasyonlarını ve kenar detaylandırmayı öğrendik. Artık elimizde sağlam bir temel var! Bu bölümde, 3D modelleme yeteneklerimizi bir üst seviyeye taşıyacak daha **ileri ve güçlü katı modelleme tekniklerine** dalıyoruz:

*   **`revolve`**: Bir 2D profili bir eksen etrafında döndürerek simetrik katılar oluşturma.
*   **`sweep`**: Bir 2D profili belirli bir 3D yol boyunca "süpürerek" karmaşık katılar oluşturma.
*   **`loft`**: Farklı Z seviyelerindeki 2D profiller arasında yumuşak geçişli katılar oluşturma.
*   **`rotate`**: Nesneleri uzayda döndürme ve hassas konumlandırma.
*   **`Assembly`**: Birden fazla parçayı bir araya getirerek basit montajlar oluşturmaya giriş.

Hazırsanız, CadQuery'nin daha sofistike araçlarıyla tanışalım ve daha karmaşık tasarımların kapısını aralayalım! 🚀

---

## 🔄 `revolve`: Profil Döndürerek Katı Oluşturma

`revolve` (döndürme), özellikle **eksenel simetriye** sahip nesneler (vazolar, şişeler, tekerlekler, flanşlar vb.) oluşturmak için son derece kullanışlı bir komuttur. Mantığı basittir:

1.  Bir **2D profil (eskiz)** çizersiniz.
2.  Bu profili döndüreceğiniz bir **eksen** belirlersiniz.
3.  Profili bu eksen etrafında belirli bir **açı** kadar (genellikle 360 derece) döndürerek katı bir cisim oluşturursunuz.

---

### 🏺 Örnek: Basit Bir Vazo Modeli

Haydi, bir vazo kesitini 2D olarak çizip **Y ekseni etrafında** 360 derece döndürerek 3D bir vazo oluşturalım. Profilimizi XY düzleminde çizeceğiz; X koordinatları vazonun yarıçapını, Y koordinatları ise yüksekliğini temsil edecek.

```python
import cadquery as cq
from cadquery import exporters

# Vazo boyutlarını tanımla
vazo_taban_yaricapi = 60    # mm cinsinden daha makul bir boyut
vazo_gövde_yaricapi = 100   # mm
vazo_boyun_yaricapi = 40    # mm
vazo_agiz_yaricapi = 50     # mm
vazo_taban_yuksekligi = 10  # mm
vazo_govde_yuksekligi = 150 # mm
vazo_boyun_yuksekligi = 80  # mm
vazo_toplam_yukseklik = vazo_taban_yuksekligi + vazo_govde_yuksekligi + vazo_boyun_yuksekligi
duvar_kalinligi = 5        # mm

# Vazonun dış eğrisini tanımlayan spline kontrol noktaları (x,y)
# x: yarıçap, y: yükseklik
spline_noktalar_dis = [
    (vazo_taban_yaricapi, vazo_taban_yuksekligi),
    (vazo_gövde_yaricapi, vazo_taban_yuksekligi + vazo_govde_yuksekligi * 0.6),
    (vazo_boyun_yaricapi, vazo_taban_yuksekligi + vazo_govde_yuksekligi),
    (vazo_agiz_yaricapi, vazo_toplam_yukseklik),
]

# Vazonun iç eğrisini tanımlayan spline kontrol noktaları (x,y)
# Dış profilden duvar kalınlığı kadar içeride
spline_noktalar_ic = [
    (vazo_agiz_yaricapi - duvar_kalinligi, vazo_toplam_yukseklik), # Ağız iç üst
    (vazo_boyun_yaricapi - duvar_kalinligi, vazo_taban_yuksekligi + vazo_govde_yuksekligi), # Boyun iç
    (vazo_gövde_yaricapi - duvar_kalinligi, vazo_taban_yuksekligi + vazo_govde_yuksekligi * 0.6), # Gövde iç
    (duvar_kalinligi, vazo_taban_yuksekligi), # Taban iç (merkeze yakın, ama 0 değil)
]


# 2B kesit çizimi oluşturuluyor (XY düzleminde, Y ekseni etrafında döndürülecek)
vazo_2B_profil = (
    cq.Workplane("XY")  # Çizime XY düzleminde başlanır (Y ekseni boyunca yükseklik)
    .moveTo(0,0) # Orijinden başla (vazo tabanının merkezi)
    .lineTo(vazo_taban_yaricapi, 0)  # Tabanın dış kenarı (sağa doğru)
    .spline(spline_noktalar_dis)  # Dış eğri yukarı doğru
    .lineTo(vazo_agiz_yaricapi - duvar_kalinligi, vazo_toplam_yukseklik) # Ağız iç kenarına geçiş
    .spline(spline_noktalar_ic, includeCurrent=True) # İç eğri aşağı doğru (önceki noktayı dahil et)
    .lineTo(0, duvar_kalinligi) # İç taban merkezine doğru (kalınlık bırakarak)
    .close()  # Profili kapat (orijine dönerek)
)

# 2B profil Y ekseni etrafında döndürülerek 3B vazo modeli oluşturuluyor
vazo_3B = vazo_2B_profil.revolve(
    angleDegrees=360,              # Döndürme açısı (derece cinsinden)
    axisStart=(0, 0, 0),           # Dönme ekseninin başlangıç noktası (Orijin)
    axisEnd=(0, 1, 0)              # Dönme ekseninin bitiş noktası (Y ekseni boyunca)
)

# STEP dosyasına dışa aktarım
exporters.export(vazo_3B, 'vazo.step')
# GLTF dosyasına dışa aktarım (Model Viewer için)
exporters.export(vazo_3B, 'vazo.gltf')

```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Vazo Modeli (Revolve ile)</h1>
  <model-viewer
    src="/models/vazo.gltf"
    alt="Bir 2D profilin Y ekseni etrafında döndürülmesiyle oluşturulmuş vazo modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

**💡 Önemli Noktalar:**

*   **Çizim Düzlemi ve Eksen:** Profil, döndürme eksenini içeren bir düzlemde çizilir. Örneğimizde, Y ekseni etrafında döndürme yapacağımız için profili XY düzleminde (veya YZ düzleminde) çizdik. Eğer `axisStart` ve `axisEnd` belirtilmezse:
    *   `Workplane("XY")` üzerinde `revolve()` Y ekseni etrafında,
    *   `Workplane("XZ")` üzerinde `revolve()` Z ekseni etrafında,
    *   `Workplane("YZ")` üzerinde `revolve()` X ekseni etrafında varsayılan döndürmeyi yapar.
*   **Eksen Tanımı (`axisStart`, `axisEnd`):** Bu parametrelerle herhangi bir özel eksen etrafında döndürme yapılabilir.
*   **Açı (`angleDegrees`):** Tam bir dönüş (360) veya kısmi bir dönüş (örn. 180 derece yarım bir nesne için) belirtebilirsiniz.
*   **Profil Yeri:** Profilin eksenin hangi tarafında olduğu önemlidir. Eksenin üzerinde olmayan (tamamen eksenin bir yanında kalan) bir profil, döndürüldüğünde ortası boş bir nesne (vazo gibi) oluşturur. Eğer profil ekseni kesiyorsa veya eksen üzerinde başlıyorsa, döndürüldüğünde bu kısımlar dolu olur.

---

## 🐍 `sweep`: Profil Boyunca Katı Süpürme

`sweep` (süpürme), bir **2D profili (kesit)** alıp, onu uzayda tanımlanmış bir **3D yol (path)** boyunca hareket ettirerek katı bir model oluşturmanızı sağlar. Borular, yaylar, karmaşık kablo kanalları veya özel profilli kirişler gibi nesneler için idealdir.

**Mantık:**

1.  Süpürülecek **2D profili** (genellikle kapalı bir `Wire`) oluşturun. Bu profil genellikle yolun başlangıç noktasına *dik* bir düzlemde tanımlanır.
2.  Profilin takip edeceği **3D yolu** (genellikle bir `Wire` veya `Edge` listesi) tanımlayın. Bu yol düz çizgilerden, yaylardan veya spline'lardan oluşabilir.
3.  `sweep()` komutunu kullanarak profili yol boyunca hareket ettirin.

---

### ⛶ Örnek: Çerçeve Modeli

`polyline` komutu ile oluşturduğumuz özel bir profili, köşeleri yuvarlatılmış kare bir yol boyunca `sweep` komutu ile süpürerek bir çerçeve modeli elde edelim.

```python
import cadquery as cq
from cadquery import exporters

# Şekli X ekseni yönünde kaydırmak için temel değer
kd = 50

# XZ düzleminde çerçeve profili (x, z koordinatları)
# Bu profil, süpürme yolunun başlangıcına dik bir düzlemde tanımlanır.
cerceve_noktalari = [
    (kd+0,0),
    (kd+0,10),
    (kd+10,10),
    (kd+10,25),
    (kd+20,35),
    (kd+20,15),
    (kd+15,15),
    (kd+15,10),
    (kd+20,10),
    (kd+20,0)
]

# Sweep yolu: XY düzleminde yuvarlatılmış dikdörtgen
# Bu yol, profilin takip edeceği güzergahı belirler.
yol = cq.Workplane("XY").rect(100, 100).val()  # 100x100 dikdörtgenin Wire'ını al
yol = yol.fillet2D(5, yol.Vertices())         # Köşelere 5 birim yuvarlatma uygula

# Model oluşturma:
model = (
    cq.Workplane("XZ")                   # İşlem başlangıç düzlemi (profile uygun)
    .polyline(cerceve_noktalari)         # Nokta dizisini kullanarak profili çiz
    .close()                             # Profilin kapalı bir Wire olmasını sağla
    .sweep(yol, makeSolid=True, isFrenet=True) # Profili belirlenen yol boyunca süpür
)

# Sonucu görselleştir (eğer bir CadQuery görüntüleyici ortamındaysanız)
# show_object(model)

# Modeli STEP formatında dışa aktar
exporters.export(model, 'cerceve_model.step')

# Modeli GLTF formatında dışa aktar (Model Viewer için)
exporters.export(model, 'sweep-cerceve.gltf')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Çerçeve Modeli (Sweep ile)</h1>
  <model-viewer
    src="/models/sweep-cerceve.gltf"
    alt="Yuvarlatılmış kare bir yol boyunca özel bir profilin süpürülmesiyle oluşturulmuş çerçeve modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

**💡 Önemli Noktalar ve İpuçları:**

*   **Profil (`profile`)**: Süpürülecek kesit **mutlaka** kapalı bir `Wire` (tel) olmalıdır. `polyline().close()` veya `makeWire()` gibi yöntemlerle oluşturulabilir.
*   **Yol (`path`)**: Profilin takip edeceği güzergahtır. Genellikle bir `Wire` (düz çizgiler, yaylar, spline'lar içerebilir) veya bir `Edge` (kenar) dizisidir. Yolun kapalı olması gerekmez (örneğin bir yay süpürmek için açık bir yol kullanılır).
*   **Profilin Konumu ve Yönelimi**: Profilin, yolun başlangıç noktasına göre nasıl konumlandırıldığı ve yönlendirildiği çok önemlidir. Genellikle, profilin bulunduğu düzlem, yolun başlangıç teğet vektörüne **dik** olmalıdır. Örneğimizde yol XY düzleminde başladığı için, ona dik olan **XZ** düzlemini (`cq.Workplane("XZ")`) profilimizi çizmek için kullandık.
*   **`sweep(path, makeSolid=True, isFrenet=False, transition='right')` Parametreleri**:
    *   `path`: Takip edilecek `Wire` veya `Edge` listesi.
    *   `makeSolid=True` (varsayılan): Sonucun katı (`Solid`) bir cisim olmasını sağlar. `False` yapılırsa sadece bir kabuk (`Shell`) veya yüzey (`Face`) oluşturulur.
    *   `isFrenet=False` (varsayılan): Profilin yol boyunca hareket ederken kendi yönelimini nasıl koruyacağını belirler.
        *   `False`: Profilin normal vektörü genellikle sabit tutulmaya çalışılır (bazı bükülmelerde beklenmedik sonuçlar verebilir).
        *   `True`: Profilin yönelimini yol boyunca Frenet-Serret çerçevesine göre ayarlar. Bu, özellikle **3 boyutlu eğrisel yollarda** profilin istenmeyen şekilde 'takla atmasını' veya bükülmesini önler ve genellikle daha sezgisel sonuçlar verir. **Çoğu durumda `True` kullanmak daha iyidir.**
    *   `transition='right'` (varsayılan): Yol üzerindeki bitişik segmentler arasındaki geçişlerin nasıl yönetileceğini belirler (`'transformed'`, `'round'` gibi seçenekler de vardır). Genellikle varsayılan değer yeterlidir.
*   **Yol Kompleksliği**: Yol, 2D bir düzlemde olabileceği gibi, 3D uzayda tanımlanmış karmaşık eğrilerden de oluşabilir (örn. helis, spline).
*   **Kendi Kendine Kesişme (Self-Intersection)**: Eğer profil, yolun sahip olduğu keskin dönüşler veya dar eğrilik yarıçapları için çok büyükse, süpürme işlemi sırasında model kendi geometrisiyle kesişebilir. Bu durum, geçersiz bir katı model oluşmasına veya beklenmedik geometrik hatalara yol açabilir. Profil boyutunu veya yolun yumuşaklığını ayarlamak gerekebilir.
*   **Kullanım Yöntemleri**: `sweep` genellikle profilin tanımlandığı `Workplane` zincirinin sonunda `.sweep(yol)` şeklinde kullanılır. Alternatif olarak, `cq.Solid.sweep(profil_wire, yol_wire)` gibi statik bir yöntemle de çağrılabilir (ancak zincirleme kullanımı daha yaygındır).

---

### ꩜ Örnek: Katı Heliks Modeli (Yay/Burgu)

Şimdi `sweep` komutunu daha karmaşık bir 3 boyutlu yol olan heliks üzerinde uygulayalım. Z ekseni etrafında yükselen bir heliks yolu tanımlayıp, bu yol boyunca dairesel bir profili süpürerek katı bir yay veya burgu modeli oluşturacağız.

Profilin, süpürme yolunun başlangıcına göre doğru konumda ve yönde olması gerektiğinden, bunu sağlamanın CadQuery'de farklı yolları vardır. Burada iki yaygın yöntemi göreceğiz:

1.  **`cq.Plane` Kullanımı:** Profilin çizileceği düzlemi, heliksin başlangıç noktası ve başlangıç teğet vektörünü kullanarak özel olarak tanımlarız.
2.  **`transformed` Kullanımı:** Heliksin başlangıç teğetine dik olan standart bir düzlem (örneğin XZ düzlemi) seçip, bu düzlemi heliksin başlangıç noktasına öteleriz (transformasyon). CadQuery'nin akıcı (fluent) arayüzüyle daha uyumlu olduğu için **ikinci yöntem genellikle daha sık tercih edilir.**

#### Yöntem 1: `cq.Plane` ile Konumlandırma

```python
import cadquery as cq
from cadquery import exporters

# --- 1. Parametreler ---
heliks_yaricap = 25
pitch = 20
tur_sayisi = 4
heliks_yukseklik = pitch * tur_sayisi
profil_yaricap = 5

# --- 2. Heliks Yolunu (Path) Oluşturma ---
heliks_yolu = cq.Wire.makeHelix(
    pitch=pitch,
    height=heliks_yukseklik,
    radius=heliks_yaricap
) # Bu heliks (radius, 0, 0)'da başlar, ilk teğeti Y ekseni yönündedir.

# --- 3. Profili Doğru Konumda Oluşturma ve Süpürme ---
helix_start_point = cq.Vector(heliks_yaricap, 0, 0)
helix_start_tangent = cq.Vector(0, 1, 0) # makeHelix'in varsayılan başlangıç teğeti

# Profil düzlemini tanımla: Orijini heliksin başlangıcı, normali başlangıç teğeti.
# Bu düzlem, başlangıç noktasına ötelenmiş ve teğete dik olacaktır.
profile_plane = cq.Plane(
    origin=helix_start_point,
    xDir=(1,0,0), # Düzlemin X ekseni (teğete dik herhangi bir vektör olabilir, örn. global X)
    normal=helix_start_tangent # Düzlemin Z ekseni (normali) teğet yönünde olacak
)

heliks_kati_model_1 = (
    cq.Workplane(profile_plane)
    .circle(profil_yaricap)
    .sweep(heliks_yolu, isFrenet=True)
)

# --- 4. Sonucu Görselleştirme ve Dışa Aktarma ---
# show_object(heliks_kati_model_1, name="kati_heliks_yontem_1")
# exporters.export(heliks_kati_model_1, 'kati_heliks_yontem_1.step')
# exporters.export(heliks_kati_model_1, 'solid_heliks_modeli_y1.gltf')
```

#### Yöntem 2: `transformed` ile Konumlandırma (Yaygın Yöntem)

```python
import cadquery as cq
from cadquery import exporters

# --- 1. Parametreler ---
heliks_yaricap = 25
pitch = 20
tur_sayisi = 4
heliks_yukseklik = pitch * tur_sayisi
profil_yaricap = 5

# --- 2. Heliks Yolunu (Path) Oluşturma ---
heliks_yolu = cq.Wire.makeHelix(
    pitch=pitch,
    height=heliks_yukseklik,
    radius=heliks_yaricap
) # Başlangıç: (radius,0,0), teğet: (0,1,0)

# --- 3. Profili Doğru Konumda Oluşturma ve Süpürme ---
helix_start_point = cq.Vector(heliks_yaricap, 0, 0)

# Heliksin başlangıç teğeti Y ekseni (0,1,0) yönünde.
# Bu teğete dik olan bir düzlem XZ düzlemidir.
# Profili XZ düzleminde çizip, sonra bu düzlemi heliksin başlangıç noktasına taşıyacağız.
heliks_kati_model_2 = (
    cq.Workplane("XZ")                   # Başlangıç teğetine dik olan XZ düzlemini seç
    .transformed(offset=helix_start_point) # Çalışma düzlemini heliksin başlangıç noktasına taşı
    .circle(profil_yaricap)              # Şimdi doğru konumdaki düzlemde daire profilini çiz
    .sweep(heliks_yolu, isFrenet=True)   # Profili heliks yolu boyunca süpür
)

# --- 4. Sonucu Görselleştirme ve Dışa Aktarma ---
# show_object(heliks_kati_model_2, name="kati_heliks_yontem_2")
# exporters.export(heliks_kati_model_2, 'kati_heliks_yontem_2.step')
exporters.export(heliks_kati_model_2, 'solid_heliks_modeli.gltf') # Model Viewer için
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Katı Heliks Modeli (Sweep ile)</h1>
  <model-viewer
    src="/models/solid_heliks_modeli.gltf"
    alt="Dairesel bir profilin heliks şeklindeki bir yol boyunca süpürülmesiyle oluşturulmuş katı yay modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

---

### ➰ Örnek: Heliks Boru Modeli

Şimdi de benzer bir heliks yolu kullanarak içi boş bir boru modeli oluşturalım. Bunun için profilimiz, dış ve iç çemberlerden oluşan bir halka olacak. Bu halka profilini bir `Face` (Yüzey) olarak oluşturup ardından `sweep` işlemine sokacağız.

#### Yöntem 1: `cq.Plane` ile Konumlandırma

```python
import cadquery as cq
from cadquery import exporters

# --- 1. Parametreler ---
heliks_yaricap = 25
pitch = 20
tur_sayisi = 4
heliks_yukseklik = pitch * tur_sayisi
boru_dis_yaricap = 5
boru_ic_yaricap = 4

# --- 2. Heliks Yolunu (Path) Oluşturma ---
heliks_yolu = cq.Wire.makeHelix(
    pitch=pitch,
    height=heliks_yukseklik,
    radius=heliks_yaricap
)

# --- 3. Profili Doğru Konumda Oluşturma (İçi Boş Halka) ---
helix_start_point = cq.Vector(heliks_yaricap, 0, 0)
helix_start_tangent = cq.Vector(0, 1, 0)

profile_plane = cq.Plane(
    origin=helix_start_point,
    xDir=(1,0,0),
    normal=helix_start_tangent
)

dis_wire = cq.Workplane(profile_plane).circle(boru_dis_yaricap).val()
ic_wire = cq.Workplane(profile_plane).circle(boru_ic_yaricap).val()
boru_profili_face = cq.Face.makeFromWires(dis_wire, [ic_wire])

# --- 4. Süpürme (Sweep) İşlemi ---
heliks_boru_model_1 = (
    cq.Workplane()
    .add(boru_profili_face)
    .sweep(heliks_yolu, isFrenet=True, makeSolid=True)
)

# --- 5. Sonucu Görselleştirme ve Dışa Aktarma ---
# show_object(heliks_boru_model_1, name="heliks_boru_yontem_1")
# exporters.export(heliks_boru_model_1, 'heliks_boru_yontem_1.step')
# exporters.export(heliks_boru_model_1, 'heliks_boru_modeli_y1.gltf')
```

#### Yöntem 2: `transformed` ile Konumlandırma (Yaygın Yöntem)

```python
import cadquery as cq
from cadquery import exporters

# --- 1. Parametreler ---
heliks_yaricap = 25
pitch = 20
tur_sayisi = 4
heliks_yukseklik = pitch * tur_sayisi
boru_dis_yaricap = 5
boru_ic_yaricap = 4

# --- 2. Heliks Yolunu (Path) Oluşturma ---
heliks_yolu = cq.Wire.makeHelix(
    pitch=pitch,
    height=heliks_yukseklik,
    radius=heliks_yaricap
)

# --- 3. Profili Doğru Konumda Oluşturma (İçi Boş Halka) ---
helix_start_point = cq.Vector(heliks_yaricap, 0, 0)

# Heliksin başlangıç teğetine dik XZ düzlemini kullan
profile_wp_base = cq.Workplane("XZ").transformed(offset=helix_start_point)

# Bu ötelenmiş düzlem üzerinde dış ve iç dairelerin Wire'larını oluştur
# Her .circle() sonrası .val() alındığı için profile_wp_base'in kendisi değişmez.
dis_wire = profile_wp_base.circle(boru_dis_yaricap).val()
ic_wire = profile_wp_base.circle(boru_ic_yaricap).val()

boru_profili_face = cq.Face.makeFromWires(dis_wire, [ic_wire])

# --- 4. Süpürme (Sweep) İşlemi ---
heliks_boru_model_2 = (
    cq.Workplane()
    .add(boru_profili_face)
    .sweep(heliks_yolu, isFrenet=True, makeSolid=True)
)

# --- 5. Sonucu Görselleştirme ve Dışa Aktarma ---
# show_object(heliks_boru_model_2, name="heliks_boru_yontem_2")
# exporters.export(heliks_boru_model_2, 'heliks_boru_yontem_2.step')
exporters.export(heliks_boru_model_2, 'heliks_boru_modeli.gltf') # Model Viewer için
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Heliks Boru Modeli (Sweep ile)</h1>
  <model-viewer
    src="/models/heliks_boru_modeli.gltf"
    alt="İçi boş halka şeklindeki bir profilin heliks yolu boyunca süpürülmesiyle oluşturulmuş boru modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>
---

## ✨ `loft`: Profiller Arası Geçiş Oluşturma

`loft` (profil birleştirme), birbirinden farklı yüksekliklerde veya konumlarda bulunan **iki veya daha fazla 2D profili (kesiti)** alıp, aralarında **yumuşak bir geçiş yüzeyi** oluşturarak katı bir model meydana getirmenizi sağlar. Gemi gövdeleri, uçak kanatları, ergonomik tutamaklar veya farklı geometriler arasında geçiş yapan adaptörler gibi formlar için kullanılır.

Mantık:

1.  Geçiş yapılacak **2D profilleri** farklı Z seviyelerinde (veya farklı konumlarda) oluşturun. Bunlar genellikle kapalı `Wire`'lardır.
2.  Bu profilleri (telleri) bir Python listesinde toplayın. Sıralama önemlidir, loft bu sıraya göre geçiş yapacaktır.
3.  `cq.Solid.makeLoft(profil_listesi)` komutunu kullanarak katıyı oluşturun.

---

### 🟦➡️⚪ Örnek: Kareden Daireye Geçiş Adaptörü

Z=0'da bir kare, Z=50'de ise bir daire profili oluşturup aralarında bir loft ile geçiş yapalım.

```python
import cadquery as cq
from cadquery import exporters

# --- Parametreler ---
kare_kenar = 40
daire_yaricap = 15
yukseklik = 50

# --- 1. Profilleri Oluştur ---

# Kare profil (Z=0):
profil1_kare = (
    cq.Workplane("XY")
    .rect(kare_kenar, kare_kenar)
    .wires()
    .val() # İlk ve tek wire'ı al
)

# Daire profil (Z=yukseklik):
profil2_daire = (
    cq.Workplane("XY")
    .workplane(offset=yukseklik) # Z ekseninde yukarı taşı
    .circle(daire_yaricap)
    .wires()
    .val() # İlk ve tek wire'ı al
)

# --- 2. Profil Listesini Oluştur ---
# Loft işlemi için profil sırası önemlidir (alttan üste)
profil_listesi = [profil1_kare, profil2_daire]

# --- 3. Loft İşlemi ---
loft_modeli = cq.Solid.makeLoft(profil_listesi)

# --- Gösterme ve Dışa Aktarma ---
# show_object(loft_modeli, name="Kareden Daireye Loft")
# exporters.export(loft_modeli, 'loft_adaptor.step')
exporters.export(loft_modeli, 'loft-adapter.gltf') # Model Viewer için
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Kareden Daireye Geçiş (Loft ile)</h1>
  <model-viewer
    src="/models/loft-adapter.gltf"
    alt="Altta kare, üstte daire profili arasında loft ile oluşturulmuş geçiş modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

**💡 Önemli Noktalar:**

*   **Profillerin Hazırlanması:** Her profilin ayrı ayrı oluşturulup `.wires().val()` (veya `.wire().val()` eğer tek bir wire ise) ile tel olarak alınması gerekir. `val()` metodu, zincirdeki seçili olan ilk geometriyi (burada `Wire` nesnesini) doğrudan döndürür.
*   **Konumlandırma:** Profillerin uzaydaki konumları (özellikle Z ofsetleri) loft'un şeklini belirler. `workplane(offset=...)` veya `translate()` ile konumlandırılabilirler.
*   **Profil Listesi:** `makeLoft` fonksiyonuna verilen listenin sırası, geçişin yönünü belirler (ilk profilden son profile doğru).
*   **`cq.Solid.makeLoft()`:** Bu metod doğrudan bir `Workplane` zinciri üzerinde çağrılmaz. Ayrı profiller oluşturulduktan sonra `cq.Solid` sınıfı üzerinden kullanılır.
*   **İkiden Fazla Profil:** `makeLoft` ikiden fazla profille de çalışabilir, bu sayede daha karmaşık geçişler (örn. kare -> sekizgen -> daire) oluşturulabilir.
*   **Profillerin Nokta Sayısı ve Yönü:** Daha iyi sonuçlar için loft yapılan profillerin benzer sayıda verteks içermesi ve başlangıç noktalarının/yönlerinin (saat yönü/tersi) tutarlı olması önerilir. CadQuery bunu genellikle iyi yönetir, ancak karmaşık durumlarda `ruled=True` parametresi veya profillerin manuel hizalanması gerekebilir.

---

## 🔄 `rotate`: Nesneleri Döndürme

`translate` ile nesneleri nasıl taşıyacağımızı görmüştük. `rotate` komutu ise nesneleri belirli bir **eksen etrafında** belirli bir **açı** kadar döndürmemizi sağlar. Bu, parçaları doğru yönelimlere getirmek veya montajlarda konumlandırmak için kritik bir işlemdir.

`rotate(axisStartPoint, axisEndPoint, angleDegrees)`

*   `axisStartPoint`: Döndürme ekseninin başlangıç noktası (`cq.Vector` veya `(x,y,z)` tuple).
*   `axisEndPoint`: Döndürme ekseninin bitiş noktası (`cq.Vector` veya `(x,y,z)` tuple).
*   `angleDegrees`: Döndürme açısı (derece cinsinden). Sağ el kuralı genellikle geçerlidir (eksen yönüne `axisStartPoint`'ten `axisEndPoint`'e doğru başparmağınızla baktığınızda, pozitif açı diğer parmaklarınızın dönüş yönündedir).

---

### 🎲 Örnek: Eğik Durmuş Bir Kutu

Basit bir kutu oluşturup onu hem Z hem de X ekseni etrafında döndürelim.

```python
import cadquery as cq
from cadquery import exporters

# Önce basit bir kutu oluşturalım
orijinal_kutu = cq.Workplane("XY").box(20, 30, 40)

# Döndürme işlemleri
# 1. Orijinden geçen Z ekseni etrafında 45 derece döndür
#    Eksen: (0,0,0) -> (0,0,1)
kutu_z_donuk = orijinal_kutu.rotate((0,0,0), (0,0,1), 45)

# 2. Sonucu şimdi de orijinden geçen X ekseni etrafında 30 derece döndür
#    Eksen: (0,0,0) -> (1,0,0)
#    Dikkat: Döndürme zincirleme uygulanır!
kutu_zx_donuk = kutu_z_donuk.rotate((0,0,0), (1,0,0), 30)

# Tek zincirde yazmak da mümkün:
# kutu_zx_donuk = (
#     cq.Workplane("XY").box(20, 30, 40)
#     .rotate((0,0,0), (0,0,1), 45)  # Önce Z etrafında
#     .rotate((0,0,0), (1,0,0), 30)  # Sonra X etrafında (önceki sonucun X ekseni etrafında)
# )

# show_object(orijinal_kutu, name="Orijinal Kutu", options={'color': 'gray', 'alpha': 0.5})
# show_object(kutu_zx_donuk, name="Döndürülmüş Kutu")

exporters.export(orijinal_kutu, 'orijinal_kutu.gltf') # Model Viewer için
exporters.export(kutu_zx_donuk, 'kutu_zx_donuk.gltf') # Model Viewer için
# exporters.export(kutu_zx_donuk, 'rotated_box.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Döndürülmüş Kutu (Rotate ile)</h1>

  <div style="display: flex; gap: 20px; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 300px;">
      <h2 class="text-xl font-semibold mb-2 text-center">Orijinal Kutu</h2>
      <model-viewer
        src="/models/orijinal_kutu.gltf"
        alt="orijinal dikdörtgen prizma"
        auto-rotate
        camera-controls
        style="width: 100%; height: 400px; background-color: rgb(245, 246, 243);" />
    </div>
    <div style="flex: 1; min-width: 300px;">
      <h2 class="text-xl font-semibold mb-2 text-center">Döndürülmüş Kutu</h2>
      <model-viewer
        src="/models/kutu_zx_donuk.gltf"
        alt="hem X hem de Z ekseni etrafında döndürülmüş dikdörtgen prizma"
        auto-rotate
        camera-controls
        style="width: 100%; height: 400px; background-color: rgb(245, 246, 243);" />
    </div>
  </div>
</Layout>

**💡 Önemli Noktalar:**

*   **Eksen Tanımı:** Döndürme ekseni uzayda iki nokta ile tanımlanır. Bu eksen orijinden geçmek zorunda değildir.
*   **Zincirleme Döndürmeler:** Birden fazla `rotate` işlemi uygulandığında, her döndürme bir öncekinin sonucuna ve onun **o anki koordinat sistemine** göre uygulanır. Döndürme sırası sonucu etkileyebilir (Euler açıları gibi).
*   **Kombinasyon:** `rotate` ve `translate` komutları bir arada kullanılarak nesneler istenilen konuma ve yönelime getirilebilir. `obj.translate(...).rotate(...)` ile `obj.rotate(...).translate(...)` farklı sonuçlar verebilir! Genellikle önce döndürüp sonra taşımak (eğer global bir öteleme isteniyorsa) veya önce nesneyi orijine taşıyıp, döndürüp sonra istenen yere taşımak (karmaşık döndürmeler için) daha kontrol edilebilir olabilir.

---

## 🧱 Kabuk Oluşturma (`shell`) ve Profil/Yüzey Öteleme (`offset2D`, `thicken`)

Oluşturduğumuz katı modellerin içini boşaltmak veya belirli yüzeylere/profillere kalınlık vermek, tasarımlarımıza işlevsellik katmanın önemli yollarındandır. CadQuery bu amaçlar için `shell`, `offset2D` ve `thicken` gibi güçlü araçlar sunar.

Evet, çok haklısınız — `shell()` fonksiyonunun açıklaması CadQuery dokümantasyonuna tam uymalı. Şimdi o bölümü, dokümantasyona uygun ve sizin yazı stilinize sadık kalarak düzeltilmiş haliyle veriyorum:


### 🐚 `shell()`: Katıların İçini Boşaltma

`shell()` metodu, bir katı modelin duvarlarını belirli bir kalınlıkta bırakıp içini boşaltmak için kullanılır. Bu yöntem özellikle muhafaza, kutu veya hafifletilmiş parçalar tasarlarken işe yarar.

```python
solid.shell(thickness)
```

* `thickness`: Kabuk kalınlığıdır.

  * **Negatif** değer verildiğinde, kabuk *içeri* doğru oluşturulur (iç boşaltılır).
  * **Pozitif** değer verildiğinde, kabuk *dışarı* doğru genişletilir (dışa kalınlık eklenir).

Ayrıca bir veya daha fazla yüzeyi seçerek bu yüzlerin açık kalmasını sağlayabilirsiniz:

```python
solid.faces("selector").shell(thickness)
```

#### 📥 Örnek: İçi Boş, Üstü Açık Kutu

```python
import cadquery as cq
from cadquery import exporters

kutu_boyut = (50, 40, 30)
et_kalinligi = -2  # içe doğru 2 mm kabuk

ici_bos_kutu = (
    cq.Workplane("XY")
    .box(*kutu_boyut)
    .faces(">Z")  # Üst yüzeyi kaldır, burası açık kalacak
    .shell(et_kalinligi)
)

exporters.export(ici_bos_kutu, 'box.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">İçi Boş Kutu (Shell ile)</h1>
  <model-viewer
    src="/models/ici_bos_kutu.gltf"
    alt="Shell komutu ile içi boşaltılmış, üstü açık kutu modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 500px; background-color:rgb(245, 246, 243);" />
</Layout>

**💡 İpuçları:**

* `shell()` fonksiyonuna negatif değer verirseniz modelin içi boşalır.
* Yüzey seçimleriyle bir veya birden fazla yüzey açık bırakılabilir:
  Örneğin `.faces("+Z or -X or +X")` gibi.
* Çok ince duvarlar veya karmaşık geometri, `shell()` işlemini başarısız yapabilir.


---

### 📏 `offset2D()`: 2D Profilleri Öteleme

`offset2D()` metodu, bir `Wire` (tel) veya `Face` (2D yüzey) nesnesinin kenarlarını belirli bir mesafe kadar içeri veya dışarı doğru öteler. Bu, et kalınlığına sahip 2D profiller (örneğin boru kesitleri) oluşturmak veya mevcut bir profilden daha büyük/küçük paralel bir profil elde etmek için çok kullanışlıdır.

`wire_or_face.offset2D(amount, kind='arc')`

*   `amount`: Öteleme miktarı. Pozitif değer dışa doğru, negatif değer içe doğru öteler.
*   `kind`: Köşelerin nasıl işleneceğini belirler:
    *   `'arc'` (varsayılan): Köşeleri yuvarlatır.
    *   `'intersection'`: Köşeleri keskin (orijinal köşe tipine benzer) tutar.
    *   `'tangent'`: Köşeleri teğetsel olarak uzatır.

#### 🖼️ Örnek: Ötelenmiş Dikdörtgen Profil

```python
import cadquery as cq
from cadquery import exporters

# --- 1. Orijinal Profili Oluştur ---
# XY düzleminde 30x20 mm boyutlarında dikdörtgen çiz
orijinal = cq.Workplane("XY").rect(30, 20)

# --- 2. Offset İşlemlerini Uygula ---
# Dışa doğru 5 mm offset (köşeler yay şeklinde):
# Pozitif değer dışa genişletir, "arc" köşeleri yuvarlatır
disa_otelenmis = orijinal.offset2D(5, kind="arc")

# İçe doğru 3 mm offset (köşeler keskin):
# Negatif değer içe daraltır, "intersection" köşeleri keskinleştirir
ice_otelenmis = orijinal.offset2D(-3, kind="intersection")

# --- 3. Çerçeve Yüzeyini Oluştur ---
# Dış ve iç tellerden çerçeve yüzeyi oluştur:
# `makeFromWires()` dış teli temel alır, iç teli delik olarak çıkarır
cerceve_yuzeyi = cq.Face.makeFromWires(disa_otelenmis.val(), [ice_otelenmis.val()])

# --- 4. 3D Modeli Oluştur ---
# 2D yüzeyi 10 mm yukarıya extrude et:
# Yüzeyi Z ekseni yönünde kalınlıkla genişleterek 3D yapar
cerceve_model = cq.Workplane("XY").add(cerceve_yuzeyi).extrude(10)

# --- 5. Dışa Aktarma ---
# Modeli STEP formatında dışa aktar:
# CAD yazılımlarıyla uyumlu 3D dosya oluşturur
exporters.export(cerceve_model, 'otelenmis_cerceve.step')
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Ötelenmiş Profil ile Çerçeve (offset2D ile)</h1>
  <model-viewer
    src="/models/otelenmis_cerceve.gltf"
    alt="offset2D ile oluşturulmuş profillerden yapılan çerçeve modeli"
    auto-rotate
    camera-controls
    style="width: 100%; height: 500px; background-color:rgb(245, 246, 243);" />
</Layout>

**💡 İpuçları:**
*   `offset2D`, özellikle `sweep` veya `revolve` ile boru benzeri yapılar oluştururken iç ve dış profilleri kolayca tanımlamak için harikadır.
*   Çok fazla içe öteleme (`amount` değeri profilin yarısından büyük negatif bir sayı ise) geometrinin kendi kendini kesmesine veya yok olmasına neden olabilir.
---

## ⚙️ `Assembly`: Basit Montajlara Giriş

Şimdiye kadar tekil katı modeller (parçalar) oluşturduk. Ancak gerçek dünya tasarımları genellikle birden fazla parçanın bir araya gelmesinden oluşur (montajlar). CadQuery, `Assembly` sınıfı ile parçaları bir araya getirme, konumlandırma ve yönetme yeteneği sunar.

Montaj Mantığı:

1.  Her bir **parçayı** ayrı ayrı CadQuery nesneleri olarak modelleyin.
2.  Bir `cq.Assembly()` nesnesi oluşturun.
3.  Her parçayı `assembly.add()` metodu ile montaja ekleyin. Eklerken:
    *   Parçanın kendisini (`Solid` veya `Workplane` nesnesi) verin.
    *   `name`: Parçaya montaj içinde benzersiz bir isim verin.
    *   `color`: Parçanın rengini belirleyin (`cq.Color`).
    *   `loc`: Parçanın montaj koordinat sistemindeki konumunu ve yönelimini belirleyen bir `cq.Location` nesnesi verin. `cq.Location(translation_vector, rotation_axis, rotation_angle_degrees)` şeklinde veya sadece öteleme için `cq.Location(cq.Vector(x, y, z))` şeklinde oluşturulabilir.

---

### 🔩 Örnek: İki Parçalı Basit Montaj (Delikli Plaka ve Pim)

Delikli bir plaka ve bu deliğe geçecek bir pimden oluşan basit bir montaj oluşturalım.

```python
import cadquery as cq

# --- Parametreler ---
plaka_uzunluk = 60.0
plaka_genislik = 40.0
plaka_kalinlik = 10.0
delik_cap = 10.0

pim_cap = 9.8 # Deliğe rahat girmesi için biraz daha küçük
pim_yukseklik = 20.0

# --- Parça 1: Delikli Plaka ---
plaka = (
    cq.Workplane("XY")
    .box(plaka_uzunluk, plaka_genislik, plaka_kalinlik)
    .faces(">Z").workplane() # Plakanın üst yüzeyine geç
    .hole(delik_cap)         # Merkeze delik aç
)
# Kenarlara pah ekleyelim
plaka = plaka.edges("|Z").chamfer(0.5) # Dikey kenarlar
plaka = plaka.edges(">Z").chamfer(0.3) # Üst yüzey kenarları

# --- Parça 2: Pim ---
pim = (
    cq.Workplane("XY")
    .cylinder(pim_yukseklik, pim_cap / 2.0) # Yüksekliği Z ekseninde
)
# Pimin üst ve alt kenarlarına pah ekle
pim = pim.faces(">Z").edges().chamfer(0.5) # Üst kenar
pim = pim.faces("<Z").edges().chamfer(0.5) # Alt kenar


# --- Montaj ---
montaj = cq.Assembly()

# Plakayı montaja ekle (orijinde)
montaj.add(plaka, name="plaka", color=cq.Color("lightgray"))

# Pimi montaja ekle.
# Pim, plakanın deliğine yerleşecek.
# Plaka ve pim her ikisi de kendi orijinlerinde (0,0,0) merkezli oluşturuldu.
# Pimin tabanı plakanın üst yüzeyinde (Z=plaka_kalinlik/2) olmalı.
# Silindir Z ekseninde simetrik olduğu için pim_yukseklik/2 kadar yukarı taşınmalı.
pim_konumu = cq.Location(
    cq.Vector(0, 0, plaka_kalinlik / 2.0 + pim_yukseklik / 2.0) # Pimin merkezinin Z konumu
)
montaj.add(pim, name="pim", color=cq.Color("steelblue"), loc=pim_konumu)


# --- Sonuçları Göster veya Kaydet ---
# CadQuery Editor veya benzeri bir görsel ortamda model görüntülenebilir
# show_object(montaj, name="plaka_pim_montaji")

# Montajı GLTF dosyası olarak dışa aktarmak için:
# Assembly nesnesi doğrudan export edilemez, önce birleştirilmeli
# veya her parça ayrı ayrı dönüştürülüp eklenmeli.
# Basit bir yöntem:
try:
    # Montajı birleşik tek bir şekle (Compound) çeviriyoruz
    # Bu yöntem renkleri korumayabilir, GLTF için daha iyi yöntemler gerekebilir.
    # GLTF için genellikle her parçayı ayrı ayrı export edip bir sahnede birleştirmek daha iyidir
    # ya da cqMore gibi kütüphaneler kullanılabilir.
    # Bu örnek için birleşik bir STEP ve GLTF oluşturalım:
    
    # STEP için:
    # combined_shape_for_step = montaj.toCompound()
    # cq.exporters.export(combined_shape_for_step, 'plaka_pim_montaji.step')
    # print("Montaj 'plaka_pim_montaji.step' olarak kaydedildi.")

    # GLTF için (renkleri koruyarak basit bir birleştirme):
    # Bu yöntem her zaman ideal olmayabilir, özellikle karmaşık montajlarda.
    # En basit yol, her parçayı ayrı ayrı export etmek ve bir 3D editörde birleştirmektir.
    # Ancak burada basit bir örnek için union deneyebiliriz:
    
    # Parçaları birleştirmeden önce pozisyonlarına getirelim
    plaka_konumlu = plaka # Zaten orijinde
    pim_konumlu = pim.val().located(pim_konumu) # Pimi konumuna taşı

    # İki parçayı birleştir (bu işlem boolean union yapar, renkleri kaybedebilir)
    # birlesik_model = plaka_konumlu.union(pim_konumlu)
    # cq.exporters.export(birlesik_model, 'plaka_pim_montaji.gltf')
    
    # GLTF için daha iyi bir yaklaşım, Assembly'i olduğu gibi destekleyen bir format veya araç kullanmaktır.
    # CadQuery'nin kendi export fonksiyonları Assembly'i doğrudan GLTF'ye renkleriyle aktaramaz.
    # Bu blog için, parçaların ayrı ayrı export edildiğini ve bir görüntüleyicide
    # bir araya getirildiğini varsayalım veya aşağıdaki gibi bir placeholder kullanalım.
    # Bu örnek için, parçaları birleştirerek tek bir GLTF dosyası oluşturalım:
    
    # Geçici çözüm: Her parçayı konumlandırıp birleştirerek export etme
    # Ancak bu, Assembly'nin amacını biraz saptırır.
    # Blog için, montajı bir STEP olarak kaydedip, GLTF için görselleştirme aracının
    # STEP'i veya ayrı parçaları birleştirdiğini varsayabiliriz.
    # Şimdilik, montajın toCompound() halini export edelim:
    if montaj.obj: # Eğer montajda nesne varsa
        cq.exporters.export(montaj.obj, 'plaka_pim_montaji.gltf')
        print("Montaj 'plaka_pim_montaji.gltf' olarak (basitleştirilmiş) kaydedildi.")
    else: # Eğer toCompound ile oluşturulmuşsa
        montaj_bilesik = montaj.toCompound()
        if montaj_bilesik:
             cq.exporters.export(montaj_bilesik, 'plaka_pim_montaji.gltf')
             print("Montaj 'plaka_pim_montaji.gltf' olarak (birleşik) kaydedildi.")


except Exception as e:
    print(f"Dosya kaydedilemedi: {e}")

# print("Plaka ve Pim montajı başarıyla oluşturuldu.")
```

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">Basit Montaj Örneği (Assembly)</h1>
  <model-viewer
    src="/models/plaka_pim_montaji.gltf"
    alt="Delikli bir plaka ve üzerine yerleştirilmiş bir pimden oluşan basit montaj"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

**💡 Önemli Noktalar:**

*   **Ayrı Parçalar:** Montajdaki her bir eleman genellikle ayrı bir CadQuery katı modelidir (`Solid` veya `Workplane` sonucu).
*   **`cq.Assembly()`:** Montajı tutan ana nesnedir.
*   **`add(part, name, color, loc)`:** Parçaları montaja ekler. `loc` parametresi `cq.Location` nesnesi alır.
*   **`cq.Location()`:** Parçaların 3D uzaydaki yerleşimini (öteleme ve döndürme) tanımlar. `cq.Vector` ile öteleme, eksen (`cq.Vector` veya tuple) ve açı (derece) ile döndürme bilgisi içerebilir. Örneğin: `cq.Location(cq.Vector(10,0,0), cq.Vector(0,0,1), 45)` parçayı (10,0,0)'a öteler ve Z ekseni etrafında 45 derece döndürür.
*   **Koordinat Sistemi:** Montajın kendi global koordinat sistemi vardır ve parçalar bu sisteme göre `loc` ile yerleştirilir. Her parça kendi lokal orijinine göre modellenir.
*   **İlişkiler (Constraints):** Geleneksel CAD yazılımlarındaki gibi karmaşık geometrik ilişkiler (eş merkezlilik, teğetlik, mesafe vb.) `Assembly` sınıfında doğrudan bulunmaz. Konumlandırma `Location` nesneleri ile manuel olarak, hesaplamalarla yapılır. Daha karmaşık ilişkiler için ek Python kodlaması veya `cqMore.mate` gibi harici kütüphane eklentileri gerekebilir.
*   **Export:**
    *   **STEP:** Montajları STEP olarak dışa aktarmak için genellikle `assembly.toCompound()` ile tüm parçalar birleştirilip tek bir `Compound` nesnesi oluşturulur ve bu export edilir. Bu işlem renk bilgisini genellikle korumaz.
    *   **GLTF/Diğer Görüntüleme Formatları:** Renkleri ve ayrı parçaları koruyarak montaj export etmek daha karmaşıktır. `Assembly.save("montaj.gltf", exportType="GLTF")` gibi doğrudan bir yöntem CadQuery'nin çekirdeğinde bulunmayabilir (versiyona göre değişebilir). Genellikle her parça kendi rengiyle ayrı ayrı export edilir ve bir 3D görüntüleme aracında bir araya getirilir veya `cqMore` gibi kütüphanelerden yararlanılır. Yukarıdaki örnekte `montaj.obj` (ki bu bir `Compound` olur) export edilmiştir; bu bazı görüntüleyicilerde çalışabilir ama renkler kaybolabilir.

---

### 🎯 Özetle (İleri Modelleme Teknikleri):

*   **`revolve`**: Simetrik nesneler için 2D profili eksen etrafında döndürür.
*   **`sweep`**: Karmaşık yollu nesneler için 2D profili 3D yol boyunca süpürür.
*   **`loft`**: Farklı kesitler arasında yumuşak geçişli katılar oluşturur.
*   **`rotate`**: Nesneleri belirli bir eksen etrafında döndürerek yönelimlerini ayarlar.
*   **`Assembly`**: Birden fazla parçayı `Location` kullanarak bir araya getirip basit montajlar oluşturmaya olanak tanır.

Bu bölümde öğrendiğimiz `revolve`, `sweep`, `loft`, `rotate` ve temel `Assembly` kullanımı, CadQuery ile çok daha geniş bir yelpazede ve karmaşıklıkta 3D modeller tasarlamanızın önünü açar. Artık sadece basit bloklar ve silindirler değil, aynı zamanda kavisli borular, zarif vazolar, geçiş adaptörleri ve hatta basit mekanizmaların parçalarını modelleyebilirsiniz.

Unutmayın, bu komutların her biri birçok parametre alabilir ve farklı şekillerde birleştirilerek sonsuz olasılıklar sunar. CadQuery dokümantasyonunu ve örneklerini inceleyerek bu araçları daha da derinlemesine öğrenebilirsiniz.

---