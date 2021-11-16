export const slaveConfig = {
    port: "/dev/ttyXRUSB0",
    baudRate: 115200,
    parity: "none",
    dataBits: 8,
    stopBits: 1
};

export const cseUrl = 'http://<om2m_server_address>:8080';

export const fcntUrls = {
    battery: '/~/in-cse/<battery-fcnt>',
    energyGeneration: '/~/in-cse/<energyGeneration-fcnt>',
    energyConsumption: '/~/in-cse/<energyConsumption-fcnt>'
};