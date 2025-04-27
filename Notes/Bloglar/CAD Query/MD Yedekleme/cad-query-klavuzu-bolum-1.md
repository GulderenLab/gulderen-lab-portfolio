---
# Dosya Adı: src/content/blog/cad-query-klavuzu-bolum-1.md
# Slug otomatik olarak dosya adından 'cad-query-klavuzu-bolum-1' olacaktır.

title: 'CAD Query ile Parametrik 3D Modelleme - Bölüm 1: Giriş ve Kurulum' # Başlığa bölüm bilgisi eklendi
description: 'CAD Query ile kod tabanlı 3D modellemeye giriş yapın. Bu ilk bölümde, CAD Querynin temellerini, avantajlarını öğrenecek ve geliştirme ortamınızı kuracaksınız.' # Açıklama bölüm 1'e özel hale getirildi
publishDate: 2025-04-22 # Veya yayın tarihi
tags: ['cadquery', 'python', '3d modelleme', 'parametrik tasarım', 'kodla cad', 'opencascade', 'başlangıç rehberi', 'bolum-1', 'kurulum'] # Bölüm etiketi eklendi
image:
  src: '/images/cadquery-python-3d-modeling-kapak.png' # Kapak görseli aynı kalabilir
  alt: 'CAD Query ve Python ile parametrik 3D modelleme konseptini gösteren kapak görseli'
isDraft: false

# --- Seri Bilgileri ---
part: 1                  # Bu, serinin 1. bölümü
totalPages: 8            # Bu serinin TOPLAMDA kaç bölüm olacağını tahmin edin (örneğin 3) - Tüm bölümlerde aynı olmalı!
seriesSlug: 'cad-query-klavuzu' # (İsteğe bağlı) Seriyi tanımlayan anahtar kelime
prevPageSlug: null        # İlk bölüm olduğu için önceki sayfa yok
nextPageSlug: 'cad-query-klavuzu-bolum-2' # Sonraki bölümün slug'ı (tutarlı isimlendirin)
# --- Seri Bilgileri Sonu ---
---

# 🎯 Kodla 3D Model Tasarlamaya Merhaba Deyin!
*CadQuery ile programatik 3B modelleme serisine hoş geldiniz.*

---

## 👋 Neden Programatik (Kod Tabanlı) CAD?

Eğer daha önce Tinkercad, Fusion 360, SolidWorks gibi geleneksel CAD programları kullandıysanız, 3B tasarımın genellikle sürükle-bırak, tıklama ve çizim gibi görsel adımlarla yapıldığını biliyorsunuzdur.  
Peki ya…

> Ya tasarımlarınızı bir Python betiğiyle sadece birkaç satır kodla tanımlayabilseydiniz?

İşte burada devreye **CadQuery** giriyor!

CadQuery, Python diliyle çalışan açık kaynaklı bir kütüphane olup, size geometrileri **parametrik**, **otomatikleştirilebilir** ve **yeniden üretilebilir** biçimde tanımlama gücü sunar.

---

## 🧠 Programatik CAD’in Avantajları

### 🔁 Parametrik Tasarım  
“Bu kutunun genişliği 80 mm yerine 120 mm olsun” demek için sadece bir değişkeni güncellemek yeterli.

### 🛠 Otomasyon  
Bir tasarımı yüzlerce varyasyonla otomatik olarak üretebilir, dış dosyalardan veri alarak modelinizi buna göre şekillendirebilirsiniz.

### 🔍 Sürüm Kontrolü  
Kod tabanlı olduğu için, Git gibi araçlarla tasarım geçmişinizi yönetebilirsiniz.

### 🎯 Hassas Kontrol  
Geometriler üzerinde milimetre düzeyinde mutlak kontrol sağlar.

---

## 🧰 CadQuery Nedir?

CadQuery, Python tabanlı bir programatik CAD kütüphanesidir. Arka planda güçlü bir geometri motoru olan **OpenCASCADE**’i kullanır.  
Bu sayede profesyonel seviyede 3B modelleme yapabilir, çıktı olarak **STL**, **STEP**, **DXF** gibi yaygın formatları alabilirsiniz.

### CadQuery'nin Başlıca Özellikleri:
- ✅ Açık kaynak (MIT lisansı)
- ✅ Python ile tam entegrasyon
- ✅ Parametrik ve fonksiyonel tasarıma uygun
- ✅ CQ-editor adında kendi arayüzü var (Fusion360 benzeri)
- ✅ FreeCAD ile entegre çalışabilir

---

## 🚀 Bu Seride Neler Öğreneceğiz?

Bu blog serisinde sıfırdan başlayarak CadQuery ile:

- Temel 3D geometriler oluşturmayı  
- Parametrik modelleme yapmayı  
- Sketch çizimleriyle hacim üretmeyi  
- Boolean işlemlerle şekil değiştirmeyi  
- STL ve STEP formatlarında model dışa aktarmayı  
- Gerçek dünya projeleri (örneğin elektronik cihaz kutusu) oluşturmayı  
- Python gücünü 3B tasarıma katmayı  

