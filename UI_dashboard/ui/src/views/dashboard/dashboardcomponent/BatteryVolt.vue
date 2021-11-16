<template>
    <div class="col-xs-12 col-sm-4 ml-0 mr-0">
        <div class="card">
            <div class="card-top">
                
                   <img src="src/images/batteryvolt.jpg" alt="" height="50" width="50" class="float-right">
                    <h3 class="float-left bold"> <strong>{{ title }}</strong></h3>
                   
                            
            </div><!-- /.card-top -->
            <!-- <div class="card-body p-0 pt-4 pb-4 download-chart"> -->

            
            <div class="card-body p-0 pt-2 pb-2">   
                <div class="row">
                    <div class=" col-xs-2 col-md-2">
                            <div>
                                <img src="src/images/voltage.png" alt="" height="35" width="35" class="float-right">
                            </div>                            
                    </div> 
                        <div class="row">
                            <div class="item text-left pl-2">
                                <h2><strong>Max(v)</strong></h2> 
                            </div>

                             <div class="item text-center pl-5">
                                <h2><strong>{{maxvolt}}</strong></h2> 
                            </div>

                        </div> 
                
                </div>

                 <div class="row">
                    <div class=" col-xs-2 col-md-2">
                            <div>
                                <img src="src/images/voltage.png" alt="" height="35" width="35" class="float-right">
                            </div>
                        </div> 
                        <div class="row">
                            <div class="item text-left pl-2">
                                <h2><strong>Min (v)</strong></h2> 
                            </div>

                             <div class="item text-center pl-5">
                                <h2><strong>{{minvolt}}</strong></h2> 
                            </div>

                        </div> 
                
                </div>
                <div class="row mb-0">
                        <div class="col-md-12">
                            <div class="item text-center mb-0">
                                 <!-- <h6 class="ml-5"><small>Last Updated : </small></span></h6> -->
                                  <span class="badge badge-dark ml-5">Last Updated : {{updatedTime}}</span>
                            </div>
                        </div>
                  </div>
            </div>
                 
            <div class="card-footer bg-white br-0 pl-5 pr-5 pt-0 pb-0">
                   
            </div>
        </div>
    </div>
</template>

<script>
   
    export default({
       
    name: 'batteryvolt',
    props: ['title', 'updatedTime','maxvolt', 'minvolt'],

        methods: {
        

        },

        computed: {
               
        },
        
        watch: {
            
        },

        mounted: function(){
        
        }
    })
</script> 



<style scoped>
    .small {
    max-width: 300px;
  }
</style>