<template>
    <div class="row">
        <LEDStatus
        title="LED Light 1 Status"
        :led_num="1"
        :updatedTime="led1Time"
        v-on:off="listenToLED1off"
        v-on:on="listenToLED1on">
        </LEDStatus>

        <LEDStatus
        title="LED Light 2 Status"
        :led_num="2"
        :updatedTime="led2Time"
        v-on:off="listenToLED2off"
        v-on:on="listenToLED2on">
        </LEDStatus>

    <div class="col-xs-2 col-sm-4 ml-0 mr-0">
        <div class="card">
            <div class="card-top">
                <h3 class="float-left bold"><strong>Awning Status</strong></h3>
            </div>

            <div class="card-body p-0 pt-2 pb-2">
                <div class="row">
                    <div class="col-md-4">
                        <div class="item text-left">
                            <h5 class="m-1 pb-10"><small>Awning</small></h5>
                        </div>
                    </div>
                    <div class="col-md-5 pb-10 mb-4">
                        <button v-on:click="listenToAwningOpen">Open</button>
                        <button v-on:click="listenToAwningClose">Close</button>
                        <button v-on:click="listenToAwningStop">Stop</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import { UI_SOCKET_URL, PUSH_LED1_URL, PUSH_LED2_URL, PUSH_AWNING_URL } from '../../config';
import LEDStatus from './components/LEDStatus.vue';

import io from 'socket.io-client';
import axios from 'axios';

const socket = io(UI_SOCKET_URL);

export default {
    name: 'busshelter',
    props: ['requestType'],

    data: function() {
        return {
            led1Status: false,
            led2Status: false,
            awningStatus: "Closed",

            led1Time: "",
            led2Time: "",
            led3Time: ""
        }
    },

    methods: {
        getCurrentTime: function() {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;

            return dateTime
        },

        pushCharging: function(uri, data) {
            axios.post(uri, {"command": data}, {
                headers : {
                    'Access-Control-Allow-Oirigin': '*'
                } }).then(function (response) {
                    console.log("Response from server -> " + response);
                }).catch(function (error) {
                    console.log("Error from server -> " + error);
                });
        },

        listenToLED1on: function() {
            this.pushCharging(PUSH_LED1_URL, 'on');
        },

        listenToLED1off: function() {
            this.pushCharging(PUSH_LED1_URL, 'off');
        },

        listenToLED2on: function() {
            this.pushCharging(PUSH_LED2_URL, 'on');
        },

        listenToLED2off: function() {
            this.pushCharging(PUSH_LED2_URL, 'off');
        },

        listenToAwningOpen: function() {
            this.pushCharging(PUSH_AWNING_URL, 'open');
        },

        listenToAwningClose: function() {
            this.pushCharging(PUSH_AWNING_URL, 'close');
        },

        listenToAwningStop: function() {
            this.pushCharging(PUSH_AWNING_URL, 'stop');
        }
    },

    components: {
        LEDStatus
    }
}
</script>