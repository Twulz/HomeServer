
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Adafruit_RGBLCDShield.h>
#include <Keypad_I2C.h>
#include <Keypad.h>
#include <Wire.h>
#include <ArduinoJson.h>

// Screen is at I2C address 0x20
// Keypad is at I2C address 0x21

// Setup Pins
//#define DONE_PIN        D5          // Done setup flag from RFID NodeMCU
//#define ACCESS_PIN      D6          // Access granted flag from FRID NodeMCU
#define RELAY_PIN       D5          // Pin to relay (solenoid)

// LOCK_SIGNAL states
#define OPEN_TAP       LOW
#define CLOSE_TAP      HIGH

// DONE states
//#define DONE            LOW
//#define NOT_DONE        HIGH

// Solenoid states
//#define LOCK            HIGH
//#define UNLOCK          LOW

// Define which source path to GET:
String resourceGet = "/garden_section/1";

// WiFi Setup
//String ipAddress = "192.168.1.14";
String ipAddress = "192.168.43.199";
String port = "3000";
// Initialise JSON parser
StaticJsonBuffer<1000> jsonBuffer;

// Screen Setup
//Adafruit_RGBLCDShield lcd = Adafruit_RGBLCDShield();
//#define WHITE 0x7       // For screen brightness

// Keypad Setup
/*#define KEY_ADDR 0x21   // Keypad I2C Address
#define CODE_LENGTH   8
const byte ROWS = 4; //four rows
const byte COLS = 4; //three columns
char keys[ROWS][COLS] = 
{
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
// Keypad pinout (to I2C interface)
byte rowPins[ROWS] = {3, 2, 1, 0};
byte colPins[COLS] = {7, 6, 5, 4};
Keypad_I2C kpd( makeKeymap(keys), rowPins, colPins, ROWS, COLS, KEY_ADDR, PCF8574 ); */

// Variable Setup
/* int RFID_signal = SIGNAL_LOCKED;
int readySignal = NOT_DONE;
bool enteringKeycode = false;
char keyCode[CODE_LENGTH];
int codeIndex = 0; */

void findWiFi();
void connectToWifi(char*, char*);
void sendHTTPPost(char*);

void setup() {
  // Set pins as input/output
  //pinMode(ACCESS_PIN, INPUT_PULLUP);
  //pinMode(DONE_PIN, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);

  // Initialise pins
  digitalWrite(RELAY_PIN, CLOSE_TAP);

  // Initialise keypad
  //kpd.begin( makeKeymap(keys) );
  
  // Setup serial output
  Serial.begin(115200);
  
  // Set up LCD:
  /* lcd.begin(16, 2);
  lcd.setBacklight(WHITE);
  lcd.print("Starting up...");
  Serial.println("Starting up..."); */

  // Set up WiFi
  // Set WiFi to station mode and disconnect from an AP if it was previously connected
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(2000);
  findWiFi();
  
  // Loop until the other NodeMCU is ready
  /* while(digitalRead(DONE_PIN) == NOT_DONE)
  {
    delay(200);
  } */

  /* lcd.clear();
  lcd.print("Ready!"); */
  Serial.print("Ready!");
}

void loop() {

  // Get any keypress or RFID input
  /* char key = kpd.getKey();
  RFID_signal = digitalRead(ACCESS_PIN); */

  if(WiFi.status() == WL_CONNECTED)
  {
  
    // Use any keypress or RFID input
    /* if (key){
      Serial.println(key);
      if (!enteringKeycode)
      {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Entering Code:");
        enteringKeycode = true;
        codeIndex = 0;
      }
      if (key == '*')
      {
        lcd.clear();
        lcd.print("Ready!");
        Serial.print("Ready!");
        memset(keyCode, 0, sizeof keyCode);
        enteringKeycode = false;
      }
      else if (key == '#')
      {
        lcd.setCursor(0, 0);
        lcd.print("SENDING CODE...");
        sendHTTPPost(keyCode);
        enteringKeycode = false;
        memset(keyCode, 0, sizeof keyCode);
        //delay(3000);
        lcd.clear();
        lcd.print("Ready!");
      }
      else if (codeIndex <= CODE_LENGTH)
      {
        lcd.setCursor(codeIndex, 1);
        lcd.print(key);
        keyCode[codeIndex] = key;
        codeIndex++;
      }
    }
    else if (RFID_signal == SIGNAL_UNLOCKED)
    {
      lcd.clear();
      lcd.setCursor(0,0);
      digitalWrite(LOCK_PIN, UNLOCK);
      lcd.print("Box is Open");
      Serial.println("Box is Open");
      delay(5000);
      lcd.clear();
      lcd.print("Ready!");
    }
    
    uint8_t buttons = lcd.readButtons();
  
    if (buttons) {
      lcd.clear();
      lcd.setCursor(0,0);
      if (buttons & BUTTON_UP) {
        lcd.print("UP ");
        digitalWrite(LOCK_PIN, HIGH);
      }
      if (buttons & BUTTON_DOWN) {
        lcd.print("DOWN ");
        digitalWrite(LOCK_PIN, LOW);
      }
      if (buttons & BUTTON_LEFT) {
        lcd.print("LEFT ");
      }
      if (buttons & BUTTON_RIGHT) {
        lcd.print("RIGHT ");
      }
      if (buttons & BUTTON_SELECT) {
        lcd.print("SELECT ");      
      }
    } */
    sendHTTPGet();
  }
  else
  {
    /* lcd.clear();
    lcd.print("Reconnecting..."); 
    findWiFi();
    lcd.clear();
    lcd.print("Ready!"); */
    Serial.println("Reconnecting...");
    findWiFi();
    Serial.println("Ready!");
  }
}

