"""
XY Eksen Birleştirici - 3D Yazıcı Parçası
CadQuery ile tasarlanmış profesyonel 3D model

Bu kod, X ve Y eksenlerini birleştiren bir 3D yazıcı parçası oluşturur.
X taşıyıcı profili 4040 alüminyum profil üzerine monte edilir.
Flanşlı rulmanlar (F 628 ZZ 8x24x8) kayış sisteminde kullanılır.
"""

import cadquery as cq
from cadquery import exporters

# =============================================================================
# TASARIM PARAMETRELERİ VE HESAPLAMALAR
# =============================================================================

# Temel boyutlar
X_PROFIL_BOYUT = 40  # 4040 alüminyum profil boyutu (mm)
TOLERANS = 0.2  # Genel tolerans (mm)

# Araba ve rulman boyutları
ARABA_GENISLIK = 44  # X ekseni arabası genişliği
RULMAN_TUTUCU_X = 32  # Rulman tutucu uzantısı
B = 32  # Z ekseninde delikler arası mesafe (araba merkezine göre)
C = 36  # X ekseninde delikler arası mesafe (araba merkezine göre)

# Kayış sistemi parametreleri
MOTOR_KASNAK_CAPI = 12  # Motor kasnağı çapı
RULMAN_KASNAK_CAPI = 24  # Rulman kasnağı çapı (flanşlı rulman üzerinden geçecek)
KAYIS_YAN_DUVAR_MESAFESI = 10  # Kayışların yan duvara uzaklığı

# Ana blok boyutları
"""
Toplam Y ekseni uzunluğu hesaplaması:
- X profil: 40 mm
- Kayış mesafesi: 2 × 10 = 20 mm
- Rulman efektif çapı: 2 × 25.5 = 51 mm (27/2 + 24/2 = 25.5)
- Toplam: 40 + 20 + 51 = 111 mm
"""
TOPLAM_GENISLIK = ARABA_GENISLIK + RULMAN_TUTUCU_X
BIRLESTIRICI_UZUNLUK = 120
BIRLESTIRICI_YUKSEKLIK = 10
TABAN_KALINLIK = 10
YAN_KALINLIK = 5

# Rulman montajı için silindir boyutları
SILINDIR_YUKSEKLIK = 18.5
SILINDIR_YARICAPI = 10
CIKINTI_YUKSEKLIK = 1.3  # Orijinal 1.5, tolerans için azaltıldı
CIKINTI_YARICAP = 6

# =============================================================================
# VİDA VE BAGLAINTI ELEMANI PARAMETRELERI
# =============================================================================

# M5 insert somun parametreleri
M5_INSERT_CAP = 6.4  # Delik çapı
M5_INSERT_DERINLIK = 5.3  # Delik derinliği
M5_INSERT_CHAMFER = 0.8  # Üst kenarda pah
M5_CLEARANCE = 5.2  # M5 vida geçme deliği

# M5 imbus vida parametreleri
M5_VIDA_CAP = 5.2  # Gövde deliği çapı
M5_IMBUS_BAS_CAP = 8.55  # İmbus başı çapı
M5_IMBUS_BAS_DERINLIK = 5  # İmbus başı derinliği

# M8 imbus vida parametreleri
M8_VIDA_CAP = 8.1  # Gövde deliği çapı
M8_IMBUS_BAS_CAP = 13.1  # İmbus başı çapı
M8_IMBUS_BAS_DERINLIK = 8  # İmbus başı derinliği
M8_VIDA_UZUNLUK = X_PROFIL_BOYUT + 2 * TABAN_KALINLIK

# M8 somun (köşeden-köşeye) — FDM toleranslı örnek
M8_AF_NOMINAL = 13.0          # mm (across flats, nominal)
PRINT_TOLERANCE = 0.2         # mm (FDM için önerilen boşluk)

# Köşeden-köşeye (point-to-point) hesaplanmış, toleranslı değer:
M8_SOMUN_CAP = 15.24         # mm  (≈ (2/√3)*13.0 + 0.2, yuvarlanmış)
M8_SOMUN_YUKSEKLIK = 6.6     # mm  (6.5 + 0.2)

