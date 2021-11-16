<template>
    <div class="col-xs-12 col-sm-4 ml-0 mr-0">
        <div class="card">
            <div class="card-top">

                   <img src="src/images/solarpan.jpg" alt="" height="50" width="50" class="float-right">
                    <h3 class="float-left bold"> <strong>{{ title }}</strong></h3>   
            </div>
            
            <div class="card-body p-0 pt-2 pb-2">   
                 
                 <div class="row">
                        <div class="col-sm-2">
                            <div>
                                <img src="src/images/building.png" alt="" height="20" width="20" class="float-right">
                            </div>
                        </div> 
                        <div class="col-sm-4">
                             <div class="item text-left pl-0">
                                <h3><small>Name</small></h3> 
                            </div>
                        </div> 
                        <div class="col-sm-4">
                            <div class="item text-center">
                               <!-- <h5 class="m-0 pb-0"><small>{{ gps }}</small></h5>-->
                               <h3 class="m-0 pb-0"><small>{{this.name}}</small></h3>
                            </div> 
                        </div>   
                  </div>

                    <div class="row">
                        <div class="col-sm-2">
                            <div>
                                <img src="src/images/gps.png" alt="" height="20" width="20" class="float-right">
                            </div>
                        </div> 
                        <div class="col-sm-4">
                             <div class="item text-left pl-0">
                                <h3><small>GPS [Latitude]</small></h3> 
                            </div>
                        </div> 
                        <div class="col-sm-4">
                            <div class="item text-center">
                               <!-- <h5 class="m-0 pb-0"><small>{{ gps }}</small></h5>-->
                               <h3 class="m-0 pb-0"><small>{{this.lat}}</small></h3>
                            </div> 
                        </div>   

                  </div>
                <div class="row">
                    <div class="col-sm-2">
                            <div>
                                <img src="src/images/gps.png" alt="" height="20" width="20" class="float-right">
                            </div>
                        </div> 
                    <div class="col-sm-4">
                             <div class="item text-left pl-0">
                                <h3><small>GPS [Longitude]</small></h3> 
                            </div>
                        </div> 
                  <div class="col-sm-4">
                            <div class="item text-center">
                               <!-- <h5 class="m-0 pb-0"><small>{{ gps }}</small></h5>-->
                               <h3 class="m-0 pb-0"><small>{{this.long}}</small></h3>
                            </div> 
                        </div>   

                </div>

             </div>
            </div>
                 
          
        </div>
    
</template>

<script>
import DropdownMenu from './dropdown.vue';
import {GPS_WRAPPER_URL} from './../../../../config.js'

    
    const axios = require('axios');
   
    export default({
       
    name: 'deviceinfo',
    props: ['title'],

    data: function(){
        return{
                name: "",
                lat: "",
                long :""
            }
        },
        methods: {
            getDeviceInfo : function () { 
        
                var urlWrapper = GPS_WRAPPER_URL
                console.log("[getDeviceInfo]")
            
                axios.get(urlWrapper)
                    .then(({data}) => {
                    console.log("[getDeviceInfo] data =", data)
                    this.name = data.name
                    this.lat = data.lat
                    this.long = data.long
                    console.log("[getDeviceInfo][Lat] ", this.lat)
                    console.log("[getDeviceInfo][Long] ", this.long)
                    console.log("[getDeviceInfo][name] ", this.name)

                    //TODO : for test : set defult
                    if (this.lat == "0" || this.lat == "undefined") {
                        // Chung-Ang University lat : 37.50528383664044, long : 126.95706901142802
                        this.lat = 37.5052838
                        this.long = 126.9570690
                    }
                })
                .catch(error => {
                    // default url
                    console.log(error.response)
                }) 

            }
            
        },

        computed: {
               
        },
        
        watch: {
            
        },

        mounted: function(){
            this.getDeviceInfo()
        },

        components: {
        
    },
    })
</script> 

<style scoped>
  
</style>