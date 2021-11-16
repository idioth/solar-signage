 <template>
    <div class="col-lg-4 col-md-6">
        <div class="card">
            <div class="card-top">
                <img src="src/images/temp.jpg" alt="" height="50" width="50" class="float-right">
                <h3 class="float-left bold"> <strong>{{title}}</strong> </h3>
              
                            
            </div>
             <div class="card-body p-0 pt-0 pb-0">       

                 <BatteryChartTemp :percentageValue="percentage" />

                <div class="row mb-0">
                        <div class="col-md-12">
                            <div class="item text-center mb-2">
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
    import BatteryChartTemp from './subcharts/batteryChartTemp.vue';
    import axios from 'axios';
    import Vue from 'vue';
    import { Donut, Gauge } from 'gaugeJS';

    export default{
        components:{
           BatteryChartTemp
        },

        props: ['temperature', 'title', 'updatedTime'],

        created(){
            this.percentageSendingValue = "0"

        },

        data(){
             return{
                currentAmount: "0", maxAmount : "0", percentageValue: "0"
                //gaugeObj : new Donut()

             }
        },
         methods: {

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
                            colorStop: '#784a96', 
                            strokeColor: '#e6e9ec',
                            generateGradient: true
                    };

                        var target = document.getElementById("battery-chart-temp");
                        var gauge = new Donut(target).setOptions(opts);
                        gauge.maxValue = 100;
                        gauge.animationSpeed = 40;
                        gauge.set(this.percentage);
          
                        gauge.setTextField(document.getElementById("battery-gauge-value-temp"));
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
                            colorStop: '#784a96', 
                            strokeColor: '#e6e9ec',
                            generateGradient: true
                    };

                        var target = document.getElementById("battery-chart-temp");
                        var gauge = new Donut(target).setOptions(opts);
                        gauge.maxValue = 100;
                        gauge.animationSpeed = 40;
                        gauge.set(this.percentage);
          
                        gauge.setTextField(document.getElementById("battery-gauge-value-temp"));
                        this.gaugeObj = gauge

                }

        },

        computed: {
                percentage() {
                    this.percentageSendingValue = this.temperature;
                    console.log("[get percentage]  this.percentageSendingValue=",  this.percentageSendingValue);
                    return this.percentageSendingValue
                }
        },

        mounted() {
        
        }

        
       
    }
</script>

<style scoped>
    .battery-chart-temp{
        height: 225px;
    }
    canvas{
        min-width: inherit;
    }

    #battery-chart-temp{
        margin-left: 30%;
        margin-top: 2%;
    }
    
    #battery-gauge-value-temp {
        color: #000 !important;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        text-anchor: middle;
        font-family: Arial;
        font-size: 29px;
        font-weight: bold;
        fill-opacity: 1;
        position: absolute;
        left: 45%;
        top: 30%;
    }
    
    #battery-gauge-value-temp:after{
    content: "%";
     }
</style>