import sys
import requests

host = '<om2m_server_address>'
port = '8080'

modbus_ipe_cnt_name = 'Modbus_IPE'
solar_ae_cnt_name = 'Solar_AE'

headers = {
    'X-M2M-Origin': '<om2m-id>:<om2m-passwd>',
    'Content-Type': '',
    'Cache-Control': 'no-cache',
}

def create_ae(api, rn):
    # create Modbus IPE AE
    headers['Content-Type'] = 'application/json;ty=2'
    data = {
        'm2m:ae': {
            'api': api,
            'rn': rn,
            'lbl': [],
            'rr': True
        }
    }
    res = requests.post(f'http://{host}:{port}/~/in-cse', json=data, headers=headers)
    print('[CREATE AE]', res.status_code)

    if res.status_code != 201:
        sys.exit('AE creation is failed.')

def create_fcnt(ae_name, fcnt_name, data):
    headers['Content-Type'] = 'application/json;ty=28'
    res = requests.post(f'http://{host}:{port}/~/in-cse/in-name/{ae_name}', json=data, headers=headers)
    print(f'[CREATE {fcnt_name} FLEXCONTAINER]', res.status_code)

    if res.status_code != 201:
        sys.exit(f'{fcnt_name} flexcontainer creation is failed.')

def create_sub(ae_name, fcnt_name, rn, nu):
    headers['Content-Type'] = 'application/json;ty=23'
    data = {
        'm2m:sub': {
            'rn': rn,
            'nu': [nu],
            'nct': 2
        }
    }
    res = requests.post(f'http://{host}:{port}/~/in-cse/in-name/{ae_name}/{fcnt_name}', json=data, headers=headers)
    print(f'[CREATE {fcnt_name} SUBSCRIPTION]', res.status_code)

    if res.status_code != 201:
        sys.exit(f'{fcnt_name} subscription creation is failed.')

def create_ipe_fcnt():
    fcnts = ['battery', 'energyGeneration', 'energyConsumption']

    for fcnt in fcnts:
        if fcnt == 'battery':
            data = {
                'm2m:fcnt': {
                    'cnd': fcnt,
                    'rn': fcnt,
                    'level': None,
                    'current': None,
                    'voltage': None,
                    'power': None,
                    'maxvolt': None,
                    'minvolt': None,
                    'temp': None,
                    'charging': None,
                    'discharging': None
                }
            }
        elif fcnt == 'energyGeneration':
            data = {
                'm2m:fcnt': {
                    'cnd': fcnt,
                    'rn': fcnt,
                    'power': None,
                    'current': None,
                    'voltage': None,
                    'daily': None,
                    'monthly': None,
                    'annual': None,
                    'total': None,
                    'maxvolt': None,
                    'minvolt': None
                }
            }
        elif fcnt == 'energyConsumption':
            data = {
                'm2m:fcnt': {
                    'cnd': fcnt,
                    'rn': fcnt,
                    'power': None,
                    'current': None,
                    'voltage': None,
                    'daily': None,
                    'monthly': None,
                    'annual': None,
                    'total': None
                }
            }

        create_fcnt(modbus_ipe_cnt_name, fcnt, data)

def create_solar_fcnt():
    fcnts = ['deviceInfo', 'userInfo']

    for fcnt in fcnts:
        if fcnt == 'deviceInfo':
            data = {
                'm2m:fcnt': {
                    'cnd': fcnt,
                    'rn': fcnt,
                    'name': None,
                    'lat': None,
                    'long': None,
                    'starttime': None,
                }
            }
        elif fcnt == 'userInfo':
            data = {
                'm2m:fcnt': {
                    'cnd': fcnt,
                    'rn': fcnt,
                    'adUrl': None,
                }
            }
        
        create_fcnt(solar_ae_cnt_name, fcnt, data)

def create_subs(wrapper_addr):
    create_sub(modbus_ipe_cnt_name, 'battery', 'read', f'http://{wrapper_addr}:19998/battery')
    # create_sub(modbus_ipe_cnt_name, 'battery', 'write', f'http://{wrapper_addr}:3001/write')
    create_sub(modbus_ipe_cnt_name, 'energyGeneration', 'solar', f'http://{wrapper_addr}:19998/solar')
    create_sub(modbus_ipe_cnt_name, 'energyConsumption', 'load', f'http://{wrapper_addr}:19998/load')

if __name__ == "__main__":
    # create Modbus_IPE AE, fcnts
    create_ae('modbus-ipe', modbus_ipe_cnt_name)
    create_ipe_fcnt()

    # create Solar AE, fcnts
    create_ae('solar-ae', solar_ae_cnt_name)
    create_solar_fcnt()

    print('\n[*] If you want create subscriptions, input wrapper ip address. (It requires \'solar wrapper\' is running.)')
    wrapper_addr = input('> ')
    create_subs(wrapper_addr)