"""Harput Kalesi — Blender viewport'unda doğrudan görülerek kurulur.

Dersler (önceki denemelerden):
  - Bloklar ARALIKLI durursa sur domino dizisi gibi okunuyor; bu yüzden
    her parça komşusuyla ÖRTÜŞÜR. Remesh gerekmiyor, örtüşme yeterli.
  - Voxel remesh kesme taşı yuvarlatıp kile çeviriyor; kullanılmadı.
  - Kale kayanın üstünde havada durmasın diye temel, kayanın İÇİNE gömülür.
  - Kaya ile kale aynı kireçtaşı ailesinde; kontrast tonda, renkte değil.
"""

import math
import bpy

# -------------------------------------------------------------- temizlik
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for blok in (bpy.data.meshes, bpy.data.materials):
    for x in list(blok):
        if x.users == 0:
            blok.remove(x)

S = bpy.context.scene


def srgb(h):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda v: v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (f(r), f(g), f(b))


def dugum(agac, tur):
    """Düğümü ADIYLA değil TÜRÜYLE bulur.

    Blender sürümleri ve arayüz dili düğüm adını değiştirebiliyor;
    "Principled BSDF" adı 5.2'de bulunamadı. Tür sabit kalır.
    """
    for n in agac.nodes:
        if n.type == tur:
            return n
    return None


def mat(ad, renk, puruz=0.93):
    m = bpy.data.materials.new(ad)
    m.use_nodes = True
    b = dugum(m.node_tree, "BSDF_PRINCIPLED")
    if b:
        b.inputs[0].default_value = (*renk, 1.0)
        if "Roughness" in b.inputs:
            b.inputs["Roughness"].default_value = puruz
    m.diffuse_color = (*renk, 1.0)
    return m


SUR      = mat("sur",      srgb("#c7b28b"))
SUR_ACIK = mat("sur_acik", srgb("#d6c4a2"))
SUR_KOYU = mat("sur_koyu", srgb("#a89169"))
KAYA     = mat("kaya",     srgb("#b5aa90"), 0.96)

G = bpy.data.textures.new("g", "CLOUDS")
G.noise_scale = 2.2
G.noise_depth = 4


def rnd(t0):
    t = t0
    def f():
        nonlocal t
        t = (t * 1664525 + 1013904223) % 4294967296
        return t / 4294967296
    return f

r = rnd(11)
parcalar = []


def blok(konum, olcu, m=SUR, pah=0.06, donus=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=konum, rotation=donus)
    o = bpy.context.active_object
    o.scale = olcu
    bpy.ops.object.transform_apply(scale=True)
    b = o.modifiers.new("pah", "BEVEL")
    b.width = pah; b.segments = 2; b.limit_method = "ANGLE"
    o.data.materials.append(m)
    parcalar.append(o)
    return o


# ------------------------------------------------------------ kaya sırtı
# Tepe düzlüğü z=0 civarında; kale temeli buraya gömülecek.
bpy.ops.mesh.primitive_cone_add(vertices=10, radius1=13.0, radius2=8.2,
                                depth=20.0, location=(0, 0, -9.4))
kaya = bpy.context.active_object
kaya.name = "kaya"
kaya.scale = (1.65, 1.0, 1.0)
bpy.ops.object.transform_apply(scale=True)
kaya.modifiers.new("alt", "SUBSURF").levels = 3
d = kaya.modifiers.new("boz", "DISPLACE")
d.texture = G; d.strength = 1.5; d.mid_level = 0.5
dec = kaya.modifiers.new("sad", "DECIMATE")
dec.ratio = 0.18
kaya.data.materials.append(KAYA)

# -------------------------------------------------------------- kale
BATI, DOGU = -10.0, 8.5
GUNEY, KUZEY = -3.1, 3.1

# Temel: kayanın içine gömülü, üstü z=+0.6'da
blok((-0.8, 0, -2.2), (20.0, 7.2, 5.6), SUR_KOYU, pah=0.1)

