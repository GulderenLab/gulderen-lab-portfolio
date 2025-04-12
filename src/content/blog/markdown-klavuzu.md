---
title: 'Kapsamlı Markdown Yazım Kılavuzu'
description: 'Markdown öğrenin: Basit işaretleme dili ile web için zengin ve yapılandırılmış içerikler (listeler, tablolar, bağlantılar, görseller ve daha fazlası) oluşturma rehberi.'
publishDate: 2025-04-11 # YYYY-MM-DD formatında
tags: ['markdown', 'yazım kılavuzu', 'işaretleme dili', 'metin biçimlendirme', 'listeler', 'tablolar', 'bağlantılar', 'referans bağlantılar', 'görseller', 'kod blokları', 'html entegrasyonu', 'md dosyaları']
image:
  src: '/images/markdown-klavuzu-kapak.png' # Public klasöründeki resim
  alt: 'Markdown yazım kuralları ve kılavuzu' # Alt metni biraz daha açıklayıcı yaptım
isDraft: false
---

Markdown, metinleri biçimlendirmek (örneğin; kalın, italik yapmak, başlık eklemek, listeler oluşturmak) için kullanılan, **sade ve kolay öğrenilir** bir işaretleme dilidir. Bu yazıda, Markdown kullanımını pratik örneklerle açıklayacağım.

------

## 1. Markdown: Neden ve Nerede?

* Öğrenmesi kolaydır.

* HTML'ye kıyasla daha sade ve okunabilir bir sözdizimi sunar.

* Markdown, yaygın olarak blog yazıları, GitHub depoları (özellikle README dosyaları), teknik dokümantasyonlar, forumlar ve not alma uygulamaları gibi alanlarda kullanılır.

-------------

## 2. Başlıklar

İlk olarak, Markdown'da başlıkların nasıl oluşturulduğuna bakalım. Bu kısmın başlığını aşağıdaki şekilde oluşturdum:

```markdown
## Başlıklar
```

Markdown'da başlık oluşturmak için # (diyez) işareti kullanılır. Tek bir # işareti ile en üst seviye (genellikle en büyük boyutlu olan Başlık 1 / H1) başlık oluşturulur. Kullanılan # işaretlerinin sayısı başlığın hiyerarşik seviyesini belirler (H1, H2, H3 vb.).

ℹ️ **Not**: Markdown'da genellikle en fazla altı farklı başlık seviyesi (H1'den H6'ya kadar) tanımlanmıştır. Bu, bir başlık için en fazla altı adet # işareti (######) kullanabileceğiniz anlamına gelir.

Örneğin, üçüncü seviye bir alt başlık (Başlık 3 / H3) oluşturmak için üç adet # işareti (###) kullanırız:

```markdown
### Alternatif Başlık Oluşturma Yolu
```
--------------------

### Alternatif Başlık Oluşturma Yolu

Bu başlığı oluşturmanın alternatif bir yolu da HTML kodu kullanmaktır:

```html
<h3>Alternatif Başlık Oluşturma Yolu</h3>
```

Fark edeceğiniz üzere, HTML'deki \<h3> etiketinde bulunan '3' rakamı, Markdown örneğimizdeki üç adet # sembolüne (###) doğrudan karşılık gelir. Başlıklarınızı bu iki yöntemden dilediğinizle yazabilirsiniz. Farklı başlık yazım stilleri aşağıdaki tabloda özetlenmiştir.

| Markdown (ATX `#` stili) | HTML (Kod Olarak)                         | İşlenen Çıktı (Rendered Output) |
| ----------------------- | ----------------------------------------- | ------------------------------- |
| # Başlık seviye 1  | \<h1>Başlık seviye 1\</h1> | <h1>Başlık seviye 1</h1>     |
| ## Başlık seviye 2  | \<h2>Başlık seviye 2\</h2> | <h2>Başlık seviye 2</h2>     |
| ### Başlık seviye 3 | \<h3>Başlık seviye 3\</h3> | <h3>Başlık seviye 3</h3>     |
| #### Başlık seviye 4| \<h4>Başlık seviye 4\</h4> | <h4>Başlık seviye 4</h4>     |
| ##### Başlık seviye 5| \<h5>Başlık seviye 5\</h5> | <h5>Başlık seviye 5</h5>     |
| ###### Başlık seviye 6| \<h6>Başlık seviye 6\</h6> | <h6>Başlık seviye 6</h6>     |

Markdown'da 'Setext' stili olarak bilinen alternatif bir başlık yöntemi de bulunur. Bu yöntemde, başlık metninin bir alt satırına eşittir işaretleri (=) ekleyerek Başlık 1 (H1), tire işaretleri (-) ekleyerek Başlık 2 (H2) oluşturulur. Genellikle === ve --- şeklinde en az üç karakter kullanılır. Aşağıdaki tabloda bu kullanımı görebilirsiniz.

| Markdown (Setext stili)             | HTML (Kod Olarak)                         | İşlenen Çıktı (Rendered Output) |
| ----------------------- | ----------------------------------------- | ------------------------------- |
|  Başlık seviye 1<br>======| \<h1>Başlık seviye 1\</h1> | <h1>Başlık seviye 1</h1>   |
|  Başlık seviye 2<br>------- | \<h2>Başlık seviye 2\</h2> | <h2>Başlık seviye 2</h2>   |

⚠️ **Not** :  Markdown'da başlık oluştururken # işareti (veya işaretleri) ile başlık metni arasında mutlaka bir boşluk bırakılmalıdır. Eğer boşluk olmazsa, metin başlık olarak yorumlanmaz!

✅ Doğru yazım:
```markdown
#### Başlık seviye 4
```

❌ Yanlış Yazım: 
```markdown
####Başlık seviye 4
```
-------------------

## 3. Vurgulama

Markdown'da metinleri **kalın**, *italik* veya ~~üstü çizili~~ gibi stillerle vurgulayabilir, hatta bu biçimlendirmeleri birleştirebilirsiniz. İşte bu temel vurgulama yöntemleri:


### Kalın (Bold) Metin

Kalın metin oluşturmak için metni çift yıldız (**) veya çift alt çizgi (__) arasına alabilirsiniz.

Örnek:

```markdown
"Yaşamak bir ağaç gibi **tek** ve __hür__

ve bir orman gibi **kardeşçesine**,

bu __hasret__ bizim." — Nazım Hikmet
```
Bu Markdown kodunu yazdığımızda, çift yıldız (**) veya çift alt çizgi (__) arasına alınan kısımlar kalın olarak görüntülenir:

----

"Yaşamak bir ağaç gibi **tek** ve __hür__

ve bir orman gibi **kardeşçesine**,

bu __hasret__ bizim." — Nazım Hikmet

-------------------

### İtalik (Italic) Metin

İtalik metin oluşturmak için metni tek yıldız (*) veya tek alt çizgi (_) arasına alabilirsiniz.

Örnek: 
```markdown
*İnsan*, aradığı gerçeği sadece kendinde bulabilir, dış dünyada değil. — Sokrates
```

Bu Markdown kodunu yazdığımızda, yıldız (*) arasına alınan kısımlar italik olarak görüntülenir:

*İnsan*, aradığı gerçeği sadece kendinde bulabilir, dış dünyada değil. — Sokrates

--------------------

### Kalın ve İtalik Birleşimi

Hem kalın hem de italik metin oluşturmak için metni üç yıldız (***) veya üç alt çizgi (___) arasına alabilirsiniz. 

Örnek:

```markdown
- **İnfluenza Tedavisi:**
  - **_M2 protein İnhibitörleri_**... *Amantadin*, *Rimantadin*; **Sadece İnfluenzae A' ya etkili**
  - **_Nöraminidaz İnhibitörleri_**... *Oselamivir* (oral), *Zanamivir* (inhaler), *Peramivir* (IV)
  - **_Nöraminidaz inhibitörleri_** hem **İnfluenzae A** hem de **İnfluenzae B** tedavisinde kullanılır.
```


- **İnfluenza Tedavisi:**
  - **_M2 protein İnhibitörleri_**... *Amantadin*, *Rimantadin*; **Sadece İnfluenzae A' ya etkili**
  - **_Nöraminidaz İnhibitörleri_**... *Oselamivir* (oral), *Zanamivir* (inhaler), *Peramivir* (IV)
  - **_Nöraminidaz inhibitörleri_** hem **İnfluenzae A** hem de **İnfluenzae B** tedavisinde kullanılır.

----------------

### Üstü Çizili Metin

Üstü çizili metin oluşturmak için metni çift tilde (~~) arasına alabilirsiniz.

Örnek:

```markdown
- Yapılacaklar listesi:
  - ~~Spor yap~~
  - Makalenin son kontrollerini yap yayınla
  - ~~E-postaları kontrol et~~
```
- Yapılacaklar listesi:
  - ~~Spor yap~~
  - Makalenin son kontrollerini yap yayınla
  - ~~E-postaları kontrol et~~

---------

### Altı Çizili Metin

Markdown'ın standart sürümünde altı çizili metin desteği bulunmamaktadır. Ancak, HTML etiketleri kullanarak altı çizili metin oluşturabilirsiniz.

```html
<u>altının çizli olmasını istediğini kelimeler veya cümleler</u>
```

Örnek: 

```html
Uzun yıllar boyunca bilim insanları, beynin çocukluk döneminden sonra yeni sinir hücreleri üretemediğini düşünüyordu. Ancak son araştırmalar gösteriyor ki hipokampus (öğrenme ve hafıza merkezi), yetişkinlikte de yeni nöronlar üretebiliyor. Bu sürece <u>nörogenez</u> deniyor.
```

