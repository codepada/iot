input.onButtonPressed(Button.A, function () {
    MQTT.connect()
})
input.onButtonPressed(Button.B, function () {
    MQTT.b2MQTT("Temp : " + input.temperature())
})
let irsensor = 0
MQTT.initializeUART(SerialPin.P1, SerialPin.P2)
MQTT.setConnectionInfo("microbit-control", "InwO", "11222222")
MQTT.connect()
basic.forever(function () {
    irsensor = 0
    if (irsensor == 1) {
        MQTT.b2MQTT("Find Object")
    }
})
