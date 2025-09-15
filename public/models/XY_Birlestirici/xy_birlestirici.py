"""
CoreXY 3D Yazıcı Nema 17 Motor Tutucu
===========================================

Sistem Özellikleri:
- Motor taşıyıcı profil: 4545 sigma profil
- Bağlantı elemanları: M4 ve M8 imbus başlı vidalar
"""

import cadquery as cq
from cadquery import exporters

# =============================================================================
# TEMEL BOYUT HESAPLAMALARI
# =============================================================================

# X ekseni profil boyutları
X_PROFIL_BOYUT = 40  # 4040 sigma profil
TOLERANS = 0.2       # Montaj toleransı

# Araba özellikleri
ARABA_GENISLIK = 44  # GH20 araba genişliği

# Rulman ve kayış hesaplamaları
RULMAN_FLANS_CAP = 27     # F 628 ZZ flanş çapı
KASNAK_CAP = 24           # Kayış kasnağı çapı
RULMAN_KASNAK_CAP = 24    # Rulman kasnağı çapı (KASNAK_CAP ile aynı)
KAYIS_MESAFE = 10         # X ekseni kayışlarının mesafesi
MOTOR_KASNAK_CAP = 12     # Motor kasnağı çapı

# Efektif rulman çapı hesaplaması
# (Rulman flanş çapı/2 + kasnak çapı/2)
EFEKTIF_RULMAN_CAP = (RULMAN_FLANS_CAP + KASNAK_CAP) / 2

# Y ekseni toplam uzunluğu hesaplaması
# X profil + kayış mesafesi + 2×efektif rulman çapı
RULMAN_TUTUCU_X = 32
Y_EKSENI_UZUNLUK = X_PROFIL_BOYUT + (2 * KAYIS_MESAFE) + (2 * EFEKTIF_RULMAN_CAP / 2 * 2)
TOPLAM_GENISLIK = ARABA_GENISLIK + RULMAN_TUTUCU_X

# Ana blok boyutları
BIRLESTIRICI_UZUNLUK = 120
BIRLESTIRICI_YUKSEKLIK = 10
TABAN_KALINLIK = 10
YAN_KALINLIK = 5

# =============================================================================
# ARABA MONTAJ DELIKLERI (GH20 Araba Özellikleri)
# =============================================================================

# Araba vida delik konumları (araba merkezine göre)
ARABA_DELIK_B = 32  # Z ekseninde delikler arası mesafe
ARABA_DELIK_C = 36  # X ekseninde delikler arası mesafe

# =============================================================================
# VIDA VE SOMUN ÖLÇÜLERİ
# =============================================================================

# M5 imbus başlı vida ölçüleri
M5_VIDA_CAP = 5.2
M5_IMBUS_BAS_CAP = 8.55
M5_IMBUS_BAS_DERINLIK = 5
M5_VIDA_UZUNLUK = BIRLESTIRICI_YUKSEKLIK

# M5 insert somun ölçüleri
M5_INSERT_CAP = 6.4
M5_INSERT_DERINLIK = 5.3
M5_INSERT_CHAMFER = 0.8
M5_CLEARANCE = 5.2

# M8 imbus başlı vida ölçüleri
M8_VIDA_CAP = 8.1
M8_IMBUS_BAS_CAP = 13.1
M8_IMBUS_BAS_DERINLIK = 8
M8_VIDA_UZUNLUK = X_PROFIL_BOYUT + 2 * TABAN_KALINLIK

# =============================================================================
# RULMAN TUTUCU SİLİNDİR ÖLÇÜLERİ
# =============================================================================

SILINDIR_YUKSEKLIK = 18.5
SILINDIR_YARICAP = 12
CIKINTI_YUKSEKLIK = 1.3  # Tolerans için 1.5'ten azaltıldı
CIKINTI_YARICAP = 6

# =============================================================================
# ANA BLOK OLUŞTURMA
# =============================================================================

