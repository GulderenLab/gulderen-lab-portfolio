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
# GLB olarak dışa aktar (GLB için önce .step, sonra .glb kullanacağız)
exporters.export(model, 'box.step')
show_object(model)