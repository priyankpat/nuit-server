#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const uint16_t port = 3000;
const char *host = "192.168.2.12";
WiFiClient client;
HTTPClient http;

int sensor = 13; // pin -> 7

// Fingerprint will expire and might need to be updated before running this sketch.
#define FINGERPRINT "FE 48 BD 27 57 4A 79 B5 12 07 31 97 05 25 DC 4A A0 AF 32 CA"

String serverName = "http://192.168.2.12:3000/update-sensor";

unsigned long StartTime = millis();
unsigned long CurrentTime;

void sendSignal() {
  // Your Domain name with URL path or IP address with path
  http.begin(client, serverName.c_str());

  // Send HTTP GET request
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();
}

void setup()
{
  Serial.begin(115200);
  pinMode(sensor, INPUT); // declare sensor as input

  Serial.println("Connecting...\n");
  WiFi.mode(WIFI_STA);
  WiFi.begin("The Trap", "j6HD@XheZ+9Psk5#"); // change it to your ussid and password
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  delay(60000);
}

void loop()
{
  Serial.println("Reading Sensor...");
  Serial.print("Sensor state: ");

  long state = digitalRead(sensor);
  Serial.print(state);
  Serial.print("\nTime difference: ");

  CurrentTime = millis();

  long diff = (((CurrentTime - StartTime) + 500) / 1000);
  Serial.print(diff);
  Serial.print("s\n");

  if (state == HIGH) {
    StartTime = millis();

    if (diff > 3 && diff < 7) {
      sendSignal();

      StartTime = millis();
    }
  }

  delay(1000);
}