öğreneceğiz.

> 💡 Kodları sadece okuyarak değil, yazarak öğreniyoruz!

---

## 🛠 Hazırsan Başlayalım!

Bir sonraki bölümde kurulum ve ilk modelimizi çizmek için gerekli ortamı hazırlayacağız.  
CadQuery ile çalışmak için Python ortamını nasıl kuracağımızı ve CQ-editor’ü nasıl çalıştıracağımızı adım adım göstereceğim.

> Eğer daha önce hiç kod yazmadıysan bile endişelenme, her şey adım adım ve bolca görselle anlatılacak.

---
 

# 📦 CadQuery Kurulumu: Adım Adım Yöntemler

CadQuery'yi kullanmaya başlamak için bilgisayarınıza kurmanız gerekir. Birden fazla yöntem mevcut olsa da, özellikle başlangıç için en pratik olanları ve resmi dokümantasyonun önerdiği yolları [burada](https://cadquery.readthedocs.io/en/latest/installation.html) bulabilirsiniz.

✨ Önemli Not: Kuruluma başlamadan önce, özellikle pip yöntemi kullanacaksanız, Python'un sisteminizde kurulu olduğundan emin olun (Python 3.9 veya daha yeni bir sürüm önerilir).

## 1. Yöntem: CQ-Editor ile Kolay Kurulum (Yeni Başlayanlar İçin Önerilen)

CQ-Editor, hem CadQuery kütüphanesini hem de modeli anlık olarak görsel olarak gösterebilen bir IDE'dir. Bu yöntem, başlangıç seviyesi için en pratik olan yoldur.

### 💾 1.1 CQ-Editor İndirme

* [CQ-Editor Sürümleri](https://github.com/CadQuery/CQ-editor/releases/tag/nightly) sayfasına gidin.

* İşletim sisteminize uygun en son sürümü indirin (Windows: .exe, Linux/MacOS: .sh).

### ⚙️ 1.2 Kurulum

Linux / MacOS:

```bash
chmod +x CQ-editor-master-Linux-x86_64.sh
sh CQ-editor-master-Linux-x86_64.sh
```

Windows:

* .exe dosyasını çift tıklayarak çalıştırın.

* Varsayılan dizin: C:\Users\<kullanici_adi>\cq-editor

### 🚀 1.3 CQ-Editor'ı Başlatma

* Linux/MacOS: run.sh dosyasını çalıştır.

* Windows: run.bat dosyasını çalıştır.

---

## 2. Yöntem: Conda ile Kurulum (Stabil ve Profesyonel Seçenek)

[Resmi dokümantasyon](https://cadquery.readthedocs.io/en/latest/installation.html), conda kullanarak CadQuery kurulumunun daha iyi test edilmiş ve stabil olduğunu belirtir.

### ⚡️ 2.1 Miniforge Kurulumu

Eğer conda sisteminizde yüklü değilse, Miniforge tercih edilebilir.

Linux / MacOS:

```bash
curl -L -o miniforge.sh "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh"
bash miniforge.sh -b -p $HOME/miniforge
source $HOME/miniforge/bin/activate
```

Windows (CMD):

```bash
curl -L -o miniforge.exe https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Windows-x86_64.exe
start "" /wait miniforge.exe /InstallationType=JustMe /RegisterPython=0 /NoRegistry=1 /NoScripts=1 /S /D=%USERPROFILE%\Miniforge
cmd /K ""%USERPROFILE%/Miniforge/Scripts/activate.bat" "%USERPROFILE%/Miniforge""
```

### 🔹 2.2 Sanal Ortam Oluşturma ve Aktifleştirme

```bash
conda create -n cq
conda activate cq
```

### 📁 2.3 CadQuery Kurulumu

```bash
mamba install -c conda-forge cadquery
```

**Not**: mamba daha hızlıdır ve Miniforge ile otomatik gelir.

## 3. Yöntem: Pip ile Kurulum (Daha Teknik Kullanıcılar İçin)

pip ile doğrudan Python ortamına CadQuery kurulabilir. Ancak bu yöntem Conda kadar test edilmemiştir.

### ⚖️ 3.1 Sanal Ortam Oluşturma (Tavsiye Edilir)

```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/MacOS:
source venv/bin/activate
```

### 🔄 3.2 pip Güncelleme

```bash
python -m pip install --upgrade pip
```

### 📚 3.3 CadQuery Kurulumu

```bash
pip install cadquery
# En son geliştirme sürümü:
pip install git+https://github.com/CadQuery/cadquery.git
# Jupyter desteği:
pip install cadquery[ipython]
# Geliştirici ortamı:
pip install cadquery[dev]
```

## 🏋️ Kurulumu Test Etme

Python yorumlayıcısını açın ve şu kodu çalıştırın:

```python
import cadquery
print(cadquery.Workplane('XY').box(1, 2, 3).toSvg())
```

→ Terminalde \<svg> ile başlayan bir çıktı görüyorsanız, kurulum başarılı!

🧡 Bu seride öğrenirken eğlenmeyi ve kendi projeni üretmeyi unutma!  