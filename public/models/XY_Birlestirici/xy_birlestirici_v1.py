# Gerekli kütüphaneleri içe aktarma
import cadquery as cq
from cadquery import exporters # Gerekirse dışa aktarma için
# Kullanılacak X taşıyıcı profil 4040 olacak
# Buradan 40 mm gelecek
# Rulmanlar: F 628 ZZ 8x24x8 Flanşlı Rulman kullanılacak
# X ekseni kayışları 10 mm uzaktan seyredecek. 
# 2x10 = 20 mm eklendi
# Rulman flanş çapları 27 mm
# 2x27 mm = 54 mm buradan geldi.Ancak rulman kayışları 24 mm çaplı kasnak üzerinden geçecek
# Dolayısıyla efektif rulman çapı 27/2+24/2 = 25.5 oldu
# 2*25.5 = 51 mm
# Toplam y ekseni uzunluğu 
# 40 + 20 + 51 = 111 mm
# Genişlik ise araba genişliği + rulman tutucu uzantısı
araba_genislik = 44
rulman_tutucu_X = 32
toplam_genislik = araba_genislik + rulman_tutucu_X
birlestirici_uzunluk = 120 
birlestirici_yukseklik = 10 
taban_kalınlık = 5
yan_kalınlık = 5

#X ekseni profil boyutları
x_profil_boyut = 40 
tolerans = 0.2 # ortalama 0.3 mm


#arabanın vida delik konumları için ölçüler (araba merkezine göre)
B = 32 # z ekseninde delikler arası mesafe
C = 36 # x ekseninde delikler arasındaki mesafe
# M5 insert somun için ölçüler
m5_insert_cap = 5.2          # gövde deliği çapı
m5_insert_bas_cap = 7       # baş çapı
m5_insert_bas_derinlik = 5  # baş derinliği
m5_vida_uzunluk = birlestirici_yukseklik       # toplam delik derinliği (senin kutunun kalınlığı)

# M5 insert somun için delik ölçüleri
m5_insert_cap = 6.4             # delik çapı (7 mm yerine biraz dar)
m5_insert_derinlik = 5.3        # delik derinliği (boy + tolerans)
m5_insert_chamfer = 0.8         # üst kenarda pah
m5_clearance = 5.2


# M5 imbus vida için ölçüler
m5_vida_cap = 5.2          # gövde deliği çapı
m5_imbus_bas_cap = 8.55       # baş çapı
m5_imbus_bas_derinlik = 5  # baş derinliği
m5_vida_uzunluk = birlestirici_yukseklik       # toplam delik derinliği (senin kutunun kalınlığı)


# M8 imbus başlı vida için ölçüler
m8_vida_cap = 8.1              # gövde deliği çapı
m8_imbus_bas_cap = 13.1          # baş çapı
m8_imbus_bas_derinlik = 8      # baş derinliği
m8_vida_uzunluk = x_profil_boyut + 2*taban_kalınlık  # toplam delik derinliği (parça kalınlığı)
#Burada 2 mm ek silindir yüksekliği

# Tek blok halinde 3D Model
# Araba tutucu kısmının merkezi toplam genişliğin sol tarafında olacak
# Araba merkezinin x koordinatı: -rulman_tutucu_X/2
araba_merkez_z = -rulman_tutucu_X/2 # bunu z eksenine aldık

motor_kasnak_capi = 12 
rulman_kasnak_capi = 24 
kayis_yan_duvar_mesafesi = 10 # kayışların yan duvara olan uzaklıkları


