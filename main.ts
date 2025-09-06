input.onButtonPressed(Button.A, function () {
    MQTT.connect()
})
input.onButtonPressed(Button.B, function () {
    MQTT.b2MQTT("Temp : " + input.temperature())
    MQTT.b2MQTT("light : " + input.lightLevel())
})
MQTT.onEsp32DataReceived(function (data) {
    if (data == "ok") {
        basic.showIcon(IconNames.Heart)
        basic.pause(500)
        basic.clearScreen()
    }
    MQTT.setPinIfMatch(MQTT.PinChannel.P0, data)
})
let irsensor = 0
MQTT.initializeUART(SerialPin.P1, SerialPin.P2)
MQTT.setConnectionInfo("microbit-control", "InwO", "11222222")
MQTT.connect()
basic.forever(function () {
    irsensor = pins.digitalReadPin(DigitalPin.P14)
    if (irsensor == 1) {
        MQTT.b2MQTT("find object")
        basic.pause(200)
    }
    basic.pause(10)
})