Uzun yıllar boyunca bilim insanları, beynin çocukluk döneminden sonra yeni sinir hücreleri üretemediğini düşünüyordu. Ancak son araştırmalar gösteriyor ki hipokampus (öğrenme ve hafıza merkezi), yetişkinlikte de yeni nöronlar üretebiliyor. Bu sürece <u>nörogenez</u> deniyor.

--------

### Renkli Metin veya Özel Stiller

Standart Markdown'da metinleri renklendirmek için doğrudan bir özellik bulunmaz. Ancak, Markdown genellikle HTML kullanımına izin verdiği için, renk eklemek amacıyla HTML etiketlerini (örneğin \<span style='color: orange;'>Turuncu Metin</span\> <span style='color: orange;'>Turuncu Metin</span>) ve CSS stillerini kullanabilirsiniz. Bu, satır içi (inline) CSS ile veya Tailwind CSS gibi harici bir CSS çerçevesi/kütüphanesi kullanarak yapılabilir.

Aşağıdaki örnek, Markdown'un liste oluşturma özelliklerini (- ve girintileme) ve renkli metinler için satır içi HTML/CSS (<span style='...'>) kullanımını bir arada göstermektedir:

```markdown
- **Enfektif Endokardit Tanı Kriterleri (Duke Kriterleri):**
    - **Major kriterler:**
        - **Pozitif kan kültürleri:**
            - <span style="color: Fuchsia; font-weight: bold;">3 ayrı kan kültürünün hepsinde pozitiflik</span>
        - **Endokardit bulgusu:**
            - <span style="color: ForestGreen; font-weight: bold;">Protez kapakta ayrışma</span>
            - <span style="color: Goldenrod; font-weight: bold;">Yeni ortaya çıkmış valvüler yetmezlik</span>
    - **Minör kriterler:**
        - <span style="color: SkyBlue; font-weight: bold;">İ.V ilaç kullanımı, altta yatan kalp hastalığı</span>
        - <span style="color: GreenYellow; font-weight: bold;">Ateş > 38°C</span>
        - <span style="color: JungleGreen; font-weight: bold;">Major kriterlere uymayan kan kültürleri</span>
``` 
Bu kod işlendiğinde, Markdown'un liste yapısı korunurken, <span ...> etiketleri içerisindeki metinler belirtilen renklerde (ve font-weight: bold; sayesinde kalın olarak) görüntülenir. İşlenmiş çıktı şu şekildedir:

- **Enfektif Endokardit Tanı Kriterleri (Duke Kriterleri):**
    - **Major kriterler:**
        - **Pozitif kan kültürleri:**
            - <span style="color: Fuchsia; font-weight: bold;">3 ayrı kan kültürünün hepsinde pozitiflik</span>
        - **Endokardit bulgusu:**
            - <span style="color: ForestGreen; font-weight: bold;">Protez kapakta ayrışma</span>
            - <span style="color: Goldenrod; font-weight: bold;">Yeni ortaya çıkmış valvüler yetmezlik</span>
    - **Minör kriterler:**
        - <span style="color: SkyBlue; font-weight: bold;">İ.V ilaç kullanımı, altta yatan kalp hastalığı</span>
        - <span style="color: GreenYellow; font-weight: bold;">Ateş > 38°C</span>
        - <span style="color: JungleGreen; font-weight: bold;">Major kriterlere uymayan kan kültürleri</span>

-------------

🎨 Markdown'da HTML etiketlerini kullanarak metinlere renk katabilirsiniz. Bu yöntem, özellikle vurgulamak istediğiniz noktaları görsel olarak ayırmak için kullanışlıdır.

Bunun için genellikle ```<span>``` HTML etiketi ve ```style``` özelliği içinde ```color``` tanımlaması kullanılır. Sözdizimi şöyledir:

`<span style="color:RENK_ADI_VEYA_HEX_KODU; overflow-wrap: break-word; word-wrap: break-word;">Renklendirmek istediğiniz metin buraya gelecek.</span>`

Aşağıda yaygın olarak kullanılan bazı renk isimleri ve birkaç Hex kodu örneği ile birlikte nasıl göründükleri listelenmiştir:

### Yaygın Renk İsimleri ile Örnekler

*   **Kırmızı (Red):** <span style="color:red;">Bu metin kırmızıdır.</span>
*   **Mavi (Blue):** <span style="color:blue;">Bu metin mavidir.</span>
*   **Yeşil (Green):** <span style="color:green;">Bu metin yeşildir.</span>
*   **Turuncu (Orange):** <span style="color:orange;">Bu metin turuncudur.</span>
*   **Mor (Purple):** <span style="color:purple;">Bu metin mordur.</span>
*   **Pembe (Pink):** <span style="color:pink;">Bu metin pembedir.</span>
*   **Kahverengi (Brown):** <span style="color:brown;">Bu metin kahverengidir.</span>
*   **Gri (Gray):** <span style="color:gray;">Bu metin gridir.</span>
*   **Camgöbeği (Cyan/Aqua):** <span style="color:cyan;">Bu metin camgöbeğidir.</span>
*   **Eflatun (Magenta/Fuchsia):** <span style="color:magenta;">Bu metin eflatundur.</span>
*   **Sarı (Yellow):** <span style="color:yellow; background-color:gray;">Bu metin sarıdır (okunabilirlik için gri arka plan eklendi).</span>
    *   *Not: Saf sarı gibi açık renkler beyaz arka planda zor okunabilir.* Ayrıca bunun kodu şu şekildedir: 
    * 
      ```html
        <span style="color:#E6E6FA; background-color:dimgray;">Bu metin lavanta rengidir (okunabilirlik için koyu gri arka plan eklendi).</span>
      ```
*   **Siyah (Black):** <span style="color:black; background-color:white;">Bu metin siyahtır (varsayılan renk olabilir).</span>

### Hex Renk Kodları ile Örnekler