ana_blok = (
    cq.Workplane("XZ")
    .box(birlestirici_uzunluk,
         toplam_genislik,
         2*taban_kalınlık+x_profil_boyut 
        )
    .faces(">Y")
    .pushPoints([
        (0,-toplam_genislik/2 + rulman_tutucu_X/2 + 8),
        (0,-toplam_genislik/2 + rulman_tutucu_X/2 - 8)
        ])
    # .cboreHole(
    #     diameter=m5_vida_cap,
    #     cboreDiameter=m5_imbus_bas_cap,
    #     cboreDepth=m5_imbus_bas_derinlik,
    #     depth=m5_vida_uzunluk
    #     )
    .circle(m5_vida_cap/2)
    .cutThruAll()
    .faces("<Y")
    .workplane(centerOption="CenterOfBoundBox")
    .pushPoints([
        (0,-toplam_genislik/2 + rulman_tutucu_X/2 + 8),
        (0,-toplam_genislik/2 + rulman_tutucu_X/2 - 8)
        ])
    # .cboreHole(
    #     diameter=m5_vida_cap,
    #     cboreDiameter=m5_imbus_bas_cap,
    #     cboreDepth=m5_imbus_bas_derinlik,
    #     depth=m5_vida_uzunluk
    #     )
    .circle(m5_vida_cap/2)
    .cutThruAll()
    .faces(">Y")
    .workplane(centerOption="CenterOfBoundBox")
    .pushPoints([
        (0,-toplam_genislik/2 + rulman_tutucu_X/2 + 8),
        (0,-toplam_genislik/2 + rulman_tutucu_X/2 - 8)
        ])
    # .cboreHole(
    #     diameter=m5_vida_cap,
    #     cboreDiameter=m5_imbus_bas_cap,
    #     cboreDepth=m5_imbus_bas_derinlik,
    #     depth=m5_vida_uzunluk
    #     )
    .circle(m5_vida_cap/2)
    .cutThruAll()
    .faces(">Y")
    .workplane(offset=-taban_kalınlık-x_profil_boyut)
    .pushPoints([
        (C/2, toplam_genislik/2-araba_genislik/2+B/2),
        (C/2, toplam_genislik/2-araba_genislik/2-B/2),
        (-C/2, toplam_genislik/2-araba_genislik/2+B/2),
        (-C/2, toplam_genislik/2-araba_genislik/2-B/2),
        ])
    # .cboreHole(
    #     diameter=m5_vida_cap,
    #     cboreDiameter=m5_imbus_bas_cap,
    #     cboreDepth=m5_imbus_bas_derinlik,
    #     depth=m5_vida_uzunluk
    #     )
    .circle(m5_vida_cap/2)
    .cutThruAll()
    # .hole(m5_insert_cap, depth=m5_insert_derinlik) 
    # .faces(">Y")
    # .workplane(offset=-taban_kalınlık-x_profil_boyut)
    # .pushPoints([
    #     (C/2, toplam_genislik/2-araba_genislik/2+B/2),
    #     (C/2, toplam_genislik/2-araba_genislik/2-B/2),
    #     (-C/2, toplam_genislik/2-araba_genislik/2+B/2),
    #     (-C/2, toplam_genislik/2-araba_genislik/2-B/2),
    #     ])
    # .circle(m5_clearance/2)
    # .cutThruAll()# delik
    )


profil_yuvası = (
    cq.Workplane("XY")
    .box(
        x_profil_boyut+tolerans,
        x_profil_boyut+tolerans,
        toplam_genislik
        )
    .fillet(2)
    .translate(
        (0,
         0,
         -44
            
            )
        )
    )

#+X +Y yönündeki kayış yuvası
kayıs_yuvası_1 = (
    cq.Workplane("XY")
    .box(
        (birlestirici_uzunluk-2*yan_kalınlık-x_profil_boyut)/2,
        x_profil_boyut,
        toplam_genislik
        )
    .translate(
        (
            birlestirici_uzunluk/2 -(birlestirici_uzunluk-2*yan_kalınlık-x_profil_boyut)/4,
            0,
            0
            )
        )
    )

#-X +Y yönündeki kayış yuvası
kayıs_yuvası_2 = (
    cq.Workplane("XY")
    .box(
        (birlestirici_uzunluk-2*yan_kalınlık-x_profil_boyut)/2,
        x_profil_boyut,
        toplam_genislik
        )
    .translate(
        (
            -birlestirici_uzunluk/2 +(birlestirici_uzunluk-2*yan_kalınlık-x_profil_boyut)/4,
            0,
            0
            )
        )
    )

#X doğrultusundaki kayış yuvası
kayıs_yuvası_3 = (
    cq.Workplane("XY")
    .box(
        birlestirici_uzunluk,
        x_profil_boyut,
        araba_genislik-yan_kalınlık
        )
    .translate(
        (
            0,
            0,
            toplam_genislik/2-araba_genislik/2-yan_kalınlık
            )
        )
    )






#insert somunları yerleştirme boşlukları:

# R = 5
# # insert somunları yerleştirmek için açıklık

# insert_silindir_1 = (
#     cq.Workplane("XZ")
#     .center(C/2, toplam_genislik/2-araba_genislik/2+B/2)
#     .cylinder(height=50, radius=R)
#     .translate(
#         (0,
#          taban_kalınlık/2,
#          0
#             )
#         )
#     )
# # show_object(insert_silindir_1, name="insert_silindir_1", options={"alpha":1, "color":(200,20,20)})

# insert_silindir_2 = (
#     cq.Workplane("XZ")
#     .center(C/2, toplam_genislik/2-araba_genislik/2-B/2)
#     .cylinder(height=50, radius=R)
#     .translate(
#         (0,
#          taban_kalınlık/2,
#          0
#             )
#         )
#     )
# show_object(insert_silindir_2, name="insert_silindir_2", options={"alpha":1, "color":(200,20,20)})

