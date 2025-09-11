import cadquery as cq

# =============================================================================
# --- 1. PROJE KONFİGÜRASYONU: PARAMETRİK DNA ---
# =============================================================================

# --- MGN15H Blok Parametreleri (Teknik Çizelgeden Alınan Veriler) ---
mgn15h_params = {
    "width": 32.0,                  # Datasheet: W
    "length": 58.8,                 # Datasheet: L
    "hole_spacing_width": 25.0,     # Datasheet: B
    "hole_spacing_length": 43.4,    # Datasheet: L1
    "total_height": 16.0,           # Datasheet: H
    "bolt_type": "M3"
}

# --- X-Ekseni Gantry Profili Parametreleri ---
profile_params = {
    "width": 40.0,
    "height": 40.0
}

# --- Y-Blok Tasarım Parametreleri (Bizim Kararlarımız) ---
design_params = {
    "wall_thickness": 8.0,          # Ana duvar kalınlığı, çok rijit olacak
    "plate_height": 10.0            # MGN15H altına gelen plakanın kalınlığı
}

# --- Genel Donanım Parametreleri ---
hardware_params = {
    "m3_bolt_dia": 3.0,
    "m3_head_dia": 5.5,
    "m3_head_height": 3.0,
    "m5_bolt_dia": 5.0,             # Kasnaklar için
    "m5_nut_hex_dia": 8.0,          # M5 somunun anahtar ağzı
    "m5_nut_hex_thickness": 4.0
}

# --- 3D Baskı Toleransları ---
print_tolerances = {
    "hole_expansion": 0.4,          # Deliklerin sıkı geçmemesi için genişletme
    "wall_clearance": 0.3           # Birbirine geçen parçalar arası boşluk
}
# =============================================================================
# --- 2. TASARIM OLUŞTURMA ---
# =============================================================================

# --- A) MGN15H Montaj Plakasını Oluşturma ---
# Bu, her şeyin temeli olan, lineer arabaya vidalanan parça.
plate_width = mgn15h_params['width'] + 2 * design_params['wall_thickness']
plate_length = mgn15h_params['length']
plate_height = design_params['plate_height']

# Ana plakayı oluştur
base_plate = cq.Workplane("XY").box(plate_length, plate_width, plate_height)

# Vida başlarının gömüleceği havşalı delikleri (counterbore) aç
# Bu delikler alttan açılacak çünkü parça "asılı" duracak
base_plate = base_plate.faces("<Z").workplane(invert=True) \
    .rect(
        mgn15h_params['hole_spacing_length'],
        mgn15h_params['hole_spacing_width'],
        forConstruction=True) \
    .vertices() \
    .cboreHole(
        hardware_params['m3_bolt_dia'] + print_tolerances['hole_expansion'],
        hardware_params['m3_head_dia'] + print_tolerances['hole_expansion'],
        hardware_params['m3_head_height'],
        depth=plate_height
    )


# --- B) 4040 Profil Kelepçesini Oluşturma ---
# Bu, X-ekseni profilini merkezden kavrayacak olan "C" şeklindeki parça.
clamp_outer_height = profile_params['height'] + 2 * design_params['wall_thickness']
clamp_outer_width = profile_params['width'] + 2 * design_params['wall_thickness']

# Kelepçenin dışını oluştur
profile_clamp = cq.Workplane("XZ").box(plate_length, clamp_outer_width, clamp_outer_height)

# Kelepçenin içini, 4040 profilin gireceği şekilde boşalt
profile_clamp = profile_clamp.faces(">Y").workplane() \
    .rect(
        profile_params['length'] + print_tolerances['wall_clearance'], # Uzunluk burada plate_length olmalı
        profile_params['height'] + print_tolerances['wall_clearance'],
    ) \
    .cutThruAll()


# --- C) İki Parçayı Birleştirme (Union) ---
# "Merkezlenmiş montaj" prensibine göre, iki parçanın merkezleri Z ekseninde hizalanacak.
# Taban plakasını, kelepçenin altına gelecek şekilde doğru konuma taşıyoruz.
z_offset = -(clamp_outer_height / 2 + plate_height / 2)

# Union işlemi ile tek ve solid bir gövde oluştur
y_block_base_body = profile_clamp.union(
    base_plate.translate((0, 0, z_offset))
)


# --- SONUÇ ---
# Oluşturulan temel gövdeyi göster
# show_object(y_block_base_body)

# STL olarak kaydetmek için aşağıdaki satırı kullanabilirsin
# cq.exporters.export(y_block_base_body, 'y_block_base_v1.stl')