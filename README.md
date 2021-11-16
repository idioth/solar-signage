# Solar Signage

## Requirements

- OM2M
- Node.js
- Java
- 2 raspberry pi 3 B+ or 1~2 server (om2m, ui_dashboard), 1 raspberry pi



## Configuration

### Raspberry Pi 1 (Modbus IPE)

- `raspberryPi_IPE/Modbus-IPE-master-v0.5/config.js`

```javascript
export const cseUrl = 'http://<om2m_server_address>:8080';

export const fcntUrls = {
    battery: '/~/in-cse/<battery-fcnt>',
    energyGeneration: '/~/in-cse/<energyGeneration-fcnt>',
    energyConsumption: '/~/in-cse/<energyConsumption-fcnt>'
};
```

- `raspberryPi_IPE/Solar-AE/gpsd-client.js`

```javascript
const GPS_URL = 'http://<om2m_server_address>:8080/~/in-cse/<deviceinfo-fcnt>';
```

### Raspberry Pi 2 (UI_dashboard)

- `UI_dashboard/wrapper/server_express.js`

```javascript
var om2mServer = "http://<om2m_server_address>:8080";

var om2mServer_BATTERY = om2mServer + "/~/in-cse/<battery-fcnt>";
var om2mServer_GPS = om2mServer + "/~/in-cse/<deviceinfo-fcnt>";
var om2mServer_AD = om2mServer + "/~/in-cse/<userinfo-fcnt>";

var default_AD_URL = "https://www.youtube.com/embed/xLD8oWRmlAE";
```

`default_AD_URL` : default value when can't get user ad value.

- `UI_dashboard/ui/config.js`

```javascript
//export const UI_SOCKET_URL = "http://192.168.0.202:19997";
export const UI_SOCKET_URL = "http://<web-server-ip>:19997";

//export const WRAPPER_URL = "http://192.168.0.202:19998";
export const WRAPPER_URL = "http://<web-server-ip>:19998"

export const PUSH_CHARGING_URL = WRAPPER_URL + "/charging";
export const PUSH_DISCHARGING_URL = WRAPPER_URL + "/discharging";

export const STARTTIME_WRAPPER_URL = WRAPPER_URL + "/starttime";

export const GPS_WRAPPER_URL = WRAPPER_URL + "/gps";

export const AD_WRAPPER_URL = WRAPPER_URL + "/ad";
```