Renk isimlerinin yanı sıra, çok daha geniş bir renk yelpazesi için Hex kodlarını (#RRGGBB formatında) kullanabilirsiniz:

*   **Domates Kırmızısı (#FF6347):** <span style="color:#FF6347;">Bu metin domates kırmızısıdır.</span>
*   **Çelik Mavisi (#4682B4):** <span style="color:#4682B4;">Bu metin çelik mavisidir.</span>
*   **Orman Yeşili (#228B22):** <span style="color:#228B22;">Bu metin orman yeşilidir.</span>
*   **Altın Sarısı (#FFD700):** <span style="color:#FFD700;">Bu metin altın sarısıdır.</span>
*   **Canlı Pembe (#FF1493):** <span style="color:#FF1493;">Bu metin canlı pembedir.</span>
*   **Lavanta Rengi (#E6E6FA):** <span style="color:#E6E6FA; background-color:dimgray;">Bu metin lavanta rengidir (okunabilirlik için koyu gri arka plan eklendi).</span> Bunun kodu şu şekildedir: 

    * 
      ```html
        <span style="color:#E6E6FA; background-color:dimgray;">Bu metin lavanta rengidir (okunabilirlik için koyu gri arka plan eklendi).</span>
      ```


---

> [UYARI!]
>
> **Uyumluluk Notu:** Bu HTML etiketlerinin ve `style` özelliklerinin çalışması, kullandığınız Markdown yorumlayıcısının (örneğin GitHub, GitLab, Obsidian, VS Code önizlemesi vb.) satır içi HTML'i işlemesine bağlıdır. Bazı kısıtlı yorumlayıcılar bu renkleri göstermeyebilir ve HTML kodunu olduğu gibi görüntüleyebilir.

-----------

## 4. Kod Vurgusu

Markdown'da kod vurgusu iki şekilde yapılabilir:

### Satır içi kod vurgusu

Bir satır içinde kodu vurgulamak için kod ` (tek backtick) ile çevrelenir:

Örnek:

```markdown
`printf("Merhaba, dünya!");` komutu ekrana yazı yazdırır.
```

printf("Merhaba, dünya!"); komutu ekrana yazı yazdırır.

--------

### Blok kod vurgusu

Çok satırlı kodları vurgulamak için üç ters tırnak (\``` \```) kullanılır. İstenirse dil ismi eklenerek sözdizimi renklendirmesi de yapılabilir.

Örnek:

\```
python

def palindromlari_bul(cumle):

import string

temiz = cumle.lower().translate(str.maketrans('', '', string.punctuation))

kelimeler = temiz.split()

return [k for k in kelimeler if k == k[::-1] and len(k) > 1]

cumle = "Ey gece! Kalbinde bir sır var; adanmış bir nesil, bir ana, bir arif, bir ada, bir nehir."

print(palindromlari_bul(cumle))  # ['ana', 'ada']
\```

Şeklinde üç ters tırnak (\``` \```) arasına bir python kodunu yazarsak işlenen çıktı şu şekilde olur:

```python
def palindromlari_bul(cumle):
    import string
    temiz = cumle.lower().translate(str.maketrans('', '', string.punctuation))
    kelimeler = temiz.split()
    return [k for k in kelimeler if k == k[::-1] and len(k) > 1]

cumle = "Ey gece! Kalbinde bir sır var; adanmış bir nesil, bir ana, bir arif, bir ada, bir nehir."
print(palindromlari_bul(cumle))  # ['ana', 'ada']

```

ℹ️ **Not** : Markdown, kod bloklarında python, javascript, html, bash, cpp, json gibi birçok dil için sözdizimi renklendirmesini (syntax highlighting) destekler. Renklendirmeyi etkinleştirmek için, kod bloğunu başlatan üç ters tırnağın (\```) hemen ardından ilgili dilin adını belirtmeniz yeterlidir (örneğin: \```python veya \```javascript). Kod bloğu yine üç ters tırnakla (\```) kapatılır.

---------

## 5. Alıntı Yazma

Markdown'da bir metni alıntı bloku olarak biçimlendirmek için, ilgili satırların başına > işareti (genellikle bir boşluk takip eder) eklenir.

Örneğin, aşağıdaki Markdown kodu:

```markdown
> Sevdiğiniz çiçek, milyonlarca yıldızdan yalnız birinde bile bulunsa yıldızlara bakmak mutluluğunuz için yeterlidir. — Küçük Prens
``` 
Şu şekilde işlenir ve bir alıntı bloku olarak görüntülenir:

-------------

> Sevdiğiniz çiçek, milyonlarca yıldızdan yalnız birinde bile bulunsa yıldızlara bakmak mutluluğunuz için yeterlidir. — Küçük Prens

-------------------

Çok satırlı alıntı için cümleler arasında bir satırlık boşluk bırakıp, boş satır dahil tüm satırların önüne > işareti yazmalıyız. Örneğin, aşağıdaki Markdown kodu: 

```markdown
>"İnsanlık öldü mü?" dedim.
>
>"Yok" dedi, "ölmedi, ölmedi ama, bir şeyler oldu, başka bir yerlerde sıkıştı kaldı herhalde?"
>
>"Nerede kaldı acaba?"
>
>"Kuşlar da gitti" dedi.. — Kuşlar da gitti - Yaşar Kemal
``` 

Şu şekilde işlenir ve bir alıntı bloku olarak görüntülenir:

>"İnsanlık öldü mü?" dedim.
>
>"Yok" dedi, "ölmedi, ölmedi ama, bir şeyler oldu, başka bir yerlerde sıkıştı kaldı herhalde?"
>
>"Nerede kaldı acaba?"
>
>"Kuşlar da gitti" dedi.. — Kuşlar da gitti - Yaşar Kemal

### İç içe alıntı yazma

İç içe alıntı için > karakterini art arda kullanırız. Dış alıntı için >, içindeki alıntı için >> şeklinde.

Örneğin, aşağıdaki Markdown kodu:

```markdown
> Ali, eski sandıktan çıkan mektubu okurken gözleri dolmuştu. Mektupta amcası şöyle yazmıştı:
>
>> Sevgili yeğenim, hayat bazen zorludur. Unutma ki büyük şairin dediği gibi:
>>
>>> "Beklenen Gemi" gelmese de umudunu yitirme. Liman her zaman oradadır.
>>
>> Bu sözler sana güç versin.
>
> Ali mektubu katlarken, amcasının ve o şairin ne kadar haklı olduğunu düşündü.
```

Şu şekilde işlenir ve bir alıntı bloku olarak görüntülenir:

----------------

> Ali, eski sandıktan çıkan mektubu okurken gözleri dolmuştu. Mektupta amcası şöyle yazmıştı:
>
>> Sevgili yeğenim, hayat bazen zorludur. Unutma ki büyük şairin dediği gibi:
>>
>>> "Beklenen Gemi" gelmese de umudunu yitirme. Liman her zaman oradadır.
>>
>> Bu sözler sana güç versin.
>
> Ali mektubu katlarken, amcasının ve o şairin ne kadar haklı olduğunu düşündü.

--------------------

> <span style="color:#FF6347;"> **[ UYARI: İşleyiciye Bağlı Görselleştirme ]** </span>
>
> Lütfen bu yazıdaki Markdown örneklerinin (özellikle `>` ile oluşturulan alıntı blokları, kod blokları vb.) sizin görüntülediğiniz ortamda **tam olarak aynı şekilde görünmeyebileceğini** unutmayın.
>
> Markdown'ın kendisi öncelikle içeriğin *semantik yapısını* tanımlar. Bu yapının nihai *görsel sunumu* ise tamamen kullanılan Markdown **işleyicisine (parser/renderer)** ve ona eşlik eden **CSS kurallarına** bağlıdır.
>
> *   **Farklı Ortamlar:** GitHub, GitLab, bir IDE önizlemesi (VS Code gibi), Obsidian, statik site üretecinizin varsayılan teması veya bu blogun kendi stil dosyaları gibi her ortam, Markdown öğelerini kendi CSS'i ile yorumlar ve stilize eder.
> *   **Stil Farklılıkları:** Bu durum, alıntıların kenarlık (`border`), iç boşluk (`padding`), arka plan rengi (`background-color`), kod bloklarının yazı tipi ve renklendirmesi gibi görsel detaylarda farklılıklara yol açacaktır.
>
> Bu, Markdown ekosisteminin doğal bir sonucudur ve bir "hata" değildir. Odak noktası, temel Markdown sözdiziminin tutarlılığı ve taşınabilirliğidir; görsel tutarlılık ikincil bir hedeftir ve genellikle platforma özeldir.

---------------

## 6. Emoji veya Özel İşaretlerin Kullanımı

Emoji ve özel işaretler, Markdown belgelerinize görsel çekicilik katmak, tonu ayarlamak, önemli noktaları vurgulamak veya belirli kavramları hızlıca temsil etmek için harika bir yoldur. Kullanımları genellikle basittir, ancak platformlar arasında farklılıklar gösterebilir.

### Emojilerin Kullanımı

Emojileri Markdown'a eklemenin en yaygın yolları şunlardır:

1.  **Doğrudan Kopyala & Yapıştır:** En evrensel yöntemdir. İşletim sisteminizin emoji seçicisini (Windows'ta `Win + .`, macOS'ta `Cmd + Ctrl + Space`) kullanarak veya web sitelerinden (getemoji.com gibi) kopyalayıp doğrudan metninize yapıştırabilirsiniz.

    *   Proje tamamlandı! 🎉
    *   ⚠️ Dikkat: Bu işlem verileri silebilir.
    *   Yeni özellikler için fikirlere açığız 🤔💡

2.  **Emoji Kısa Kodları (Shortcodes - Platforma Bağlı):** Bazı Markdown platformları (GitHub, GitLab, Slack vb.) emoji kısa kodlarını destekler. Bunlar genellikle iki nokta üst üste (`:`) arasına alınan anahtar kelimelerdir. Ancak bu, **standart Markdown özelliği değildir** ve her yerde çalışmayabilir.

    *   `:warning:` -> ⚠️ (Desteklenen platformlarda)
    *   `:rocket:` -> 🚀 (Desteklenen platformlarda)
    *   `:sparkles:` -> ✨ (Desteklenen platformlarda)
    *   `:thumbsup:` -> 👍 (Desteklenen platformlarda)

**Yaygın Emoji Kullanım Örnekleri:**

*   **Notlar ve Bilgilendirme:**
    *   ℹ️ **Bilgi:** Sunucu bakımı Pazar günü saat 02:00'de yapılacaktır.
    *   📝 **Not:** Yapılandırma detayları için `config.yaml` dosyasına bakın.
    *   📌 **Hatırlatma:** Son teslim tarihi yarın.
    *   💡 **İpucu:** Daha hızlı arama için filtreleri kullanın.
    *   👉 **Yönlendirme:** Detaylar için [bu bağlantıya](https://getemoji.com/) bakın.

*   **Uyarılar ve Önem Vurgusu:**
    *   ⚠️ **Uyarı:** Yedekleme yapmadan devam etmeyin.
    *   ❗ **Önemli:** Bu adım kritiktir.
    *   🔥 **Sıcak Gelişme:** Yeni sürüm yayınlandı!
    *   🛑 **Dur:** Bu alan yalnızca yetkili personel içindir.
    *   🚫 **Yasak:** Test ortamında `rm -rf /` komutunu kullanmayın.
    *   ❌ **Hata:** Bağlantı kurulamadı.
    *   🚨 **Acil:** Güvenlik açığı tespit edildi, lütfen güncelleyin.

*   **Durum Bildirme ve Başarı:**
    *   ✅ **Tamamlandı:** Görev başarıyla bitti.
    *   ✔️ **Onaylandı:** Değişiklikler kabul edildi.
    *   ⏳ **Beklemede:** İşlem devam ediyor...
    *   🔄 **İşleniyor:** Veriler senkronize ediliyor.
    *   🚧 **Yapım Aşamasında:** Bu bölüm henüz tamamlanmadı.
    *   🎉 **Başarı:** Yeni özellik kullanıma hazır!

*   **Konseptler, Duygular ve Listeler:**
    *   ⚙️ **Ayarlar:** Yapılandırma menüsü.
    *   🔗 **Bağlantı:** İlgili dokümanlar.
    *   🔒 **Güvenlik:** Parola politikası.
    *   🔑 **Çözüm:** Sorunun anahtarı burada.
    *   🐛 **Hata (Bug):** Bilinen sorunlar listesi.
    *   💬 **Yorum:** Kullanıcı geri bildirimleri.
    *   🚀 **Performans:** Optimizasyon ipuçları.
    *   🤔 **Soru:** Bu nasıl çalışıyor?
    *   😊 **Memnuniyet:** Geri bildiriminiz için teşekkürler!
    *   ❤️ **Favori:** En sevdiğim özellik bu.
    *   **Yapılacaklar:**
        *   🛒 Alışveriş listesini hazırla
        *   📧 E-postaları kontrol et
        *   🧹 Odayı temizle

### Özel İşaretlerin (Sembollerin) Kullanımı

Standart klavyede bulunmayan ancak metin içinde kullanışlı olabilecek pek çok Unicode karakteri vardır. Bunları da genellikle kopyala-yapıştır yöntemiyle ekleyebilirsiniz:

*   **Oklar:** ← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↩ ↪
*   **Matematiksel:** ± × ÷ ≈ ≠ ≤ ≥ ∞ √ ∑ ∫ π °
*   **Para Birimleri:** $ € £ ¥ ₺ (Türk Lirası) ₽
*   **Noktalama ve Diğer:** © ® ™ • … ¶ § † ‡ ※ « » ‹ ›
*   **Geometrik Şekiller:** ■ □ ▪ ▫ ● ○ ◆ ◇ ★ ☆

**Örnek:**

*   Sıcaklık: 25°C ± 2°C
*   Telif Hakkı © 2025 Gulderen Lab. Tüm hakları saklıdır ®.
*   Fiyat: 100 ₺ (KDV Dahil)
*   İlerleme: ●●●○○ (%60)

### Markdown Özel Karakterlerinden Kaçınma (Escaping)

Bazen Markdown'ın biçimlendirme için kullandığı özel karakterleri (`*`, `_`, `#`, `[`, `]`, `(`, `)`, `` ` ``, `\`, `.` (listelerde), `+`, `-` vb.) metin içinde **gerçek anlamlarıyla** kullanmak isteyebilirsiniz. Bu durumlarda, karakterin Markdown tarafından yorumlanmasını engellemek için önüne bir ters bölü çizgisi (`\`) koymanız gerekir. Buna "kaçınma" (escaping) denir.

*   Gerçekten \*italik olmayan\* bir yıldız işareti göstermek için: `\*italik olmayan\*`
*   `#` karakterini başlık olarak değil, metin olarak kullanmak için: `\#bu bir başlık değil`
*   Liste öğesi olarak yorumlanmayacak bir sayı: `1984\. yılı önemli bir yıldı.` (sayıdan sonraki noktadan kaçınma)
*   Köşeli parantezleri link olarak yorumlatmamak: `\[Bu bir link değil]`
*   Ters taksimin kendisini göstermek: `\\`

---

> [!ÖNEMLİ]
> **Uyumluluk ve Görünüm Notu:**
> *   Emojilerin görünümü işletim sistemleri, tarayıcılar ve uygulamalar arasında biraz farklılık gösterebilir.
> *   Emoji kısa kodlarının (`:kod:`) çalışması tamamen kullandığınız Markdown platformuna bağlıdır.
> *   HTML varlıkları (`©` gibi) da bazı platformlarda çalışabilir, ancak kopyala-yapıştır genellikle daha basittir.
> *   Karakterlerden kaçınma (`\`) standart Markdown özelliğidir ve çoğu yerde çalışmalıdır.


----------------

## 7. Listeler

Markdown'da içerik oluştururken, bilgileri yapılandırmanın ve okunabilirliği artırmanın en etkili yollarından biri listeleri kullanmaktır. İster bir dizi talimat, ister özelliklerin dökümü, isterse basit bir not listesi olsun, Markdown size hem **sırasız (madde işaretli)** hem de **sıralı (numaralı)** listeler oluşturmak için basit ve güçlü araçlar sunar. Hatta bazı gelişmiş Markdown yorumlayıcıları **görev listeleri (checklist)** oluşturmanıza bile olanak tanır.

Bu bölümde, Markdown'da listelerin nasıl oluşturulacağını, iç içe nasıl geçirileceğini ve daha karmaşık içerikleri listeler içinde nasıl kullanacağınızı detaylıca inceleyeceğiz.

---

### 1. Sırasız Listeler

Öğelerin belirli bir sıraya sahip olmasının gerekmediği durumlar için idealdir. Örneğin, bir alışveriş listesi, özellikler listesi veya beyin fırtınası notları.

**Nasıl Oluşturulur?**

Sırasız liste oluşturmak için satır başına şu karakterlerden birini koyup ardından bir boşluk bırakmanız yeterlidir:

*   Yıldız (`*`)
*   Artı (`+`)
*   Tire (`-`)

Markdown yorumlayıcınız bu işaretçileri genellikle • (dolu daire), ○ (içi boş daire) veya ▪ (kare) gibi madde işaretlerine dönüştürecektir.

**Örnek:**

```markdown
*   Elma
*   Armut
*   Portakal

+   Kırmızı
+   Yeşil
+   Mavi

-   Görev 1
-   Görev 2
-   Görev 3
```

Bu listelerin görünümü şu şekildedir:

----

*   Elma
*   Armut
*   Portakal

+   Kırmızı
+   Yeşil
+   Mavi

-   Görev 1
-   Görev 2
-   Görev 3

----

💡 **İpucu**: Aynı liste içinde farklı işaretçiler (*, +, -) kullanabilirsiniz, ancak kodunuzun daha okunabilir ve tutarlı olması için genellikle tek bir liste içinde aynı işaretçiyi kullanmak iyi bir pratiktir.

-----

### 2. Sıralı Listeler 

Öğelerin belirli bir adım sırasını veya öncelik sırasını takip etmesi gerektiğinde kullanılır. Talimatlar, tarifler veya sıralamalar için mükemmeldir.

**Nasıl Oluşturulur?**

Sıralı liste oluşturmak için satır başına bir sayı, ardından bir nokta (.) ve bir boşluk koymanız gerekir.

Örnek:

```markdown
1.  Web sitesine gidin.
2.  Kullanıcı adınızı girin.
3.  Parolanızı girin.
4.  "Giriş Yap" düğmesine tıklayın.
```

Bu listenin görünümü şu şekildedir:

1.  Web sitesine gidin.
2.  Kullanıcı adınızı girin.
3.  Parolanızı girin.
4.  "Giriş Yap" düğmesine tıklayın.

------

#### **Önemli Bir Özellik: Otomatik Numaralandırma**

Markdown'ın en güzel yanlarından biri, sıralı listelerdeki sayıları sizin için otomatik olarak düzeltmesidir! Listeyi yazarken hangi sayıları kullandığınızın bir önemi yoktur; Markdown çıktıyı her zaman doğru sırayla (1, 2, 3, ...) oluşturacaktır.

Örnek:

```markdown
1.  İlk madde
1.  İkinci madde (Yine '1.' kullandım)
5.  Üçüncü madde ('5.' kullandım)
3.  Dördüncü madde ('3.' kullandım)
```

Bu listenin görünümü şu şekildedir:

----

1.  İlk madde
1.  İkinci madde (Yine '1.' kullandım)
5.  Üçüncü madde ('5.' kullandım)
3.  Dördüncü madde ('3.' kullandım)

>💡 İpucu: Otomatik numaralandırma harika olsa da, Markdown kodunuzun okunabilirliği açısından listelerinizi yazarken doğru sayı sırasını kullanmanız genellikle tavsiye edilir. Bu, daha sonra listeye baktığınızda mantığı daha kolay anlamanıza yardımcı olur. Ayrıca, bir listeyi 1. dışında bir sayıyla da başlatabilirsiniz (örneğin 5. Madde 5 şeklinde), Markdown genellikle bu başlangıç sayısını korur ve devamını ona göre numaralandırır.

Örnek:

```markdown
5. Kurulum dosyasını çalıştırın.
6. Lisans sözleşmesini kabul edin.
7. Kurulum türünü seçin.
```

Bu listenin görünümü şu şekildedir:

5. Kurulum dosyasını çalıştırın.
6. Lisans sözleşmesini kabul edin.
7. Kurulum türünü seçin.

-----

### 3. İç İçe Listeler

Listelerin gücü, onları iç içe geçirebilmenizle daha da artar. Bu, hiyerarşik yapılar veya alt maddeler oluşturmak için çok kullanışlıdır.

**Nasıl Oluşturulur?**

Bir liste öğesini bir üst öğenin altına yerleştirmek için, alt öğeyi **girintili (indentation)** olarak yazmanız yeterlidir. Genellikle **2 veya 4 boşluk** standart girinti seviyesi olarak kabul edilir.

-----

Örnek (Sırasız İç İçe):

```markdown
*   Meyveler
    *   Elma
        - Fuji
        - Golden
    *   Muz
    *   Çilek
*   Sebzeler
    *   Brokoli
    *   Havuç
        + Bebek Havuç
        + Normal Havuç
```

Görünüm:


*   Meyveler
    *   Elma
        - Fuji
        - Golden
    *   Muz
    *   Çilek
*   Sebzeler
    *   Brokoli
    *   Havuç
        + Bebek Havuç
        + Normal Havuç

------

Örnek (Sıralı İç İçe):

```markdown
1.  Proje Başlangıcı
    1.  Gereksinim Analizi
    2.  Teklif Hazırlama
2.  Geliştirme Fazı
    1.  Tasarım
        1.  Arayüz Tasarımı
        2.  Veritabanı Tasarımı
    2.  Kodlama
    3.  Testler
3.  Teslimat
```

Görünüm:


1.  Proje Başlangıcı
    1.  Gereksinim Analizi
    2.  Teklif Hazırlama
2.  Geliştirme Fazı
    1.  Tasarım
        1.  Arayüz Tasarımı
        2.  Veritabanı Tasarımı
    2.  Kodlama
    3.  Testler
3.  Teslimat

------

Örnek (Karışık İç İçe):

```markdown
*   Donanım Gereksinimleri
    1.  İşlemci: Minimum i5
    2.  RAM: 8 GB (Önerilen: 16 GB)
    3.  Depolama:
        - SSD: 256 GB
        - HDD: (Opsiyonel) 1 TB
*   Yazılım Gereksinimleri
    - İşletim Sistemi: Windows 10+, macOS 11+
    - Tarayıcı: Chrome, Firefox, Safari (Son Sürümler)
```

Görünüm:


*   Donanım Gereksinimleri
    1.  İşlemci: Minimum i5
    2.  RAM: 8 GB (Önerilen: 16 GB)
    3.  Depolama:
        - SSD: 256 GB
        - HDD: (Opsiyonel) 1 TB
*   Yazılım Gereksinimleri
    - İşletim Sistemi: Windows 10+, macOS 11+
    - Tarayıcı: Chrome, Firefox, Safari (Son Sürümler)


> ⚠️ **Dikkat** : İç içe listelerde tutarlı girintileme hayati önem taşır. Yanlış veya tutarsız girintileme, listenizin beklediğiniz gibi görünmemesine veya tamamen bozulmasına neden olabilir. Genellikle ya hep 2 boşluk ya da hep 4 boşluk kullanmak en iyisidir.

-----

### 4. Görev Listeleri

Özellikle proje yönetimi, yapılacaklar listeleri veya adımların takibi için kullanılan harika bir özelliktir. Ancak bu, standart Markdown'ın bir parçası değildir; genellikle **GitHub Flavored Markdown (GFM)** gibi genişletilmiş Markdown sürümlerinde bulunur.

**Nasıl Oluşturulur?**

Sırasız bir liste öğesi gibi başlar, ancak işaretçiden sonra [ ] (boş kutu - tamamlanmamış) veya [x] (dolu kutu - tamamlanmış) eklenir. x büyük veya küçük harf olabilir.

```markdown
- [x] Blog yazısı için konu belirle
- [x] Ana başlıkları oluştur
- [ ] Listeler bölümünü detaylı yaz
    - [x] Sırasız listeler
    - [x] Sıralı listeler
    - [ ] İç içe listeler
    - [ ] Görev listeleri (Şu an yazılıyor!)
    - [ ] Gelişmiş biçimlendirme
- [ ] Diğer bölümleri tamamla
- [ ] Yazıyı gözden geçir ve yayınla
```

Görünüm (GFM destekleyen platformlarda):

- [x] Blog yazısı için konu belirle
- [x] Ana başlıkları oluştur
- [ ] Listeler bölümünü detaylı yaz
    - [x] Sırasız listeler
    - [x] Sıralı listeler
    - [ ] İç içe listeler
    - [ ] Görev listeleri (Şu an yazılıyor!)
    - [ ] Gelişmiş biçimlendirme
- [ ] Diğer bölümleri tamamla
- [ ] Yazıyı gözden geçir ve yayınla

> ℹ️ **Not** : Görev listelerinin görünümü ve işlevselliği (örneğin kutucuklara tıklayarak işaretleyebilme) kullandığınız platforma (GitHub, GitLab, Obsidian vb.) göre değişir. Her Markdown yorumlayıcısı bunu desteklemeyebilir.

### 5. Liste Öğeleri İçinde Gelişmiş Biçimlendirme

Liste öğeleri sadece basit metinler içermek zorunda değildir. İçlerine paragraflar, kod blokları, alıntılar ve hatta başka listeler ekleyebilirsiniz. Buradaki anahtar nokta yine **doğru ve tutarlı girintilemedir**.

#### a. **Liste Öğesi İçinde Paragraflar:**

Bir liste öğesine birden fazla paragraf eklemek için, ikinci ve sonraki paragrafları, liste işaretçisinin başlangıcıyla aynı hizada olacak şekilde (genellikle 4 boşluk) girintileyin.

Örnek:

```markdown
*   Bu, liste öğesinin ilk paragrafıdır. Oldukça basit.

    Bu ise aynı liste öğesine ait ikinci paragraftır. Dikkat ederseniz, başında `*` yok ama ilk paragrafın girintisiyle aynı hizada başlıyor. Bu, Markdown'a bunun hala ilk maddeye ait olduğunu söyler.

*   Bu da ikinci liste öğesi. Normal tek bir paragraf.
```

Görünüm:

*   Bu, liste öğesinin ilk paragrafıdır. Oldukça basit.

    Bu ise aynı liste öğesine ait ikinci paragraftır. Dikkat ederseniz, başında `*` yok ama ilk paragrafın girintisiyle aynı hizada başlıyor. Bu, Markdown'a bunun hala ilk maddeye ait olduğunu söyler.

*   Bu da ikinci liste öğesi. Normal tek bir paragraf.

#### b. **Liste Öğesi İçinde Kod Blokları:**
Kod bloklarını bir liste öğesine eklemek için, kod bloğunu genellikle **iki seviye** girintilemeniz gerekir (örneğin, liste öğesi 4 boşlukla girintiliyse, kod bloğu 8 boşlukla girintilenir).

------

Örnek:

```python
1.  Aşağıdaki Python kodunu çalıştırın:

        python
        def greet(name):
          print(f"Merhaba, {name}!")

        greet("Dünya")

2.  Çıktıyı kontrol edin. Çıktı "Merhaba, Dünya!" olmalıdır.

    Bu adım için ek notlar buraya eklenebilir, yine doğru girintileme ile.
```

Görünüm:

1.  Aşağıdaki Python kodunu çalıştırın:

        ```python
        def greet(name):
          print(f"Merhaba, {name}!")

        greet("Dünya")
        ```

2.  Çıktıyı kontrol edin. Çıktı "Merhaba, Dünya!" olmalıdır.

    Bu adım için ek notlar buraya eklenebilir, yine doğru girintileme ile.

#### c. **Liste Öğesi İçinde Blok Alıntılar (Blockquotes):**

Alıntıları da benzer şekilde, liste öğesinin girintisine ek olarak > karakterini girintileyerek ekleyebilirsiniz.

Örnek:

```markdown
*   İlk önemli nokta budur.
*   İkinci nokta şudur, ancak bir alıntı içerir:

    > Bu, ikinci liste öğesinin içine yerleştirilmiş bir blok alıntıdır.
    > Girintilemeye dikkat edin.

*   Ve son olarak üçüncü nokta.
```

Görünüm:

*   İlk önemli nokta budur.
*   İkinci nokta şudur, ancak bir alıntı içerir:

    > Bu, ikinci liste öğesinin içine yerleştirilmiş bir blok alıntıdır.
    > Girintilemeye dikkat edin.

*   Ve son olarak üçüncü nokta.

------

🎯 **Özet**

*   🔑 **Tutarlılık Anahtardır:** Hem işaretçi seçiminde (`*`, `+`, `-`) hem de özellikle girintilemede (` boşluk `) tutarlı olun. Bu, kodunuzun temiz ve öngörülebilir olmasını sağlar.
*   ➡️❗ **Girintileme Her Şeydir:** İç içe listeler ve gelişmiş biçimlendirme (paragraflar, kod blokları vb.) için doğru sayıda boşluk (genellikle 2 veya 4) kullanmak **kritiktir**. Yanlış girintileme listenizin yapısını bozabilir!
*   👀 **Okunabilirlik:** Kodunuzun sadece doğru *çalışmasını* değil, aynı zamanda sizin ve başkalarının kolayca *okuyup anlayabilmesini* de hedefleyin (örneğin, sıralı listelerde `1.`, `2.`, `3.` gibi mantıklı numaralar kullanmak).
*   💻⚠️ **Platform Desteği:** Görev listeleri (`[ ]`, `[x]`) gibi bazı havalı özelliklerin, standart Markdown'da olmadığını, **GFM (GitHub Flavored Markdown)** gibi genişletilmiş sürümlere ait olduğunu unutmayın. Bu özelliklerin çalışıp çalışmayacağı, Markdown'ı kullandığınız platforma (GitHub, GitLab, Obsidian vb.) bağlıdır.

## 8. Tablolar: Veriyi Düzenli Sunmanın Yolu

Listeler harika olsa da, bazen verileri satırlar ve sütunlar halinde, yani tablo formatında sunmak çok daha açıklayıcı ve düzenli olabilir. Özellikle karşılaştırmalar yapmak, özellikleri listelemek veya yapılandırılmış verileri göstermek için tablolar idealdir.

Markdown'ın tablo sözdizimi, HTML tablolarına göre çok daha basittir, ancak temel ihtiyaçlar için oldukça yeterlidir. Çoğu modern Markdown yorumlayıcısı (özellikle GitHub Flavored Markdown - GFM tabanlı olanlar) tabloları güzel bir şekilde işler.

Haydi, Markdown'da nasıl tablo oluşturulacağına ve biçimlendirileceğine yakından bakalım!

---

### 1. Temel Tablo Sözdizimi

Markdown'da tablo oluşturmanın temel mantığı şöyledir:

1.  **Başlık Satırı (Header Row):** Sütun başlıklarını içerir. Başlıklar dikey çizgi (`|`) karakteri ile ayrılır.
2.  **Ayırıcı Satır (Separator Row):** Başlık satırını tablo gövdesinden ayırır. Her sütun için en az üç tire (`---`) kullanılır ve bunlar da dikey çizgilerle (`|`) ayrılır. **Bu satır zorunludur!**
3.  **Veri Satırları (Data Rows):** Tablonun içeriğini oluşturan satırlardır. Hücreler yine dikey çizgi (`|`) ile ayrılır.

**Basit Bir Örnek:**

```markdown
| Ürün Adı | Fiyat | Stok Adedi |
|----------|-------|------------|
| Elma     | 5 TL  | 150        |
| Armut    | 6 TL  | 85         |
| Muz      | 12 TL | 0          |
```

Görünüm:

| Ürün Adı | Fiyat | Stok Adedi |
|----------|-------|------------|
| Elma     | 5 TL  | 150        |
| Armut    | 6 TL  | 85         |
| Muz      | 12 TL | 0          |

**Önemli Noktalar:**

* Dikey Çizgiler (|): Sütunları ayırmak için kullanılır. Satırların başında ve sonunda kullanmak zorunlu olmasa da, kodun daha okunabilir olmasını sağlar.
* Ayırıcı Satır (---): Her sütun için en az üç tire (-) içermelidir. Daha fazla tire kullanabilirsiniz, bu görünümü etkilemez ama kodun hizalanmasına yardımcı olabilir.
* Boşluklar: Dikey çizgilerin etrafındaki boşluklar genellikle göz ardı edilir, yani hücre içeriğini ve çizgileri hizalamak için boşluk kullanabilirsiniz (bu konuya ipuçlarında değineceğiz).

### 2. Sütun Hizalaması

Tabloların en kullanışlı özelliklerinden biri, sütun içeriğini hizalayabilmektir (sola, sağa, ortaya). Hizalama, ayırıcı satırda iki nokta üst üste (:) karakteri kullanılarak kontrol edilir:

* Sola Hizala (Varsayılan): :--- veya sadece ---
* Sağa Hizala: ---:
* Ortala: :---:

Hizalama Örneği:

```markdown
| Metin (Sola Yaslı) | Sayı (Sağa Yaslı) | Ortalanmış Başlık |
| :----------------- | ----------------: | :---------------: |
| Solda              |              123  |      Ortada       |
| Uzun bir metin     |             4567  |      Merkez       |
| Kısa               |                8  |        ><         |
```

Görünüm: 

| Metin (Sola Yaslı) | Sayı (Sağa Yaslı) | Ortalanmış Başlık |
| :----------------- | ----------------: | :---------------: |
| Solda              |              123  |      Ortada       |
| Uzun bir metin     |             4567  |      Merkez       |
| Kısa               |                8  |        ><         |

> 💡 **İpucu**: Sayısal verileri içeren sütunları sağa yaslamak, genellikle okunabilirliği artırır. Başlıkları veya kısa metinleri ortalamak da estetik bir tercih olabilir.

### 3. Hücre İçinde Biçimlendirme

Tablo hücrelerinin içine standart satır içi Markdown biçimlendirmelerini uygulayabilirsiniz:

* Kalın: **Metin**
* İtalik: *Metin* veya _Metin_
* Kalın ve İtalik: ***Metin***
* Kod: `Metin`
* Bağlantı: [Metin](https://gulderenlab.com/)
* Üstü Çizili: ~~Metin~~ (GFM uzantısı)

Biçimlendirme Örneği:

```markdown
| Özellik         | Açıklama                         | Durum        | Bağlantı         |
| --------------- | -------------------------------- | ------------ | --------------- |
| **Performans**  | *Yüksek* hızlı işlemci          | `Tamamlandı` | [Detaylar](https://gulderenlab.com/) |
| *Depolama*      | ~~512 GB SSD~~ **1 TB SSD**      | `Güncellendi`| _Yok_           |
| `Ağ Bağlantısı` | Gigabit Ethernet ve ***Wi-Fi 6*** | `Aktif`      | `N/A`           |
```

Görünüm: 

| Özellik         | Açıklama                         | Durum        | Bağlantı         |
| --------------- | -------------------------------- | ------------ | --------------- |
| **Performans**  | *Yüksek* hızlı işlemci          | `Tamamlandı` | [Detaylar](https://gulderenlab.com/) |
| *Depolama*      | ~~512 GB SSD~~ **1 TB SSD**      | `Güncellendi`| _Yok_           |
| `Ağ Bağlantısı` | Gigabit Ethernet ve ***Wi-Fi 6*** | `Aktif`      | `N/A`           |

> ⚠️ Dikkat: Hücre içine resim ```(![Alt](URL))``` eklemek teknik olarak mümkün olsa da, genellikle tablo düzenini bozar veya tüm platformlarda düzgün görüntülenmeyebilir. Tablolarda resim kullanmaktan kaçınmak genellikle daha iyidir. Ayrıca, blok seviyesi elemanlar (başka listeler, kod blokları vb.) genellikle tablo hücreleri içinde çalışmaz.

----

### 4. İpuçları ve En İyi Uygulamalar

* 👨‍💻 Kod Okunabilirliği İçin Hizalama: Markdown kodunu yazarken dikey çizgileri (|) alt alta gelecek şekilde hizalamak, tablonun yapısını anlamayı ve düzenlemeyi çok kolaylaştırır. Ayırıcı satırdaki tireleri de sütun genişliğine göre ayarlayabilirsiniz. Bu, Markdown çıktısını etkilemez ama kaynak kodunuz çok daha düzenli görünür.

Kötü (Ama Çalışır):

```markdown
|Ad|Soyad|Yaş|
|---|---|---|
|Ali|Veli|30|
|Ayşe|Fatma|25|
```

İyi (Daha Okunabilir):

```markdown
| Ad   | Soyad | Yaş |
| :--- | :---- | --: |
| Ali  | Veli  |  30 |
| Ayşe | Fatma |  25 |
```

* ⚙️ Tablo Oluşturucular (Table Generators): Özellikle büyük veya karmaşık tablolar oluşturuyorsanız, online Markdown tablo oluşturucuları (örneğin, Tables Generator) veya metin düzenleyicinizdeki eklentiler işinizi çok kolaylaştırabilir. Bu araçlar genellikle verileri yapıştırmanıza veya girmenize olanak tanır ve sizin için hizalanmış Markdown kodunu üretir.
* 📏 Basit Tutun: Markdown tabloları en iyi basit, iki boyutlu veriler için çalışır. Çok fazla sütun veya çok uzun hücre içeriği okunabilirliği zorlaştırabilir.

------

### 5. Sınırlamalar

Markdown tabloları basitlikleriyle öne çıksa da, HTML tablolarının sunduğu bazı gelişmiş özelliklerden yoksundur:

- ❌ Hücre Birleştirme (Merged Cells): Satırları (rowspan) veya sütunları (colspan) birleştiremezsiniz.
- ❌ İç İçe Tablolar (Nested Tables): Bir tablo hücresinin içine başka bir tablo koyamazsınız.
- ❌ Gelişmiş Stil (Advanced Styling): Hücrelere veya satırlara arka plan rengi vermek, kenarlıkları özelleştirmek gibi CSS tabanlı stillendirmeler doğrudan Markdown ile yapılamaz.

>💡 Alternatif: Eğer hücre birleştirme gibi gelişmiş özelliklere ihtiyacınız varsa, Markdown belgenizin içine doğrudan HTML \<table> kodu yazmanız gerekebilir (tabii ki Markdown yorumlayıcınız HTML'e izin veriyorsa).

## 9. Görseller (Images): İçeriğinizi Zenginleştirin 🖼️

Metin harikadır, ancak bazen bir resim bin kelimeye bedeldir! Markdown, belgelerinize kolayca görseller eklemenize olanak tanıyarak içeriğinizi daha ilgi çekici, açıklayıcı ve görsel olarak zengin hale getirmenizi sağlar. İster bir ekran görüntüsü, ister bir diyagram, isterse sadece dekoratif bir resim eklemek isteyin, Markdown'ın bunun için basit bir sözdizimi vardır.

Bu bölümde, Markdown kullanarak görselleri nasıl ekleyeceğinizi, alternatif metinlerin (alt text) neden önemli olduğunu ve bazı yaygın kullanım senaryolarını inceleyeceğiz.

---

### 1. Temel Görsel Sözdizimi

Markdown'da bir görsel eklemenin temel yapısı, bağlantı (link) sözdizimine çok benzer, ancak başında bir ünlem işareti (`!`) bulunur:

```markdown
![Alternatif Metin](Görselin URL'si veya Yolu "Opsiyonel Başlık")
```

**Bu yapıyı parçalarına ayıralım:**

- **! (Ünlem İşareti):**  
  Bu karakter, Markdown yorumlayıcısına bunun bir metin bağlantısı değil, bir görsel olduğunu söyler. Bu işaret olmazsa, sadece bir bağlantı oluşur.

- **[] (Köşeli Parantezler):**  
  İçine **Alternatif Metin (Alt Text)** yazılır.

  #### Neden Önemli?
  - **Erişilebilirlik:**  
    Ekran okuyucu kullanan kullanıcılar için görselin ne hakkında olduğunu açıklar.
  - **SEO (Arama Motoru Optimizasyonu):**  
    Arama motorlarının görselin içeriğini anlamasına yardımcı olur.
  - **Hata Durumu:**  
    Eğer görsel yüklenemezse (yanlış yol, silinmiş dosya vb.), alternatif metin tarayıcıda görselin yerinde gösterilir ve kullanıcıya orada ne olması gerektiği hakkında bir fikir verir.

  #### Nasıl Yazılmalı?  
  Görseli görmeyen birine tarif eder gibi, kısa ve açıklayıcı olmalıdır. Örneğin:  
  - "Kırmızı bir spor araba"  
  - "Markdown logo"

- **() (Normal Parantezler):**  
  İçine görselin kaynağının URL'si veya dosya yolu yazılır.

  - **Web URL'si:**  
    İnternet üzerindeki bir görselin tam adresi. 

Örnek:

`https://www.example.com/images/logo.png`
  - **Yerel Dosya Yolu:**  
    Markdown dosyanızın bulunduğu yere göre görselin konumu. Bu, göreli (*relative*) veya mutlak (*absolute*) bir yol olabilir. Genellikle göreli yollar tercih edilir.

- **"" (Çift Tırnak - Opsiyonel):**  
  Parantez içinde URL'den sonra bir boşluk bırakıp çift tırnak içine yazılan metin, opsiyonel bir başlıktır (*title*). Fare imleci görselin üzerine getirildiğinde küçük bir araç ipucu (*tooltip*) olarak görünür. Alt text kadar kritik değildir ancak ek bilgi sağlamak için kullanılabilir.

### 2. Örnekler

#### a) Web Üzerindeki Bir Görseli Ekleme:

```markdown
![Markdown Logosu](https://commonmark.org/help/images/favicon.png "CommonMark Yardım Sayfası Logosu")
```

**Görünüm:**  
![alt text](https://commonmark.org/help/images/favicon.png)

---

#### b) Yerel Bir Görseli Ekleme (Göreli Yol Kullanarak):

Diyelim ki Markdown dosyanız (`markdown-klavuzu.md`) bir klasörde ve aynı kök klasörün içinde bir `images` alt klasörü var. Bu klasörün içinde de `Marmaris-dalgalar.jpg` adında bir dosya bulunuyor.

**Klasör Yapısı:**
```
Web-page-design/
├── public/
│   └── images/
│       └── Marmaris-dalgalar.jpg
└── src/
    └── content/
        └── blog/
            └── markdown-klavuzu.md
```

**Markdown Kodu (`markdown-klavuzu.md` içinde):**

```markdown
![Denizden Gelen Huzur]((/images/Marmaris-dalgalar.jpg "Örnek bir fotoğraf")
```

![Denizden Gelen Huzur](/images/Marmaris-dalgalar.jpg "Örnek bir fotoğraf")



**Açıklamalar:**

- `./` : Geçerli klasörü ifade eder (genellikle yazılmasa da olur).
- `images/` : `images` alt klasörüne girer.
- `images/Marmaris-dalgalar.jpg` : Görsel dosyasının adıdır.

Eğer görsel, Markdown dosyasıyla aynı klasörde olsaydı:

```markdown
![Basit Logo](logo.png)
```

Eğer bir üst klasördeki `assets` klasöründe olsaydı:

```markdown
![Ana Varlık](../../assets/image.png)
```

- `../` : Bir üst klasöre çıkmayı ifade eder.

💡 **İpucu:** Özellikle projeler veya web siteleri için içerik oluştururken, görselleri belirli bir klasörde (örn. `images`, `assets`) düzenlemek ve Markdown dosyalarınızdan bu görsellere göreli yollarla başvurmak en iyi pratiktir. Bu, projenizi başka bir yere taşıdığınızda veya yayınladığınızda yolların bozulmamasını sağlar.

---

### 3. Görseli Bağlantı Haline Getirme (Tıklanabilir Görsel)

Bazen bir görsele tıklandığında kullanıcının başka bir sayfaya (örneğin, görselin daha büyük haline veya ilgili bir web sitesine) gitmesini isteyebilirsiniz. Bunu yapmak için görsel sözdizimini, bağlantı sözdiziminin içine yerleştirirsiniz:

```markdown
[![Alternatif Metin](Görsel URL'si)](Hedef URL "Opsiyonel Bağlantı Başlığı")
```

**Örnek:**

```markdown
[![GitHub Logosu](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)](https://github.com "GitHub Ana Sayfasına Git")
```

**Görünüm:**  
(Aşağıdaki logoya tıklayarak GitHub'a gidebilirsiniz)  
[![alt text](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)](https://github.com)

---

### 4. Sınırlamalar ve Dikkat Edilmesi Gerekenler

#### 📏 Boyutlandırma ve Hizalama

Standart Markdown sözdizimi, görselleri yeniden boyutlandırmak (genişlik/yükseklik ayarlamak) veya hizalamak (sola, sağa, ortaya) için bir yol sunmaz. Görseller genellikle bulundukları satırı kaplar ve sola yaslı olarak görünürler.

**Çözüm:** Eğer boyutlandırma veya hizalama gibi daha gelişmiş kontrollere ihtiyacınız varsa, Markdown belgenize doğrudan HTML `<img>` etiketini ekleyebilirsiniz (Markdown yorumlayıcınız HTML'e izin veriyorsa).

```html
<img src="/images/orman.jpg" alt="Orman Manzarası" width="150" style="display: block; margin: auto;">

<!-- Bu HTML kodu, genişliği 150 piksel yapar ve görseli ortalar -->

```

<img src="/images/orman.jpg" alt="Orman Manzarası" width="150" style="display: block; margin: auto;">

---

#### 🖼️ Desteklenen Formatlar

Görselin tarayıcıda veya Markdown görüntüleyicide gösterilebilmesi için yaygın web formatlarında (JPEG, PNG, GIF, SVG, WebP vb.) olması gerekir.

---

#### 🔗 Kırık Görseller

Görselin yüklenememesinin yaygın nedenleri şunlardır:

- Yanlış dosya yolu veya URL.
- Görselin sunucudan silinmiş veya taşınmış olması.
- Yerel görsellerde, Markdown dosyasının veya görselin yerinin değiştirilmesi nedeniyle göreli yolun artık geçerli olmaması.
- Erişim izinleri sorunları.

---

### 5. İpuçları ve En İyi Uygulamalar

✅ **Her Zaman Alt Text Kullanın:**  
Erişilebilirlik ve SEO için çok önemlidir. Asla boş bırakmayın!

🚀 **Görselleri Optimize Edin:**  
Web için görsellerin dosya boyutunu küçültün (kaliteden çok fazla ödün vermeden) ve uygun formatı seçin. Bu, sayfa yükleme hızını artırır.

📁 **Görselleri Organize Edin:**  
Projelerinizde görseller için özel bir klasör kullanın (`images`, `assets` vb.).

↔️ **Göreli Yolları Tercih Edin:**  
Özellikle yerel projeler veya web siteleri için, görsellere başvururken mutlak yollar yerine göreli yolları kullanmak daha taşınabilir ve sürdürülebilir bir yapı sağlar.

☁️ **Hosting Servisleri:**  
Eğer görselleri farklı yerlerde tekrar tekrar kullanacaksanız veya büyük dosyalarla çalışıyorsanız, bir resim hosting servisi (Cloudinary, Imgur vb.) veya CDN kullanmayı düşünebilirsiniz.

## 10. Bağlantılar (Links): Belgelerinizi Dünyaya Açın 🔗

Markdown belgelerinin en büyük güçlerinden biri, diğer belgelere, web sayfalarına, e-posta adreslerine ve hatta aynı belgenin farklı bölümlerine kolayca **bağlantı (link)** verme yeteneğidir. Bağlantılar, okuyucuyu ilgili kaynaklara yönlendirerek, daha fazla bilgi sağlayarak veya belgenin farklı kısımları arasında gezinmeyi kolaylaştırarak içeriğinizin değerini artırır.

Markdown, bağlantı oluşturmak için birkaç farklı, esnek ve okunabilir yöntem sunar:

1.  **Satır İçi Bağlantılar (Inline Links):** En yaygın kullanılan yöntemdir.
2.  **Referans Stili Bağlantılar (Reference-Style Links):** Uzun metinlerde veya aynı bağlantıyı birden çok kez kullanırken okunabilirliği artırır.
3.  **Otomatik Bağlantılar (Autolinks):** URL'leri ve e-posta adreslerini hızlıca tıklanabilir hale getirir.

Şimdi bu yöntemleri ayrıntılı olarak inceleyelim.

---

### 1. Satır İçi Bağlantılar (Inline Links)

Bu, bağlantı oluşturmanın en doğrudan yoludur. Sözdizimi şöyledir:

```markdown
[Görünen Metin](URL "Opsiyonel Bağlantı Başlığı")
```

------- 
**Yapının Bileşenleri:**

* [] (Köşeli Parantezler): İçine, kullanıcının göreceği ve tıklayacağı bağlantı metni yazılır. Bu metin açıklayıcı olmalıdır.
* () (Normal Parantezler): İçine, bağlantının yönlendireceği hedef adres (URL) yazılır. Bu, bir web sayfası (http://, https://), bir dosya yolu, bir e-posta adresi (mailto:) veya aynı sayfa içindeki bir bölüm (#fragment) olabilir.
* "" (Çift Tırnak - Opsiyonel): URL'den sonra bir boşluk bırakıp çift tırnak içine yazılan metin, opsiyonel bir başlıktır (title). Fare imleci bağlantının üzerine getirildiğinde küçük bir araç ipucu (tooltip) olarak görünür. Bağlantının ne hakkında olduğuyla ilgili ek bağlam sağlamak için kullanışlıdır.

**Örnekler:**

* Web Sayfasına Bağlantı:

```markdown
Markdown hakkında daha fazla bilgi için [CommonMark Spec](https://spec.commonmark.org/ "CommonMark Spesifikasyonları Ana Sayfası") sayfasını ziyaret edebilirsiniz.
```

Görünüm:

Markdown hakkında daha fazla bilgi için [CommonMark Spec](https://spec.commonmark.org/ "CommonMark Spesifikasyonları Ana Sayfası") sayfasını ziyaret edebilirsiniz.

* E-posta Adresine Bağlantı (mailto:):

```markdown
Sorularınız için [bize e-posta gönderin](https://gulderenlab.com/iletisim/).
```
Görünüm:

Sorularınız için [bize e-posta gönderin](https://gulderenlab.com/iletisim/).

* Yerel Dosyaya Göreli Bağlantı:

```markdown
Proje detayları için lütfen [README dosyasına bakın](..README.md "Proje Ana Açıklama Dosyası").
```
⚠️ Markdown klavuzu içinde bir README.md dosyam olmadığı için görünüm eklenmemiştir. 

* Başlıksız Bağlantı (En Yaygın Kullanım):

```markdown
En sevdiğim arama motoru [Google](https://www.google.com).
```
Görünüm:

En sevdiğim arama motoru [Google](https://www.google.com).

-------

### 2. Referans Stili Bağlantılar (Reference-Style Links)

Özellikle metin içinde çok sayıda bağlantı olduğunda veya aynı bağlantıyı birden fazla yerde kullandığınızda, satır içi bağlantılar metnin akıcılığını bozabilir. Referans stili bağlantılar, bu sorunu çözmek için URL'leri metinden ayırır ve genellikle belgenin sonuna yerleştirilen tanımlayıcılarla eşleştirir. Bu, metnin okunmasını kolaylaştırır.

**Referans stili bağlantının iki bölümü vardır:**

1. **Metin İçindeki Kısım:**

  * [Görünen Metin][referans_etiketi]

  * Eğer "Görünen Metin" ile "referans_etiketi" aynıysa, ikinci köşeli parantezi boş bırakabilirsiniz: [Görünen Metin][]
  * Hatta, eğer "Görünen Metin" benzersiz bir referans olarak kullanılacaksa, sadece [Görünen Metin] yazmak bile yeterli olabilir (implicit link names).

------

2. **Tanım Kısmı (Genellikle Belgenin Sonunda):**

  * [referans_etiketi]: URL "Opsiyonel Bağlantı Başlığı"

**Önemli Notlar:**

  * referans_etiketi büyük/küçük harfe duyarlı değildir (genellikle). [etiket] ile [Etiket] aynı tanıma işaret eder.
  * Etiketler harf, sayı, boşluk ve noktalama içerebilir, ancak basit ve anlaşılır olması önerilir.
  * Tanım kısmı ([etiket]: URL...) belgenin herhangi bir yerine (genellikle en sona) yerleştirilebilir ve çıktıda görünmez.

------

Örnek:

```markdown
Bu paragrafta [Google][1] ve [Yahoo][yahoo arama] arama motorlarından bahsedeceğiz.
Ayrıca [Wikipedia][wiki] sitesine de sıkça başvururuz.
Daha fazla bilgi için tekrar [Google][1]'a bakabilirsiniz.
Bu da [kendi kendine referans] örneğidir.

[1]: https://www.google.com "Google Arama"
[yahoo arama]: https://www.yahoo.com "Yahoo Arama Motoru"
[wiki]: https://www.wikipedia.org/ "Özgür Ansiklopedi"
[kendi kendine referans]: https://www.gulderenlab.com
```

Görünüm: 

Bu paragrafta [Google][1] ve [Yahoo][yahoo arama] arama motorlarından bahsedeceğiz.
Ayrıca [Wikipedia][wiki] sitesine de sıkça başvururuz.
Daha fazla bilgi için tekrar [Google][1]'a bakabilirsiniz.
Bu da [kendi kendine referans] örneğidir.

[1]: https://www.google.com "Google Arama"
[yahoo arama]: https://www.yahoo.com "Yahoo Arama Motoru"
[wiki]: https://www.wikipedia.org/ "Özgür Ansiklopedi"
[kendi kendine referans]: https://www.gulderenlab.com

-----

**Avantajları:**

* ✅ Daha Temiz Metin: URL'ler metnin akışını bozmaz.
* 🔄 Kolay Yönetim: Bir bağlantıyı güncellemek istediğinizde, sadece tanım kısmını değiştirmeniz yeterlidir; metin içindeki tüm referanslar otomatik olarak güncellenir.
* 📚 Tekrar Kullanım: Aynı referansı metin içinde defalarca kullanabilirsiniz.

### 3. Otomatik Bağlantılar (Autolinks)

Markdown, köşeli parantez (< >) içine alınan geçerli URL'leri ve e-posta adreslerini otomatik olarak tıklanabilir bağlantılara dönüştürür. Metin kısmı URL'nin veya e-postanın kendisi olur.

Örnek:

```markdown
Web sitesi: <https://www.gulderenlab.com>

İletişim: <mailto:iletisim@gulderenlab.com>
```
Görünüm: 

Web sitesi: <https://www.gulderenlab.com>

İletişim: <mailto:iletisim@gulderenlab.com>

ℹ️ **Not**: Bazı Markdown yorumlayıcıları, köşeli parantez olmasa bile metin içindeki http:// veya https:// ile başlayan URL'leri otomatik olarak bağlantıya çevirebilir, ancak bu standart bir davranış değildir. Köşeli parantez kullanmak en güvenilir yöntemdir.

### 4. Bağlantı İçinde Diğer Biçimlendirmeler

Bağlantı metnini diğer satır içi Markdown biçimlendirmeleriyle (kalın, italik, kod vb.) birleştirebilirsiniz.

Örnek:

```markdown
*   [**Önemli Bağlantı**](https://www.gulderenlab.com)
*   [*Bu siteye göz atın*](https://www.gulderenlab.com)
*   [Kod örneği için ``buraya`` tıklayın](https://gulderenlab.com/projeler/)
*   [***Hem kalın hem italik link***](https://www.gulderenlab.com)
```

Görünüm:

*   [**Önemli Bağlantı**](https://www.gulderenlab.com)
*   [*Bu siteye göz atın*](https://www.gulderenlab.com)
*   [Kod örneği için ``buraya`` tıklayın](https://gulderenlab.com/projeler/)
*   [***Hem kalın hem italik link***](https://www.gulderenlab.com)

### 5. Aynı Belge İçindeki Başlıklara Bağlantı (Anchor Links / Fragment Identifiers)

Uzun belgelerde, okuyucuyu belgenin başka bir bölümüne (genellikle bir başlığa) yönlendirmek çok kullanışlıdır. Çoğu Markdown yorumlayıcısı, belgedeki her başlık için otomatik olarak bir HTML ID'si (kimliği) oluşturur. Bu ID'ler genellikle şu kurallara göre oluşturulur:

* Başlık metni küçük harfe çevrilir.
* Baştaki ve sondaki boşluklar kaldırılır.
* Boşluklar tire (-) ile değiştirilir.
* Çoğu özel karakter (noktalama işaretleri vb.) kaldırılır.
* Bağlantı sözdizimi, # karakteri ve ardından başlığın otomatik oluşturulan ID'si şeklindedir:

Örnek:

Diyelim ki belgenizde ### 2. Referans Stili Bağlantılar (Reference-Style Links) diye bir başlık var. Bu başlığın ID'si muhtemelen 2-referans-stili-baglantilar-reference-style-links olacaktır. Buna şöyle bir bağlantı verebilirsiniz:

```markdown 
<!-- Örnek Kullanımlar -->

Bu konuda daha fazla bilgi için [Referans Stili Bağlantılar](#2-referans-stili-bağlantılar-reference-style-links) bölümüne bakın.

Veya:

Markdown'da link vermenin [ikinci yolu](#2-referans-stili-bağlantılar-reference-style-links) için burayı inceleyebilirsiniz.
```

Görünüm:

<!-- Örnek Kullanımlar -->

Bu konuda daha fazla bilgi için [Referans Stili Bağlantılar](#2-referans-stili-bağlantılar-reference-style-links) bölümüne bakın.

Veya:

Markdown'da link vermenin [ikinci yolu](#2-referans-stili-bağlantılar-reference-style-links) için burayı inceleyebilirsiniz.

⚠️ **Dikkat**: Otomatik ID oluşturma mekanizması Markdown yorumlayıcıları arasında küçük farklılıklar gösterebilir (örneğin, bazıları tekrarlayan ID'lere -1, -2 gibi ekler ekleyebilir). Emin değilseniz, platformunuzun belgelerine bakabilir, oluşturulan HTML'i inceleyebilir veya daha güvenilir bir yöntem olarak başlığınıza HTML kullanarak manuel bir ID atayabilirsiniz: `<h2 id="benim-ozel-idm">Başlığım</h2>` ve sonra #benim-ozel-idm şeklinde bağlantı verebilirsiniz.

### 6. İpuçları ve En İyi Uygulamalar

*  🎯 **Açıklayıcı Bağlantı Metni**: Kullanıcının tıkladığında nereye gideceğini anlamasına yardımcı olacak net ve açıklayıcı metinler kullanın. "Buraya tıklayın" gibi genel ifadelerden kaçının.
** relative vs absolute:** Kendi web siteniz veya projeniz içindeki sayfalara bağlanıyorsanız, göreli yolları (../klasor/sayfa.md) kullanmak genellikle daha iyidir. Dış sitelere bağlanırken mutlak URL'leri (https://www.example.com) kullanın.
* ✔️ **Bağlantıları Kontrol Edin**: Özellikle dış bağlantıların zamanla bozulabileceğini unutmayın. Bağlantılarınızın hala geçerli olup olmadığını periyodik olarak kontrol etmek iyi bir fikirdir.
* ✨ **Okunabilirlik İçin Referans Stili**: Uzun paragraflarda veya aynı bağlantıyı tekrar tekrar kullanmanız gerektiğinde referans stilini tercih ederek metninizi daha temiz tutun.
* 🖱️ **Opsiyonel Başlık (Title)**: Başlık özniteliğini, bağlantı metninin tam olarak açıklamadığı ek bağlam veya ipuçları sağlamak için kullanın, ancak aşırıya kaçmayın.