def create_main_block():
    """
    Ana bloğu oluşturur ve gerekli montaj deliklerini açar.
    
    Returns:
        cq.Workplane: Ana blok geometrisi
    """
    
    # Ana blok oluşturma
    ana_blok = (
        cq.Workplane("XZ")
        .box(
            BIRLESTIRICI_UZUNLUK,
            TOPLAM_GENISLIK,
            2 * TABAN_KALINLIK + X_PROFIL_BOYUT
        )
    )
    
    # Ön yüz montaj delikleri (araba bağlantısı için)
    araba_merkez_offset = TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2
    
    ana_blok = (
        ana_blok
        .faces(">Y")
        .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT)
        .pushPoints([
            (ARABA_DELIK_C/2, araba_merkez_offset + ARABA_DELIK_B/2),
            (ARABA_DELIK_C/2, araba_merkez_offset - ARABA_DELIK_B/2),
            (-ARABA_DELIK_C/2, araba_merkez_offset + ARABA_DELIK_B/2),
            (-ARABA_DELIK_C/2, araba_merkez_offset - ARABA_DELIK_B/2),
        ])
        .cboreHole(
            diameter=M5_VIDA_CAP,
            cboreDiameter=M5_IMBUS_BAS_CAP,
            cboreDepth=M5_IMBUS_BAS_DERINLIK,
            depth=M5_VIDA_UZUNLUK
        )
    )
    
    # Yan montaj delikleri (profil bağlantısı için)
    montaj_delikleri_y = TOPLAM_GENISLIK/2 - RULMAN_TUTUCU_X/2
    
    ana_blok = (
        ana_blok
        .faces(">Y")
        .pushPoints([
            (0, montaj_delikleri_y + 8),
            (0, montaj_delikleri_y - 8)
        ])
        .cboreHole(
            diameter=M5_VIDA_CAP,
            cboreDiameter=M5_IMBUS_BAS_CAP,
            cboreDepth=M5_IMBUS_BAS_DERINLIK,
            depth=M5_VIDA_UZUNLUK
        )
        .faces("<Y")
        .workplane(centerOption="CenterOfBoundBox")
        .pushPoints([
            (0, montaj_delikleri_y + 8),
            (0, montaj_delikleri_y - 8)
        ])
        .cboreHole(
            diameter=M5_VIDA_CAP,
            cboreDiameter=M5_IMBUS_BAS_CAP,
            cboreDepth=M5_IMBUS_BAS_DERINLIK,
            depth=M5_VIDA_UZUNLUK
        )
    )
    
    return ana_blok

# =============================================================================
# BOŞLUK GEOMETRİLERİ
# =============================================================================

def create_profile_slot():
    """
    X profili için yuva oluşturur.
    
    Returns:
        cq.Workplane: Profil yuva geometrisi
    """
    return (
        cq.Workplane("XY")
        .box(
            X_PROFIL_BOYUT + TOLERANS,
            X_PROFIL_BOYUT + TOLERANS,
            TOPLAM_GENISLIK
        )
        .fillet(2)  # Köşe yuvarlatma
        .translate((0, 0, -44))
    )

def create_belt_slots():
    """
    Kayış yuvalarını oluşturur.
    
    Returns:
        cq.Workplane: Birleştirilmiş kayış yuvaları
    """
    
    # +X yönündeki kayış yuvası
    kayis_genislik = (BIRLESTIRICI_UZUNLUK - 2*YAN_KALINLIK - X_PROFIL_BOYUT) / 2
    
    kayis_yuvasi_1 = (
        cq.Workplane("XY")
        .box(kayis_genislik, X_PROFIL_BOYUT, TOPLAM_GENISLIK)
        .translate((
            BIRLESTIRICI_UZUNLUK/2 - kayis_genislik/2,
            0,
            0
        ))
    )
    
    # -X yönündeki kayış yuvası
    kayis_yuvasi_2 = (
        cq.Workplane("XY")
        .box(kayis_genislik, X_PROFIL_BOYUT, TOPLAM_GENISLIK)
        .translate((
            -BIRLESTIRICI_UZUNLUK/2 + kayis_genislik/2,
            0,
            0
        ))
    )
    
    # X doğrultusundaki kayış yuvası
    kayis_yuvasi_3 = (
        cq.Workplane("XY")
        .box(
            BIRLESTIRICI_UZUNLUK,
            X_PROFIL_BOYUT,
            ARABA_GENISLIK - YAN_KALINLIK
        )
        .translate((
            0,
            0,
            TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - YAN_KALINLIK
        ))
    )
    
    return kayis_yuvasi_1.union(kayis_yuvasi_2.union(kayis_yuvasi_3))

# =============================================================================
# RULMAN TUTUCU SİLİNDİRLER
# =============================================================================