# insert_silindir_3 = (
#     cq.Workplane("XZ")
#     .center(-C/2, toplam_genislik/2-araba_genislik/2+B/2)
#     .cylinder(height=50, radius=R)
#     .translate(
#         (0,
#          taban_kalınlık/2,
#          0
#             )
#         )
#     )
# show_object(insert_silindir_3, name="insert_silindir_3", options={"alpha":1, "color":(200,20,20)})

# insert_silindir_4 = (
#     cq.Workplane("XZ")
#     .center(-C/2, toplam_genislik/2-araba_genislik/2-B/2)
#     .cylinder(height=50, radius=R)
#     .translate(
#         (0,
#          taban_kalınlık/2,
#          0
#             )
#         )
#     )
# show_object(insert_silindir_4, name="insert_silindir_4", options={"alpha":1, "color":(200,20,20)})

#Şimdi tabandaki somn yuvalarını yapalım:

# insert_somun_1 = (
#     cq.Workplane("XZ")
#     .center(C/2, toplam_genislik/2-araba_genislik/2+B/2)
#     .cylinder(height=50, radius=R)
#     .translate(
#         (0,
#          taban_kalınlık/2,
#          0
#             )
#         )
#     )
# show_object(insert_silindir_1, name="insert_silindir_1", options={"alpha":1, "color":(200,20,20)})


# insert_silindir =insert_silindir_1.union(insert_silindir_2.union(insert_silindir_3.union(insert_silindir_4))) 

bosluk_blok = kayıs_yuvası_1.union(kayıs_yuvası_2.union(kayıs_yuvası_3.union(profil_yuvası)))

blok_1 = ana_blok.cut(bosluk_blok)
silindir_yukseklik = 18.5
silindir_yarıçapı = 8
cıkıntı_yukseklik = 1.3 # normalde 1.5 olması gerekiyor. tolerans için azalttık
cıkıntı_yarıcap = 6
blok_1 = (blok_1
          .faces(">Y")
          .workplane(offset=-taban_kalınlık-x_profil_boyut)
          .pushPoints
          ([
              (x_profil_boyut/2+yan_kalınlık+rulman_kasnak_capi/2 + kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2)
              ])
          .circle(silindir_yarıçapı)
          .extrude(silindir_yukseklik)
          .faces(">Y") # 2 mm'lik çıkıntı içim
          .workplane(offset=-taban_kalınlık-x_profil_boyut + silindir_yukseklik)
          .pushPoints
          ([
              (x_profil_boyut/2+yan_kalınlık+rulman_kasnak_capi/2 + kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2)
              ])
          .circle(cıkıntı_yarıcap)
          .extrude(cıkıntı_yukseklik)
          .faces(">Y") # 2 mm'lik çıkıntı içim
          .workplane(offset=-taban_kalınlık)
          .pushPoints
          ([
              (x_profil_boyut/2+yan_kalınlık+rulman_kasnak_capi/2 + kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2)
              ])
          .circle(cıkıntı_yarıcap)
          .extrude(-cıkıntı_yukseklik)
          .faces("<Y")
          .workplane(offset=-taban_kalınlık-x_profil_boyut)
          .pushPoints
          ([
              (x_profil_boyut/2+yan_kalınlık+rulman_kasnak_capi/2 + kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2-rulman_kasnak_capi/2)
              ])
          .circle(silindir_yarıçapı)
          #.polygon(8,24)
          .extrude(silindir_yukseklik)
          .faces("<Y") # çıkıntı silindiri 1
          .workplane(offset=-taban_kalınlık-x_profil_boyut+silindir_yukseklik)
          .pushPoints
          ([
              (x_profil_boyut/2+yan_kalınlık+rulman_kasnak_capi/2 + kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2-rulman_kasnak_capi/2)
              ])
          .circle(cıkıntı_yarıcap)
          #.polygon(8,24)
          .extrude(cıkıntı_yukseklik)
          .faces("<Y") # çıkıntı silindiri 2
          .workplane(offset=-taban_kalınlık)
          .pushPoints
          ([
              (x_profil_boyut/2+yan_kalınlık+rulman_kasnak_capi/2 + kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2-rulman_kasnak_capi/2)
              ])
          .circle(cıkıntı_yarıcap)
          #.polygon(8,24)
          .extrude(-cıkıntı_yukseklik)
          .faces(">Y")
          .workplane(offset=-taban_kalınlık-x_profil_boyut)
          .pushPoints([
              (0, toplam_genislik/2-yan_kalınlık/2),
              ])
          .rect(birlestirici_uzunluk,yan_kalınlık)
          .extrude(x_profil_boyut)
          .faces(">Y")
          .workplane(centerOption="CenterOfBoundBox")
          .pushPoints([
              (C/2, toplam_genislik/2-araba_genislik/2+B/2),
              (C/2, toplam_genislik/2-araba_genislik/2-B/2),
              (-C/2, toplam_genislik/2-araba_genislik/2+B/2),
              (-C/2, toplam_genislik/2-araba_genislik/2-B/2),
              ])
          #.polygon(20, 20)
          .circle(4.5)
          .cutBlind(-taban_kalınlık-x_profil_boyut)
          # .faces(">Y")
          # .workplane(centerOption="CenterOfBoundBox")
          # .pushPoints
          # ([
          #     (x_profil_boyut/2+yan_kalınlık+rulman_kasnak_capi/2 + kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2)
          #     ])
          # .polygon(6, 15.2)  # 6 gen, 12mm çap
          # .cutBlind(-6.5)
          .faces(">Y")
          .workplane(centerOption="CenterOfBoundBox")
          .pushPoints
          ([
              (-x_profil_boyut/2-yan_kalınlık-rulman_kasnak_capi/2 - kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2-rulman_kasnak_capi/2)
              ])
          # .cboreHole(
          #     diameter=m8_vida_cap,
          #     cboreDiameter=m8_imbus_bas_cap,
          #     cboreDepth=m8_imbus_bas_derinlik,
          #     depth=m8_vida_uzunluk
          #     )
          .circle(m8_vida_cap/2)
          .cutThruAll()
          .faces("<Y")
          # .workplane(centerOption="CenterOfBoundBox")
          # .pushPoints
          # ([
          #     (x_profil_boyut/2+yan_kalınlık+rulman_kasnak_capi/2 + kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2-rulman_kasnak_capi/2)
          #     ])
          # .polygon(6, 15.2)  # 6 gen, 12mm çap
          # .cutBlind(-6.5)
          # .faces("<Y")
          .workplane(centerOption="CenterOfBoundBox")
          .pushPoints
          ([
              (-x_profil_boyut/2-yan_kalınlık-rulman_kasnak_capi/2 - kayis_yan_duvar_mesafesi,toplam_genislik/2-araba_genislik/2-motor_kasnak_capi/2)
              ])
          # .cboreHole(
          #     diameter=m8_vida_cap,
          #     cboreDiameter=m8_imbus_bas_cap,
          #     cboreDepth=m8_imbus_bas_derinlik,
          #     depth=m8_vida_uzunluk
          #     )
          .circle(m8_vida_cap/2)
          .cutThruAll()
)