# =============================================================================
# YARDIMCI FONKSİYONLAR
# =============================================================================

def create_mounting_holes(workplane, points, hole_diameter):
    """Belirtilen noktalara montaj delikleri açar"""
    return (workplane
            .pushPoints(points)
            .circle(hole_diameter / 2)
            .cutThruAll())

def create_bearing_cylinder(workplane, position):
    """Rulman montajı için silindir oluşturur"""
    return (workplane
            .pushPoints([position])
            .circle(SILINDIR_YARICAPI)
            .extrude(SILINDIR_YUKSEKLIK))

def create_bearing_protrusion(workplane, position, direction=1):
    """Rulman silindiri üzerinde çıkıntı oluşturur"""
    return (workplane
            .pushPoints([position])
            .circle(CIKINTI_YARICAP)
            .extrude(direction * CIKINTI_YUKSEKLIK))

# =============================================================================
# ANA BLOK OLUŞTURMA
# =============================================================================

def create_main_block():
    """Ana blok geometrisini oluşturur"""
    return (cq.Workplane("XZ")
            .box(BIRLESTIRICI_UZUNLUK,
                 TOPLAM_GENISLIK,
                 2 * TABAN_KALINLIK + X_PROFIL_BOYUT))

def add_profile_mounting_holes(block):
    """Profil montaj deliklerini ekler"""
    mounting_points = [
        (0, -TOPLAM_GENISLIK/2 + RULMAN_TUTUCU_X/2 + 8),
        (0, -TOPLAM_GENISLIK/2 + RULMAN_TUTUCU_X/2 - 8)
    ]
    
    # Ön yüz delikleri
    block = (block
             .faces(">Y")
             .pushPoints(mounting_points)
             .circle(M5_VIDA_CAP/2)
             .cutThruAll())
    
    # Arka yüz delikleri
    block = (block
             .faces("<Y")
             .workplane(centerOption="CenterOfBoundBox")
             .pushPoints(mounting_points)
             .circle(M5_VIDA_CAP/2)
             .cutThruAll())
    
    return block

def add_carriage_mounting_holes(block):
    """Araba montaj deliklerini ekler"""
    carriage_points = [
        (C/2, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 + B/2),
        (C/2, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - B/2),
        (-C/2, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 + B/2),
        (-C/2, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - B/2)
    ]
    
    return (block
            .faces(">Y")
            .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT)
            .pushPoints(carriage_points)
            .circle(M5_VIDA_CAP/2)
            .cutThruAll())

# =============================================================================
# BOŞLUK VE YUVA OLUŞTURMA
# =============================================================================

def create_profile_slot():
    """X profili için yuva oluşturur"""
    return (cq.Workplane("XY")
            .box(X_PROFIL_BOYUT + TOLERANS,
                 X_PROFIL_BOYUT + TOLERANS,
                 TOPLAM_GENISLIK)
            .fillet(2)
            .translate((0, 0, -44)))

def create_belt_slots():
    """Kayış geçiş yuvalarını oluşturur"""
    # +X yönündeki kayış yuvası
    slot_width = (BIRLESTIRICI_UZUNLUK - 2*YAN_KALINLIK - X_PROFIL_BOYUT) / 2
    
    slot_1 = (cq.Workplane("XY")
              .box(slot_width, X_PROFIL_BOYUT, TOPLAM_GENISLIK)
              .translate((BIRLESTIRICI_UZUNLUK/2 - slot_width/2, 0, 0)))
    
    # -X yönündeki kayış yuvası
    slot_2 = (cq.Workplane("XY")
              .box(slot_width, X_PROFIL_BOYUT, TOPLAM_GENISLIK)
              .translate((-BIRLESTIRICI_UZUNLUK/2 + slot_width/2, 0, 0)))
    
    # X doğrultusundaki kayış yuvası
    slot_3 = (cq.Workplane("XY")
              .box(BIRLESTIRICI_UZUNLUK,
                   X_PROFIL_BOYUT,
                   ARABA_GENISLIK - YAN_KALINLIK)
              .translate((0, 0, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - YAN_KALINLIK)))
    
    return slot_1.union(slot_2).union(slot_3)