def add_bearing_cylinders(workpiece):
    """
    Rulman tutucu silindirlerini ekler.
    
    Args:
        workpiece: İşlenecek parça
        
    Returns:
        cq.Workplane: Silindirlerin eklendiği parça
    """
    
    # Rulman konumu hesaplama
    rulman_x = X_PROFIL_BOYUT/2 + YAN_KALINLIK + 18
    rulman_y = (TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - 
                MOTOR_KASNAK_CAP/2 - RULMAN_KASNAK_CAP/2)
    
    # Her iki yüz için rulman silindirlerini ekle
    for face_direction in [">Y", "<Y"]:
        workpiece = (
            workpiece
            .faces(face_direction)
            .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT)
            .pushPoints([(rulman_x, rulman_y)])
            .circle(SILINDIR_YARICAP)
            .extrude(SILINDIR_YUKSEKLIK)
            
            # Üst çıkıntı
            .faces(face_direction)
            .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT + SILINDIR_YUKSEKLIK)
            .pushPoints([(rulman_x, rulman_y)])
            .circle(CIKINTI_YARICAP)
            .extrude(CIKINTI_YUKSEKLIK)
            
            # Alt çıkıntı
            .faces(face_direction)
            .workplane(offset=-TABAN_KALINLIK)
            .pushPoints([(rulman_x, rulman_y)])
            .circle(CIKINTI_YARICAP)
            .extrude(-CIKINTI_YUKSEKLIK)
        )
    
    return workpiece

# =============================================================================
# MONTAJ DELİKLERİ VE YUVALAR
# =============================================================================

def add_mounting_features(workpiece):
    """
    Montaj deliklerini ve özel yuvları ekler.
    
    Args:
        workpiece: İşlenecek parça
        
    Returns:
        cq.Workplane: Montaj özelliklerinin eklendiği parça
    """
    
    # Destek duvarı ekleme
    workpiece = (
        workpiece
        .faces(">Y")
        .workplane(offset=-TABAN_KALINLIK - X_PROFIL_BOYUT)
        .pushPoints([(0, TOPLAM_GENISLIK/2 - YAN_KALINLIK/2)])
        .rect(BIRLESTIRICI_UZUNLUK, YAN_KALINLIK)
        .extrude(X_PROFIL_BOYUT)
    )
    
    # Araba montaj delikleri (temizleme)
    araba_merkez_offset = TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2
    
    workpiece = (
        workpiece
        .faces(">Y")
        .workplane(centerOption="CenterOfBoundBox")
        .pushPoints([
            (ARABA_DELIK_C/2, araba_merkez_offset + ARABA_DELIK_B/2),
            (ARABA_DELIK_C/2, araba_merkez_offset - ARABA_DELIK_B/2),
            (-ARABA_DELIK_C/2, araba_merkez_offset + ARABA_DELIK_B/2),
            (-ARABA_DELIK_C/2, araba_merkez_offset - ARABA_DELIK_B/2),
        ])
        .circle(4.5)
        .cutBlind(-TABAN_KALINLIK - X_PROFIL_BOYUT)
    )
    
    # Rulman yuvaları (altıgen)
    rulman_x = X_PROFIL_BOYUT/2 + YAN_KALINLIK + 18
    rulman_y = (TOPLAM_GENISLIK/2 - ARABA_GENISLIK/2 - 
                MOTOR_KASNAK_CAP/2 - RULMAN_KASNAK_CAP/2)
    
    for face_direction in [">Y", "<Y"]:
        workpiece = (
            workpiece
            .faces(face_direction)
            .workplane(centerOption="CenterOfBoundBox")
            .pushPoints([(rulman_x, rulman_y)])
            .polygon(6, 15.2)  # 6 kenar, 15.2mm çap
            .cutBlind(-6.5)
        )
    
    # M8 montaj delikleri
    for face_direction in [">Y", "<Y"]:
        workpiece = (
            workpiece
            .faces(face_direction)
            .workplane(centerOption="CenterOfBoundBox")
            .pushPoints([(-rulman_x, rulman_y)])
            .cboreHole(
                diameter=M8_VIDA_CAP,
                cboreDiameter=M8_IMBUS_BAS_CAP,
                cboreDepth=M8_IMBUS_BAS_DERINLIK,
                depth=M8_VIDA_UZUNLUK
            )
        )
    
    return workpiece

# =============================================================================
# ESTETIK SPLINE KESIMLER
# =============================================================================

