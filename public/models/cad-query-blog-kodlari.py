# CadQuery'yi içe aktar
import cadquery as cq
# Dışa aktarma modülünü içe aktar
from cadquery import exporters


model = (
    cq.Workplane("XY")
    .box(20, 20, 10)
    .faces(">Z").workplane()
    .polyline[(-5, -5), (0, -5), (5, 5), (0, 5)]
    .extrude(10)
)

# Prizmayı 'prizma.step' olarak STEP formatında dışa aktar (veya .gltf)
# Blog'da göstermek için .gltf formatını tercih edebilirsiniz:
exporters.export(model, 'box.step') 

# Prizmayı görüntüleyicide göster (varsa)
show_object(model)