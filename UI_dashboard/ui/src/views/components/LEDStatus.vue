<template>
    <div class="col-xs-2 col-sm-4 ml-0 mr-0">
        <div class="card">
            <div class="card-top">
                <h3 class="float-left bold"><strong>{{ title }}</strong></h3>
            </div>

            <div class="card-body p-0 pt-2 pb-2">
                <div class="row">
                    <div class="col-sm-2">
                        <div>
                            <img src="src/images/lightbulb.png" alt="" heigth="25" width="25" class="float-right">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="item text-left">
                            <h5 class="m-1 pb-10"><small>{{ title }}</small></h5>
                        </div>
                    </div>
                    <div class="col-md-5 pb-10 mb-4">
                        <h5 class="m-1 pb-10"><small><switchbutton v-model="switch2"></switchbutton></small></h5>
                    </div>
                </div>
                <div class="row mb-0">
                    <div class="col-md-10">
                        <div class="item text-center mb-0">
                            <span class="badge badge-dark ml-5">Last Updated : {{ updatedTime }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import switchbutton from '../dashboard/dashboardcomponent/switch-button.vue';

export default {
    name: 'led',
    props: ['title', 'updatedTime', 'on', 'off', 'led_num'],
    methods: {
        getCurrentTime: function() {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;

            return dateTime
        }
    },

    watch: {
        switch1: function(value) {
            this.updatedTime = this.getCurrentTime();

            if(value) {
                console.log("LED Light off");
                this.$emit("off");
            }
        },

        switch2: function(value) {
            this.updatedTime = this.getCurrentTime();
            
            if(value) {
                console.log("LED Light on");
                this.$emit("on");
            }
            else {
                console.log("LED Light off");
                this.$emit("off");
            }
        }
    },

    data: function() {
        return {
            switch1: false,
            switch2: false
        };
    },

    components: {
        switchbutton
    }
}
</script>