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
