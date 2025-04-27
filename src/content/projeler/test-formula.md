---
title: KaTeX Test Sayfası
description: Matematik formülü render testi
publishDate: 2024-01-01
tags: ["test", "math"]
image:
  src: "/images/test-katex.png"
  alt: "Formül testi görseli"
isDraft: false
---

Bu bir örnek metindir.[^1]

[^1]: Bu bir ayak notasıdır. Detaylı açıklama veya referans bilgisi buraya yazılabilir.

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

<Layout title="3B Model Görüntüleyici">
  <h1 class="text-3xl font-bold mb-6">3B Model</h1>

  <model-viewer
    src="/models/3b-farkli-renk.gltf"
    alt="Döndürülebilir 3B Model"
    auto-rotate
    camera-controls
    style="width: 100%; height: 600px; background-color:rgb(245, 246, 243);" />
</Layout>

✅ Tailwind ile model-viewer arka planını beyaz yapma

<model-viewer
  src="/models/3b-model.glb"
  class="w-full h-[600px] bg-gray-100"
  auto-rotate
  camera-controls
/>

## Açıklama:
w-full: Genişlik tam olsun

h-[600px]: Yüksekliği 600px yap

bg-white: Arka plan beyaz

Eğer karanlık temadayken de model alanı açık kalsın istiyorsan bg-white yerine bg-neutral-100 veya bg-gray-100 gibi bir şey de kullanabilirsin.

✨ Aşağıdaki kodda arkaplan rengi istenilen şekilde değiştirilebilir. 

<model-viewer
  src="/models/3b-model.glb"
  class="w-full h-[600px] bg-yellow-100 rounded-xl shadow-lg"
  auto-rotate
  camera-controls
/>

✨ Aşağıdaki kodda arkaplan rengi istenilen şekilde değiştirilebilir. (Burada shadow-lg kaldırıldı!)

<model-viewer
  src="/models/3b-farkli-renk.gltf"
  class="w-full h-[600px] bg-green-100 rounded-xl shadow-lg"
  auto-rotate
  camera-controls
/>


✅ Tailwind ile model-viewer arka planını beyaz yapma

<model-viewer
  src="/models/3b-farkli-renk.gltf"
  class="w-full h-[600px] bg-White-100"
  auto-rotate
  camera-controls
/>





