 <template>
    <div class="col-lg-4 col-md-6">
        <div class="card">
            <div class="card-top">
                <img src="src/images/clock.png" alt="" height="50" width="50" class="float-right">
                <h3 class="float-left bold"> <strong>{{title}} </strong></h3>
              
                            
            </div>
             <div class="card-body p-0 pt-5 pb-4" style = "height:100px"> 
                 <div><h1 class="text-center"><span class="badge badge-secondary">{{hour}}</span> hour <span class="badge badge-info">{{minute}}</span> minutes </h1> </div>  
                 
            </div>
            
        </div>
    </div>
</template>

<script>
    //import DownloadChart from './charts/DownloadChart.vue';
    import {STARTTIME_WRAPPER_URL} from './../../../../config.js'

    const axios = require('axios');

    export default{
        name: 'operationalTime',

        props: ['title', 'time'],

        components:{

        },

        data(){
             return{
                starttime: "0", hourValue : "0", minuteValue : "0", updateInterval : 10000,
             }
        },
        
        created(){
            console.log("operaitionl time")
        },

        methods: {
            getStartTime : function () { 
        
                var urlWrapper = STARTTIME_WRAPPER_URL
                console.log("[getStartTime]")
            
                axios.get(urlWrapper)
                    .then(({data}) => {
                    console.log("[getStartTime] data =", data)
                    this.starttime = data
                })
                .catch(error => {
                    // default url
                    console.log(error.response)
                }) 

            },

            getOperationalTime: function(){	
                var basetime = this.starttime;  
                var t = basetime.split(/[- :]/);
                console.log("[getOperationalTime] t =", t)

                var today = new Date();
                console.log("[getOperationalTime] today =", today)

                //t[0] : year, t[1] : month, t[2] : date, t[3] : hour, t[4] : min, t[5] : sec,
                
                // month start 0  
                var opDate = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                console.log("[getOperationalTime] opDate =", opDate)

                var intervalMSec = today.getTime() - opDate.getTime();
                var intervalMin = intervalMSec / 1000 / 60;
                var intervalHour = intervalMSec / 1000 / 60 / 60;
               
                console.log("[getOperationalTime] intervalMin =", intervalMin);
                console.log("[getOperationalTime] intervalHour =", intervalHour);

                intervalMin = intervalMin - (parseInt(intervalHour)   * 60);
               
                var hourData = parseInt(intervalHour);
                var minData = parseInt(intervalMin) ;

                return {hourData, minData};
            }
         },

        computed: {
                hour() {
                    var time = this.getOperationalTime();

                    console.log("[getCurrentTime] time.hourData=", time.hourData);
                    this.hourValue = time.hourData;
                    
                    return this.hourValue
                },

                minute(){

                    var time = this.getOperationalTime();

                    console.log("[getCurrentTime] time.minData=", time.minData);
                    this.minuteValue = time.minData;
                    
                    
                    return this.minuteValue
                    
                }
        }, 

        mounted() {
                 this.interval = this.getStartTime();
                    setInterval(function () {
                        console.log("[OperationalTime] setInterval");
                        var time = this.getOperationalTime();
                        this.hourValue = time.hourData;
                        this.minuteValue = time.minData;
                    }.bind(this), this.updateInterval);
          }
    }

</script>

<style scoped>
    .download-chart{
        height: 225px;
    }
    canvas{
        min-width: inherit;
    }
</style>