def create_transition_curves():
    """Geçiş eğrilerini oluşturur (estetik ve dayanıklılık için)"""
    curve_1 = (cq.Workplane("XZ")
               .moveTo(-BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2 - RULMAN_TUTUCU_X)
               .spline([(-BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2 + RULMAN_TUTUCU_X - 9),
                        (-X_PROFIL_BOYUT/2 - 2*YAN_KALINLIK, -TOPLAM_GENISLIK/2 + 3*RULMAN_TUTUCU_X/4 - 9),
                        (-X_PROFIL_BOYUT/2 - YAN_KALINLIK, -TOPLAM_GENISLIK/2)])
               .lineTo(-BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2)
               .close()
               .extrude(TABAN_KALINLIK + X_PROFIL_BOYUT/2, both=True))
    
    curve_2 = (cq.Workplane("XZ")
               .moveTo(BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2 - RULMAN_TUTUCU_X)
               .spline([(BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2 + RULMAN_TUTUCU_X - 9),
                        (X_PROFIL_BOYUT/2 + 2*YAN_KALINLIK, -TOPLAM_GENISLIK/2 + 3*RULMAN_TUTUCU_X/4 - 9),
                        (X_PROFIL_BOYUT/2 + YAN_KALINLIK, -TOPLAM_GENISLIK/2)])
               .lineTo(BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2)
               .close()
               .extrude(TABAN_KALINLIK + X_PROFIL_BOYUT/2, both=True))
    
    return curve_1.union(curve_2)

# =============================================================================
# RULMAN MONTAJLARı
# =============================================================================

def add_bearing_mounts(block):
    """Rulman montaj silindirleri ve deliklerini ekler"""
    # Rulman pozisyonları
    bearing_pos_1 = (X_PROFIL_BOYUT/2 + YAN_KALINLIK + RULMAN_KASNAK_CAPI/2 + KAYIS_YAN_DUVAR_MESAFESI,
                      TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - MOTOR_KASNAK_CAPI/2)
    
    bearing_pos_2 = (X_PROFIL_BOYUT/2 + YAN_KALINLIK + RULMAN_KASNAK_CAPI/2 + KAYIS_YAN_DUVAR_MESAFESI,
                      TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - MOTOR_KASNAK_CAPI/2 - RULMAN_KASNAK_CAPI/2)
    
    # Ön yüz rulman montajları
    block = (block
             .faces(">Y")
             .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT)
             .pushPoints([bearing_pos_1])
             .circle(SILINDIR_YARICAPI)
             .extrude(SILINDIR_YUKSEKLIK)
             
             # Üst çıkıntı
             .faces(">Y")
             .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT + SILINDIR_YUKSEKLIK)
             .pushPoints([bearing_pos_1])
             .circle(CIKINTI_YARICAP)
             .extrude(CIKINTI_YUKSEKLIK)
             
             # Alt çıkıntı
             .faces(">Y")
             .workplane(offset=-TABAN_KALINLIK)
             .pushPoints([bearing_pos_1])
             .circle(CIKINTI_YARICAP)
             .extrude(-CIKINTI_YUKSEKLIK))
    
    # Arka yüz rulman montajları
    block = (block
             .faces("<Y")
             .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT)
             .pushPoints([bearing_pos_2])
             .circle(SILINDIR_YARICAPI)
             .extrude(SILINDIR_YUKSEKLIK)
             
             # Üst çıkıntı
             .faces("<Y")
             .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT + SILINDIR_YUKSEKLIK)
             .pushPoints([bearing_pos_2])
             .circle(CIKINTI_YARICAP)
             .extrude(CIKINTI_YUKSEKLIK)
             
             # Alt çıkıntı
             .faces("<Y")
             .workplane(offset=-TABAN_KALINLIK)
             .pushPoints([bearing_pos_2])
             .circle(CIKINTI_YARICAP)
             .extrude(-CIKINTI_YUKSEKLIK))
    
    return block