# Alternatif yöntem - spline kullanarak eğri (birinci-ikinci nokta arası)
result_spline_1 = (cq.Workplane("XZ")
    .moveTo(-birlestirici_uzunluk/2, -toplam_genislik/2-rulman_tutucu_X)
    # İlk noktadan ikinci noktaya spline eğrisi
    .spline([(-birlestirici_uzunluk/2, -toplam_genislik/2 + rulman_tutucu_X-9),
             (-x_profil_boyut/2-2*yan_kalınlık, -toplam_genislik/2 + 3*rulman_tutucu_X/4-9),
             (-x_profil_boyut/2-yan_kalınlık, -toplam_genislik/2)
             ])
    # Üçüncü noktaya düz çizgi
    .lineTo(-birlestirici_uzunluk/2, -toplam_genislik/2)
    .close()
    .extrude(taban_kalınlık+x_profil_boyut/2, both=True)
)
#show_object(result_spline, name="XY Joiner", options={"alpha":1, "color":(200,20,20)})

result_spline_2 = (cq.Workplane("XZ")
    .moveTo(birlestirici_uzunluk/2, -toplam_genislik/2-rulman_tutucu_X)
    # İlk noktadan ikinci noktaya spline eğrisi
    .spline([(birlestirici_uzunluk/2, -toplam_genislik/2 + rulman_tutucu_X-9),
             (x_profil_boyut/2+2*yan_kalınlık, -toplam_genislik/2 + 3*rulman_tutucu_X/4-9),
             (x_profil_boyut/2+yan_kalınlık, -toplam_genislik/2)
             ])
    # Üçüncü noktaya düz çizgi
    .lineTo(birlestirici_uzunluk/2, -toplam_genislik/2)
    .close()
    .extrude(taban_kalınlık+x_profil_boyut/2, both=True)
)

spline = result_spline_1.union(result_spline_2)
blok_1 = blok_1.cut(spline)

show_object(blok_1, name="blok_1")
cq.exporters.export(blok_1, "D:/GulderenLab-Yedek/Notes/Projeler/3D Yazıcı/3D Pojects/xy_birlestirici_v1.3mf")