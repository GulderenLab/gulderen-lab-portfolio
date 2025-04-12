---
title: 'Kablosuz Hava Kalitesi İzleme Sistemi'
description: 'ESP8266 ve BME680 sensörü kullanarak ortamdaki hava kalitesini izleyen, verileri MQTT üzerinden yayınlayan bir sistem.'
publishDate: 2023-11-12
tags: ['ESP8266', 'MQTT', 'Sensör', 'Grafana', 'IoT']
image:
  src: '/images/proje2-kapak.jpeg'
  alt: 'Kablosuz Hava Kalitesi Sistemi'
isDraft: false
---

## Proje Özeti

Bu projede, iç ortamlardaki hava kalitesini (sıcaklık, nem, basınç ve gaz değeri) izlemek amacıyla ESP8266 mikrodenetleyicisi ve Bosch BME680 sensörü kullanılmıştır. Sensör verileri MQTT üzerinden bir broker’a gönderilmekte ve bu veriler Grafana paneli ile görselleştirilmektedir.

## Kullanılan Teknolojiler

*   **Donanım:** ESP8266 NodeMCU, BME680 Sensör Modülü
*   **Yazılım (ESP8266):** Arduino IDE (C++)
*   **Broker:** Mosquitto MQTT
*   **Veri Görselleştirme:** InfluxDB + Grafana
*   **Ağ:** 2.4 GHz Wi-Fi bağlantısı

## Detaylar ve Kod Örnekleri

ESP8266, belirli aralıklarla BME680 sensöründen veri toplar ve bu verileri MQTT üzerinden yayınlar. Her sensör değeri ayrı bir konuya (`topic`) gönderilir.

```cpp
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_BME680.h>

WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_BME680 bme;

void setup() {
  WiFi.begin("SSID", "password");
  client.setServer("mqtt.broker.ip", 1883);

  bme.begin();
}

void loop() {
  if (!client.connected()) {
    // MQTT bağlantısı kur
  }
  bme.performReading();

  float temp = bme.temperature;
  float hum = bme.humidity;
  float gas = bme.gas_resistance / 1000.0;

  client.publish("ev/hava_sicaklik", String(temp).c_str());
  client.publish("ev/hava_nem", String(hum).c_str());
  client.publish("ev/hava_gaz", String(gas).c_str());

  delay(60000); // 1 dakikada bir veri gönder
}