def add_reinforcement_wall(block):
    """Güçlendirme duvarı ekler"""
    return (block
            .faces(">Y")
            .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT)
            .pushPoints([(0, TOPLAM_GENISLIK/2 - YAN_KALINLIK/2)])
            .rect(BIRLESTIRICI_UZUNLUK, YAN_KALINLIK)
            .extrude(X_PROFIL_BOYUT))

def add_final_holes(block):
    """Son montaj deliklerini ekler"""
    # Araba insert delikleri
    carriage_points = [
        (C/2, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 + B/2),
        (C/2, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - B/2),
        (-C/2, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 + B/2),
        (-C/2, TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - B/2)
    ]
    
    block = (block
             .faces(">Y")
             .workplane(centerOption="CenterOfBoundBox")
             .pushPoints(carriage_points)
             .circle(M5_VIDA_CAP/2)
             .cutBlind(-TABAN_KALINLIK - X_PROFIL_BOYUT))
    
    # M8 profil bağlantı delikleri
    m8_holes = [
        (-X_PROFIL_BOYUT/2 - YAN_KALINLIK - RULMAN_KASNAK_CAPI/2 - KAYIS_YAN_DUVAR_MESAFESI,
         TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - MOTOR_KASNAK_CAPI/2 - RULMAN_KASNAK_CAPI/2),
        (-X_PROFIL_BOYUT/2 - YAN_KALINLIK - RULMAN_KASNAK_CAPI/2 - KAYIS_YAN_DUVAR_MESAFESI,
         TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - MOTOR_KASNAK_CAPI/2)
    ]
    
    # Ön yüz M8 delikleri
    block = (block
             .faces(">Y")
             .workplane(centerOption="CenterOfBoundBox")
             .pushPoints([m8_holes[0]])
             .circle(M8_VIDA_CAP/2)
             .cutThruAll())
    
    # Arka yüz M8 delikleri
    block = (block
             .faces("<Y")
             .workplane(centerOption="CenterOfBoundBox")
             .pushPoints([m8_holes[1]])
             .circle(M8_VIDA_CAP/2)
             .cutThruAll())
    
    return block

def create_somun_yuvasi():
    
    # Somun pozisyonları
    x1 = X_PROFIL_BOYUT/2 + YAN_KALINLIK + RULMAN_KASNAK_CAPI/2 + KAYIS_YAN_DUVAR_MESAFESI
    y1 = (2 * TABAN_KALINLIK + X_PROFIL_BOYUT) / 2 - M8_SOMUN_YUKSEKLIK/2
    z1 = TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - MOTOR_KASNAK_CAPI/2
    
    x2 = -X_PROFIL_BOYUT/2 - YAN_KALINLIK - RULMAN_KASNAK_CAPI/2 - KAYIS_YAN_DUVAR_MESAFESI
    y2 = -(2 * TABAN_KALINLIK + X_PROFIL_BOYUT) / 2 + M8_SOMUN_YUKSEKLIK/2
    z2 = TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - MOTOR_KASNAK_CAPI/2
    
    
    m8_sy_1 = (
        cq.Workplane("XZ")
        .polygon(6, M8_SOMUN_CAP)
        .extrude(M8_SOMUN_YUKSEKLIK/2, both = True)
        .translate((
            x1,
            y1,
            z1
            ))
        )
    
    m8_sy_2 = (
        cq.Workplane("XZ")
        .polygon(6, M8_SOMUN_CAP)
        .extrude(M8_SOMUN_YUKSEKLIK/2, both = True)
        .translate((
            x2,
            y2,
            z2
            ))
        )
    
    m8_sy = m8_sy_1.union(m8_sy_2)
    
    return m8_sy


# =============================================================================
# ANA MONTAJ FONKSİYONU
# =============================================================================

