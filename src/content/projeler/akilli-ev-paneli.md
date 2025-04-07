---
title: 'Akıllı Ev Sistemi Kontrol Paneli'
description: 'ESP32 tabanlı, MQTT ile haberleşen bir akıllı ev kontrol paneli arayüzü.'
publishDate: 2023-10-26 # YYYY-MM-DD formatında
tags: ['ESP32', 'MQTT', 'React', 'Node.js', 'Elektronik']
image:
  src: '/images/proje1-kapak.jpeg' # Public klasöründeki resim
  alt: 'Akıllı Ev Kontrol Paneli Projesi'
isDraft: false
---

## Proje Özeti

Bu projede, ESP32 mikrodenetleyici kullanarak evdeki çeşitli cihazları (ışıklar, prizler vb.) kontrol edebilen ve sensör verilerini (sıcaklık, nem) okuyabilen bir sistem geliştirildi. Haberleşme için MQTT protokolü kullanıldı ve verilerin görselleştirildiği/kontrol edildiği bir React tabanlı web arayüzü oluşturuldu.

## Kullanılan Teknolojiler

*   **Donanım:** ESP32 Geliştirme Kartı, Röle Modülleri, DHT11 Sensörü
*   **Yazılım (ESP32):** Arduino IDE (C++) / ESP-IDF
*   **Broker:** Mosquitto MQTT Broker
*   **Backend (Opsiyonel):** Node.js (Veri kaydı veya ek işlevler için)
*   **Frontend:** React, Material UI

## Detaylar ve Kod Örnekleri

ESP32 üzerindeki kod, WiFi ağına bağlanarak MQTT broker'a abone olur ve belirli konulara mesajlar yayınlar...

```cpp
// Örnek ESP32 Kodu
#include <WiFi.h>
#include <PubSubClient.h>

// ... WiFi ve MQTT ayarları ...

void callback(char* topic, byte* payload, unsigned int length) {
  // Gelen mesajları işle
}

void setup() {
  // WiFi ve MQTT bağlantısını kur
}

void loop() {
  // Sensör verilerini oku ve MQTT'ye gönder
  // Gelen komutları dinle
  client.loop();
}