/*
 * Finds one of the WiFi networks defined within this function and connects to it.
 */
void findWiFi() {

  // Variables
  char* ssid;
  char* password;
  
  Serial.println("scan start");
  int n = WiFi.scanNetworks();
  if (n == 0)
    Serial.println("no networks found");
  else
  {
    for (int i = 0; i < n; ++i)
    {
      if (WiFi.SSID(i).equals("Aperture_Science"))
      {
        Serial.println("Found Aperture_Science");
        ssid = "Aperture_Science";
        password = "PraiseTheSun";
        connectToWifi(ssid, password);
      }
      else if (WiFi.SSID(i).equals("TwulzPhone"))
      {
        Serial.println("Found TwulzPhone");
        ssid = "TwulzPhone";
        password = "waterwater";
        connectToWifi(ssid, password);
      }
    }
  }
}

/*
 * Connects to the wifi given by the arguments.
 */
void connectToWifi(char* ssid, char* password) {
  WiFi.begin(ssid, password);             // Connect to the network
  Serial.print("Connecting to ");
  Serial.print(ssid); Serial.println(" ...");

  int i = 0;
  while (WiFi.status() != WL_CONNECTED) { // Wait for the Wi-Fi to connect
    delay(1000);
    Serial.print(++i); Serial.print(' ');
  }

  Serial.println('\n');
  Serial.println("Connection established!");  
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer
  //digitalWrite(DONE_PIN, DONE);                  // Tell the other NodeMCU this is ready.
}

/*
 * Sends the accessCode to the server via JSON message and turns on the appropriate
 * LED depending on the response.
*/
void sendHTTPPost(char* code)
{
    HTTPClient http;
    String payload;
    int httpCode;

    // POST sample:
    Serial.println("POST:");
    http.begin("http://" + ipAddress + ":" + port + "/packageCode/");
    http.addHeader("Content-Type", "application/json");
    String postReq = (String)"{\"keyCode\": \"" + code + (String)"\"}";
    Serial.println(postReq);
    httpCode = http.POST(postReq);
    payload = http.getString();
    Serial.println("httpCode:");
    Serial.println(httpCode);
    Serial.println("payload:");
    Serial.println(payload);
    JsonObject& root = jsonBuffer.parseObject(payload);
    if (!root.success()) 
    {
      Serial.println("parseObject() failed");
    }
    else
    {
      String response = root["response"];
      Serial.println(response);
      if(response.equals("Access Granted"))
      {
        /*lcd.clear();
        lcd.setCursor(0,0);
        digitalWrite(LOCK_PIN, UNLOCK);
        lcd.print("Box is Open");
        Serial.println("Box is Open");
        delay(5000);
        lcd.clear();
        lcd.print("Ready!"); */
      }
      else
      {
        /* lcd.clear();
        lcd.print("Keycode Invalid");
        delay(5000); */
      }
    }
    http.end();
}

// Send the HTTP GET request to the server
bool sendHTTPGet() {
  //Variables for request
  HTTPClient http;
  String payload;
  int httpCode;
  
  //Format and send request
  Serial.print("GET ");
  Serial.println(resourceGet);
  http.begin("http://" + ipAddress + ":" + port + resourceGet);
  http.addHeader("Content-Type", "application/json");
  httpCode = http.GET();
  
  //Get response
  payload = http.getString();
  http.end();
  
  //Send response to parser
  Serial.println(payload);
  readResponseContent(payload);

  delay(1000);
  
  return true;
}

bool readResponseContent(String payload) {
  //Create json buffer
  const size_t bufferSize = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(1) + 
    2*JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(4) + JSON_OBJECT_SIZE(5) + 
    JSON_OBJECT_SIZE(6) + JSON_OBJECT_SIZE(12) + 390;
  DynamicJsonBuffer jsonBuffer(bufferSize);
  
  //Create json object and parse message
  JsonObject& root = jsonBuffer.parseObject(payload);
  if (!root.success()) {
    Serial.println("JSON parsing failed!");
    return false;
  }
  
  //Store valve state locally
  int relay = root["response"][0]["valve_state"];
  
  //Turn heater and cooler on or off
  if (relay == 1)
  {
    Serial.println("Relay is open");
    digitalWrite(RELAY_PIN, OPEN_TAP);
    }
  else
  {
    Serial.println("Relay is closed");
    digitalWrite(RELAY_PIN, CLOSE_TAP);
  }
   
  return true;
}