def create_xy_joiner():
    """Komplet XY birleştirici parçasını oluşturur"""
    print("XY Birleştirici oluşturuluyor...")
    
    # 1. Ana blok oluştur
    print("1. Ana blok oluşturuluyor...")
    main_block = create_main_block()
    
    # 2. Profil montaj deliklerini ekle
    print("2. Profil montaj delikleri ekleniyor...")
    main_block = add_profile_mounting_holes(main_block)
    
    # 3. Araba montaj deliklerini ekle
    print("3. Araba montaj delikleri ekleniyor...")
    main_block = add_carriage_mounting_holes(main_block)
    
    # 4. Boşlukları oluştur ve çıkar
    print("4. Profil yuvası ve kayış geçişleri oluşturuluyor...")
    profile_slot = create_profile_slot()
    belt_slots = create_belt_slots()
    all_voids = profile_slot.union(belt_slots)
    main_block = main_block.cut(all_voids)
    
    # 5. Rulman montajlarını ekle
    print("5. Rulman montajları ekleniyor...")
    main_block = add_bearing_mounts(main_block)
    
    # 6. Güçlendirme duvarı ekle
    print("6. Güçlendirme duvarı ekleniyor...")
    main_block = add_reinforcement_wall(main_block)
    
    # 7. Son delikleri ekle
    print("7. Son montaj delikleri ekleniyor...")
    main_block = add_final_holes(main_block)
    
    # 8. Geçiş eğrilerini çıkar
    print("8. Geçiş eğrileri oluşturuluyor...")
    transition_curves = create_transition_curves()
    main_block = main_block.cut(transition_curves)
    
    #Somun yuvalarını ekleyelim
    print("9. Somun yuvaları ekleniyor...")
    create_somun_yuvasi = create_somun_yuvasi()
    main_block = main_block.cut(create_somun_yuvasi)
    
    print("XY Birleştirici başarıyla oluşturuldu!")
    return main_block

# =============================================================================
# MODEL OLUŞTURMA VE DIŞA AKTARMA
# =============================================================================

# XY Birleştirici parçasını oluştur
print("XY Birleştirici oluşturuluyor...")
xy_joiner = create_xy_joiner()

# CQ-editor için görüntüleme
show_object(xy_joiner, name="XY_Birlestirici", options={"alpha": 0.8, "color": (100, 150, 200)})

# 3MF formatında dışa aktar
output_path = "C:\gulderenlab\public\models\XY_Birlestirici/xy_birlestirici_v2.3mf"
try:
    cq.exporters.export(xy_joiner, output_path)
    print(f"Model başarıyla dışa aktarıldı: {output_path}")
except Exception as e:
    print(f"Dışa aktarma hatası: {e}")

# STL formatında da dışa aktar (3D yazıcı için)
stl_path = output_path.replace('.3mf', '.stl')
try:
    cq.exporters.export(xy_joiner, stl_path)
    print(f"STL dosyası oluşturuldu: {stl_path}")
except Exception as e:
    print(f"STL dışa aktarma hatası: {e}")

# =============================================================================
# TASARIM NOTLARI VE AÇIKLAMALAR
# =============================================================================
"""
TASARIM ÖZELLİKLERİ:
- 4040 alüminyum profile uyumlu montaj
- Flanşlı rulman (F 628 ZZ 8x24x8) desteği
- Kayış sistemi için optimize edilmiş yuvalar
- M5 insert somun delikleri
- M8 profil bağlantı delikleri
- Estetik ve dayanıklılık için yumuşak geçişler

MALZEME ÖNERİLERİ:
- PLA+, PETG veya ABS filament
- %100 infill veya minimum %80
- 0.2mm katman yüksekliği
- Destek yapısı gerekebilir

MONTAJ SIRASI:
1. Profil üzerine ana parçayı yerleştir
2. M8 vidalarla profili bağla
3. Flanşlı rulmanları montajla
4. X ekseni arabasını M5 vidalarla bağla
5. Kayış sistemini kur

VERSION: v2.0
CREATED: 2025
AUTHOR: GulderenLab
"""