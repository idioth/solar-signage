 <template>
    <div class="col-lg-4 col-md-6">
        <div class="card">
            <div class="card-top">
                         <img src="src/images/batteryCharging.png" alt="" height="50" width="50" class="float-right">
                        <h3 class="float-left bold"> <strong>Battery Level</strong> </h3>
              
                            
            </div>
             <div class="card-body p-0 pt-0 pb-0">       
                <!-- <h6 class="text-center"><Strong>0.000</Strong> <span class="badge badge-info"> kWh </span></h6> -->
                 <BatteryChart :percentageValue="percentage" />

                <div class="row mb-0">
                        <div class="col-md-12">
                            <div class="item text-center mb-2">
                                 <!-- <h6 class="ml-5"><small>Last Updated : </small></span></h6> -->
                                  <span class="badge badge-dark ml-5">Last Updated : {{updatedTime}}</span>
                            </div>
                        </div>
                  </div>

            </div>
      
            </div>
        </div>
    </div>
</template>

<script>
    import BatteryChart from './subcharts/batteryChart.vue';
    import axios from 'axios';
    import Vue from 'vue';
    import { Donut, Gauge } from 'gaugeJS';

    export default{
        components:{
           BatteryChart
        },

        props: ['level', 'updatedTime'],

        created(){
            //await this.pullCurrentAmount()
            //await this.pullMaxAmount()
            //await this.initializeTheChart()
            this.percentageSendingValue = "0"

        },

        data(){
             return{
                currentAmount: "0", maxAmount : "0", percentageValue: "0"
                //gaugeObj : new Donut()

             }
        },
         methods: {
                /*
                pullCurrentAmount: function () {
        
                    var urlWrapper ="http://127.0.0.1:19998/battery/currentAmount"
       
                    axios.get(urlWrapper)
                        .then(({data}) => {
                        this.currentAmount = data.finalResult
                        console.log("[Battery Level][Current Amount] ", this.currentAmount)
                    })
                    .catch(error => {
                        console.log(error.response)
                    }) 
                },
                8
                pullMaxAmount: function () {
        
                    var urlWrapper ="http://127.0.0.1:19998/battery/maxAmount"
       
                    axios.get(urlWrapper)
                        .then(({data}) => {
                        this.maxAmount = data.finalResult
                        console.log("[Battery Level][Max Amount] ", this.maxAmount)
                    })
                    .catch(error => {
                        console.log(error.response)
                    }) 
                },*/

                calculatePercentage: function(){
                    this.percentageSendingValue = (this.currentAmount / this.maxAmount) * 100
                    
                },

                initializeTheChart: function(){
                    
                    //console.log("[Battery Level][initializeChart] percentage value =  ", this.percentage)

                     var opts = {
                            lines: 14,
                            angle: 0.5,
                            lineWidth: 0.1,
                            limitMax: 'false', 
                            percentColors: [[0.0, "#cccccc" ], [0.50, "#ffff00"], [1.0, "#ff0000"]],
                            strokeColor: '#ffa726',
                            generateGradient: true,
                            highDpiSupport: true,


                            colorStart: '#cdcdcd',
                            colorStop: '#D65DB1', 
                            strokeColor: '#e6e9ec',
                            generateGradient: true
                    };

                        var target = document.getElementById("battery-chart");
                        var gauge = new Donut(target).setOptions(opts);
                        gauge.maxValue = 100;
                        gauge.animationSpeed = 40;
                        gauge.set(this.percentage);
          
                        gauge.setTextField(document.getElementById("battery-gauge-value"));
                        this.gaugeObj = gauge
                },

                getTheChart: function(){
                    
                    var opts = {
                            lines: 14,
                            angle: 0.5,
                            lineWidth: 0.1,
                            limitMax: 'false', 
                            percentColors: [[0.0, "#cccccc" ], [0.50, "#ffff00"], [1.0, "#ff0000"]],
                            strokeColor: '#ffa726',
                            generateGradient: true,
                            highDpiSupport: true,


                            colorStart: '#cdcdcd',
                            colorStop: '#D65DB1', 
                            strokeColor: '#e6e9ec',
                            generateGradient: true
                    };

                        var target = document.getElementById("battery-chart");
                        var gauge = new Donut(target).setOptions(opts);
                        gauge.maxValue = 100;
                        gauge.animationSpeed = 40;
                        gauge.set(this.percentage);
          
                        gauge.setTextField(document.getElementById("battery-gauge-value"));
                        this.gaugeObj = gauge

                }

        },

        computed: {
                percentage() {
                    //return this.percentageValue
                    //this.percentageSendingValue = (this.currentAmount / this.maxAmount) * 100
                    this.percentageSendingValue = this.level;
                    console.log("[get percentage]  this.percentageSendingValue=",  this.percentageSendingValue);
                    return this.percentageSendingValue
                }
        },

        async mounted() {
        //mounted() {    
            //this.initializeTheChart()
            
            //await this.pullCurrentAmount()
            //await this.pullMaxAmount()
            //await this.getTheChart()

            //await this.calculatePercentage()

            
            //console.log("[BatteryLevel][currentAmount] = ",this.currentAmount, "|| [maxAmount] = ", this.maxAmount, " || [percentageValue] = ", this.percentageValue)
            //this.percentageValue = (this.currentAmount / this.maxAmount) * 100
            //console.log("[BatteryLevel][currentAmount] = ",this.currentAmount, "|| [maxAmount] = ", this.maxAmount, " || [percentageValue] = ", percentage())
            //this.calculatePercentage()
            //this.dataReady = true
        }

        
       
    }
</script>

<style scoped>
    .battery-chart{
        height: 225px;
    }
    canvas{
        min-width: inherit;
    }

    #battery-chart{
        margin-left: 30%;
        margin-top: 2%;
    }
    
    #battery-gauge-value {
        color: #000 !important;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        text-anchor: middle;
        font-family: Arial;
        font-size: 29px;
        font-weight: bold;
        fill-opacity: 1;
        position: absolute;
        left: 45%;
        top: 38%;
    }
    
    #battery-gauge-value:after{
    content: "%";
     }
</style>