def create_aesthetic_cuts():
    """
    Estetik görünüm için spline kesimler oluşturur.
    
    Returns:
        cq.Workplane: Birleştirilmiş spline kesimler
    """
    
    # Sol taraf spline kesimi
    spline_1 = (
        cq.Workplane("XZ")
        .moveTo(-BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2 - RULMAN_TUTUCU_X)
        .spline([
            (-BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2 + RULMAN_TUTUCU_X - 9),
            (-X_PROFIL_BOYUT/2 - 2*YAN_KALINLIK, -TOPLAM_GENISLIK/2 + 3*RULMAN_TUTUCU_X/4 - 9),
            (-X_PROFIL_BOYUT/2 - YAN_KALINLIK, -TOPLAM_GENISLIK/2)
        ])
        .lineTo(-BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2)
        .close()
        .extrude(TABAN_KALINLIK + X_PROFIL_BOYUT/2, both=True)
    )
    
    # Sağ taraf spline kesimi
    spline_2 = (
        cq.Workplane("XZ")
        .moveTo(BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2 - RULMAN_TUTUCU_X)
        .spline([
            (BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2 + RULMAN_TUTUCU_X - 9),
            (X_PROFIL_BOYUT/2 + 2*YAN_KALINLIK, -TOPLAM_GENISLIK/2 + 3*RULMAN_TUTUCU_X/4 - 9),
            (X_PROFIL_BOYUT/2 + YAN_KALINLIK, -TOPLAM_GENISLIK/2)
        ])
        .lineTo(BIRLESTIRICI_UZUNLUK/2, -TOPLAM_GENISLIK/2)
        .close()
        .extrude(TABAN_KALINLIK + X_PROFIL_BOYUT/2, both=True)
    )
    
    return spline_1.union(spline_2)

# =============================================================================
# ANA MONTAJ FONKSİYONU
# =============================================================================

def create_xy_joiner():
    """
    Tüm bileşenleri birleştirerek XY birleştiriciyi oluşturur.
    
    Returns:
        cq.Workplane: Tamamlanmış XY birleştirici
    """
    
    print("XY Birleştirici oluşturuluyor...")
    
    # 1. Ana blok oluşturma
    print("- Ana blok oluşturuluyor...")
    ana_blok = create_main_block()
    
    # 2. Boşlukları oluşturma
    print("- Profil yuvası oluşturuluyor...")
    profil_yuvasi = create_profile_slot()
    
    print("- Kayış yuvaları oluşturuluyor...")
    kayis_yuvalari = create_belt_slots()
    
    # 3. Boşlukları birleştirme ve ana bloktan çıkarma
    print("- Boşluklar ana bloktan çıkarılıyor...")
    tum_bosluklar = profil_yuvasi.union(kayis_yuvalari)
    xy_birlestirici = ana_blok.cut(tum_bosluklar)
    
    # 4. Rulman tutucu silindirlerini ekleme
    print("- Rulman tutucu silindirler ekleniyor...")
    xy_birlestirici = add_bearing_cylinders(xy_birlestirici)
    
    # 5. Montaj özelliklerini ekleme
    print("- Montaj özellikleri ekleniyor...")
    xy_birlestirici = add_mounting_features(xy_birlestirici)
    
    # 6. Estetik kesimler
    print("- Estetik spline kesimler yapılıyor...")
    estetik_kesimler = create_aesthetic_cuts()
    xy_birlestirici = xy_birlestirici.cut(estetik_kesimler)
    
    print("✓ XY Birleştirici başarıyla oluşturuldu!")
    
    return xy_birlestirici

# =============================================================================
# ANA PROGRAM - CAD QUERY ORTAMI İÇİN
# =============================================================================

# XY birleştiriciyi oluştur
xy_joiner = create_xy_joiner()

# Görselleştirme (CQ-Editor'da)
show_object(xy_joiner, name="CoreXY_XY_Birlestirici")

# 3MF formatında dışa aktarma
export_path = "C:\gulderenlab\public\models\XY_Birlestirici\XY_Birlestirici.3mf"
try:
    cq.exporters.export(xy_joiner, export_path)
    print(f"✓ Model başarıyla dışa aktarıldı: {export_path}")
except Exception as e:
    print(f"✗ Dışa aktarma hatası: {e}")

# Tasarım özetini yazdır
print("\n" + "="*50)
print("TASARIM ÖZETİ")
print("="*50)
print(f"Toplam boyutlar: {BIRLESTIRICI_UZUNLUK}x{TOPLAM_GENISLIK}x{2*TABAN_KALINLIK+X_PROFIL_BOYUT}mm")
print(f"X Profil yuvası: {X_PROFIL_BOYUT+TOLERANS}x{X_PROFIL_BOYUT+TOLERANS}mm")
print(f"Araba montaj delikleri: M{int(M5_VIDA_CAP)} (4 adet)")
print(f"Profil bağlantı delikleri: M{int(M5_VIDA_CAP)} (4 adet)")
print(f"Rulman montaj delikleri: M{int(M8_VIDA_CAP)} (2 adet)")
print(f"Rulman tutucu silindirler: Ø{2*SILINDIR_YARICAP}mm")
print("="*50)