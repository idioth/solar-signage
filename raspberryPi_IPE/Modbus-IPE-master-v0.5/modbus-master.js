import {Coil, DiscreteInput, HoldingRegister, InputRegister} from './register'
import {monitoringRegisters, writeRegisters} from './registers-list'

global.tcnt_t = 0;
global.SOC = 0;

export function monitor(slave, interval, callback) {
    setInterval(() => readRegisters(slave, callback), interval)
}

async function calculateSOC(ChargingCurrent, OpenCircuitVoltage, interval) {
    const T_samp = 100 / Math.exp(1) - 6;
    const BatteryCapacity = 288000;

    const today = new Date();

    if(tcnt_t >= T_samp) {
        try {
            if(today.getHours() == 0 && today.getMinutes() == 0 && today.getSeconds < 6) {
                var intergralCurrent = 0;
            }
            intergralCurrent += ChargingCurrent * T_samp;
            SOC += intergralCurrent / BatteryCapacity;

            tcnt_t -= T_samp;
        } catch(e) {
            // console.log(e);
        }
    }

    return SOC;
}
function readRegisters(slave, callback){
    let regs = {
        battery: [],
        energyGeneration: [],
        energyConsumption: []
    };
    let readValues = {
        battery: {},
        energyGeneration: {},
        energyConsumption: {}
    };

    for (let module in monitoringRegisters){
        for (let dataPoint in monitoringRegisters[module]){
            regs[module].push(createRegisterObject(dataPoint, slave, monitoringRegisters[module][dataPoint]));
        }
    }
    (async () => {
        for (let module in regs)
            for (let reg of regs[module]){
                try{
                    const {data} = await reg.read();
                    //console.log(module + ' ' + reg.getName() + ': ' + data);
                    readValues[module][reg.getName()] = (reg.scale == null) ? data[0] : data[0]/reg.scale //TODO considers only 1st register

                    if(module == "battery") {
                        readValues[module][level] = await calculateSOC(readValues[module][current], readValues[module][voltage], interval);
                    }
                } catch (e) {
                    // console.log(e);
                }
            }
        return callback(readValues);
    })();
}

function createRegisterObject(name, slave, {type, address, length, scale}) {
    switch (type) {
        case 1:
            return new DiscreteInput(name, slave, address, length);
        case 2:
            return new Coil(name, slave, address, length);
        case 3:
            return new InputRegister(name, slave, address, length, scale);
        case 4:
            return new HoldingRegister(name, slave, address, length, scale);
        default:
            throw new Error('Not valid register type')
    }
}

export async function writeCharging(slave, value) {
    const reg = createRegisterObject('charging', slave, writeRegisters.charging);
    try {
        return await reg.write(value);
    } catch (e) {
        console.log(e);
    }
}

export async function writeDischarging(slave, value) {
    const reg = createRegisterObject('discharging', slave, writeRegisters.discharging);

    try {
        return await reg.write(value);
    } catch (e) {
        console.log(e);
    }
}