# Perde duvarlar — tek uzun kütle, üstleri sonra kırılır
blok((-0.8, GUNEY, 2.7), (19.2, 1.2, 4.6))          # güney, yüksek
blok((-1.1, KUZEY, 1.9, ), (17.0, 1.1, 3.0))        # kuzey, alçak
blok((BATI + 0.9, 0, 2.0), (1.2, 6.4, 3.2))         # batı kapanışı
blok((DOGU - 0.5, 0, 2.3), (1.2, 6.2, 3.8))         # doğu kapanışı

# Güney cephesindeki kare payanda kuleleri — duvarla ÖRTÜŞÜR
for x, h, en in [(-6.2, 5.5, 2.3), (-2.0, 5.0, 2.1), (1.9, 5.9, 2.4), (5.3, 4.7, 2.1)]:
    blok((x, GUNEY - 0.55, 0.6 + h / 2), (en, 2.1, h))
    blok((x, GUNEY - 0.55, 0.6 + h + 0.22), (en * 0.97, 2.03, 0.5), SUR_KOYU, pah=0.04)

# Batı ucundaki büyük yuvarlak burç: şevli taban + masif gövde
bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=2.7, radius2=2.2,
                                depth=3.4, location=(BATI - 0.2, -0.4, 1.3))
sev = bpy.context.active_object
sev.data.materials.append(SUR_KOYU)
parcalar.append(sev)
bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=2.2, depth=5.4,
                                    location=(BATI - 0.2, -0.4, 5.6))
bur = bpy.context.active_object
b = bur.modifiers.new("pah", "BEVEL")
b.width = 0.06; b.segments = 2; b.limit_method = "ANGLE"
bur.data.materials.append(SUR)
parcalar.append(bur)

# Doğu ucundaki yüksek iç kale
blok((DOGU - 2.3, 0.2, 3.5), (5.0, 5.4, 6.0))

# Üst hatları kır: duvarların üstüne düzensiz, örtüşen bloklar
for i in range(11):
    x = -9.4 + i * 1.85
    h = 0.4 + r() * 1.5
    if r() < 0.2:
        continue
    blok((x, GUNEY, 5.0 + h / 2), (1.95, 1.22, h),
         (SUR_ACIK, SUR, SUR_KOYU)[i % 3], pah=0.04)
for i in range(8):
    x = -8.6 + i * 2.2
    h = 0.3 + r() * 1.1
    if r() < 0.25:
        continue
    blok((x, KUZEY, 3.4 + h / 2), (2.3, 1.12, h),
         (SUR, SUR_ACIK)[i % 2], pah=0.04)

# Doğuya teraslanan alt surlar
for x, y, h, en in [(10.4, -1.2, 3.0, 3.4), (12.0, 1.2, 2.4, 3.0), (11.2, 3.2, 2.0, 4.0)]:
    blok((x, y, -0.8 + h / 2), (en, 1.2, h), SUR_KOYU)

# Bütün kale parçalarını tek nesnede topla
bpy.ops.object.select_all(action="DESELECT")
for o in parcalar:
    o.select_set(True)
bpy.context.view_layer.objects.active = parcalar[0]
bpy.ops.object.join()
kale = bpy.context.active_object
kale.name = "kale"

# ------------------------------------------------------------ ışık
bpy.ops.object.light_add(type="SUN", location=(16, -16, 24))
gun = bpy.context.active_object
gun.data.energy = 4.5
gun.data.angle = math.radians(1.5)
gun.rotation_euler = (math.radians(50), 0, math.radians(34))

if S.world is None:
    S.world = bpy.data.worlds.new("w")
S.world.use_nodes = True
bg = dugum(S.world.node_tree, "BACKGROUND")
if bg:
    bg.inputs[0].default_value = (0.33, 0.48, 0.65, 1)
    bg.inputs[1].default_value = 1.2

print("HARPUT KURULDU — parca:", len(parcalar))
