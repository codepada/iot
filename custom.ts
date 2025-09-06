


//% color="#AA278D" weight=100
namespace MQTT {

    let uniqueId_var = "";
    let ssid_var = "";
    let password_var = "";
    let mqttBroker_var = "broker.hivemq.com";
    let mqttPort_var = "1883";
    let onReceivedHandler: (data: string) => void;

    //% block="set connection info uniqueId %uniqueId|SSID %ssid|Password %password"
    //% uniqueId.defl="microbit-control"
    //% ssid.defl="InwO"
    //% password.defl="11222222"
    export function setConnectionInfo(uniqueId: string, ssid: string, password: string): void {
        uniqueId_var = uniqueId;
        ssid_var = ssid;
        password_var = password;
    }

    //% block="initialize UART Tx pin %tx|Rx pin %rx"
    //% tx.defl=SerialPin.P1
    //% rx.defl=SerialPin.P2
    export function initializeUART(tx: SerialPin, rx: SerialPin): void {
        // Initialize UART with the provided pins
        serial.redirect(
            tx,
            rx,
            BaudRate.BaudRate115200
        );
        basic.pause(100); // Small pause for serial to be ready
    }

    //% block="connect"
    export function connect(): void {
        basic.pause(4000)
        let config_data = "CONFIG_DATA:" + uniqueId_var + "," + ssid_var + "," + password_var + "," + mqttBroker_var + "," + mqttPort_var;
        serial.writeLine(config_data);
        basic.showString("Config Sent!");
    }

    //% block="on MQTT data received"
    //% draggableParameters
    export function onEsp32DataReceived(handler: (data: string) => void): void {
        onReceivedHandler = handler;
        serial.onDataReceived('\n', function () {
            let receivedData = serial.readLine();
            let processedData = receivedData.trim();
            if (onReceivedHandler) {
                onReceivedHandler(processedData);
                if (processedData === "WIFI_CONNECTED") {
                    basic.showIcon(IconNames.Yes)
                    basic.showString("WIFI-OK");
                }

            }
        });
    }


    //% block="sent data %data"
    //% data.shadowOptions.toString=true
    export function b2MQTT(data: string): void {
        
        let status_json = '{"deviceId": "' + uniqueId_var + '", "data":"' + data + '"}';
        serial.writeLine(status_json + "\n");
        

    }

    // --- ส่วนโค้ดสำหรับบล็อกที่มีเมนูให้เลือก (Dropdown) ---
    export enum PinChannel {
        //% block="P0"
        P0,
        //% block="P1"
        P1,
        //% block="P2"
        P2,
        //% block="P8"
        P8,
        //% block="P12"
        P12,
        //% block="P13"
        P13,
        //% block="P14"
        P14,
        //% block="P15"
        P15,
        //% block="P16"
        P16,
    }

    let PinChannels: { [key: number]: DigitalPin } = {
        [PinChannel.P0]: DigitalPin.P0,
        [PinChannel.P1]: DigitalPin.P1,
        [PinChannel.P2]: DigitalPin.P2,
        [PinChannel.P8]: DigitalPin.P8,
        [PinChannel.P12]: DigitalPin.P12,
        [PinChannel.P13]: DigitalPin.P13,
        [PinChannel.P14]: DigitalPin.P14,
        [PinChannel.P15]: DigitalPin.P15,
        [PinChannel.P16]: DigitalPin.P16,
    }



    //% block="Pin Control %pin| with %data"
    //% pin.fieldEditor="gridpicker"
    //% pin.fieldOptions.columns=3

    export function setPinIfMatch(pin: PinChannel, data: string): void {
        const parts = data.split("=");
        if (parts.length === 2) {
            const pinName = parts[0];
            const value = parseInt(parts[1], 10);

            let selectedPinName: string;
            switch (pin) {
                case PinChannel.P0: selectedPinName = "P0"; break;
                case PinChannel.P1: selectedPinName = "P1"; break;
                case PinChannel.P2: selectedPinName = "P2"; break;
                case PinChannel.P8: selectedPinName = "P8"; break;
                case PinChannel.P12: selectedPinName = "P12"; break;
                case PinChannel.P13: selectedPinName = "P13"; break;
                case PinChannel.P14: selectedPinName = "P14"; break;
                case PinChannel.P15: selectedPinName = "P15"; break;
                case PinChannel.P16: selectedPinName = "P16"; break;
            }

            if (pinName === selectedPinName) {
                pins.digitalWritePin(PinChannels[pin], value);

                // สร้างและส่งข้อความ JSON กลับไป
                let status_json = '{"deviceId": "' + uniqueId_var + '", "pins": {"' + selectedPinName + '": ' + value + '}}';
                serial.writeLine(status_json + "\n");
            }
        }
    }
}
