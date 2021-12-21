# Solar Signage

README last updated: 2021-12-15 (KST)

Detailed docs is being prepared...



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

// If you don't use bus shelter, comment this block
var om2mServer_LED1 = om2mServer + "/~/in-cse/<led1-cnt>";
var om2mServer_LED2 = om2mServer + "/~/in-cse/<led2-cnt>";
var om2mServer_AWNING = om2mServer + "/~/in-cse/<awning-cnt>";

var default_AD_URL = "https://www.youtube.com/embed/xLD8oWRmlAE";
```

`default_AD_URL` : default value when can't get user ad value.

- `UI_dashboard/ui/config.js`

```javascript
export const UI_SOCKET_URL = "http://<web-server-ip>:19997";

export const WRAPPER_URL = "http://<web-server-ip>:19998"

export const PUSH_CHARGING_URL = WRAPPER_URL + "/charging";
export const PUSH_DISCHARGING_URL = WRAPPER_URL + "/discharging";

// If you don't use bus shelter, comment this block
export const PUSH_LED1_URL = WRAPPER_URL + "/led1";
export const PUSH_LED2_URL = WRAPPER_URL + "/led2";
export const PUSH_AWNING_URL = WRAPPER_URL + "/awning";

export const STARTTIME_WRAPPER_URL = WRAPPER_URL + "/starttime";

export const GPS_WRAPPER_URL = WRAPPER_URL + "/gps";

export const AD_WRAPPER_URL = WRAPPER_URL + "/ad";
```



# OM2M Instance

- `OM2M/init_ipe.py`

```python
host = '<om2m_server_address>'
port = '8080'

modbus_ipe_cnt_name = 'Modbus_IPE'
solar_ae_cnt_name = 'Solar_AE'

headers = {
    'X-M2M-Origin': '<om2m-id>:<om2m-passwd>',
    'Content-Type': '',
    'Cache-Control': 'no-cache',
}
```

If you want to change Modbus_IPE and Solar_AE container name, modify that variables.

- `OM2M/init_bus.py`

If you don't use bus shelter, you shouldn't make bus shelter's instances.

```python
bus_addr = '<bus_shelter_address>'

host = '<om2m_server_address>'
port = '8080'

ae_name = 'bus_shelter'
headers = {
    'X-M2M-Origin': '<om2m-id>:<om2m-passwd>',
    'Content-Type': '',
    'Cache-Control': 'no-cache',
}
```

