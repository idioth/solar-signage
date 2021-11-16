<template>
    <div class="col-xs-12 col-sm-4 ml-0 mr-0">
        <div class="card">
            <div class="card-top">
                
                   <img src="src/images/solarPanel.png" alt="" height="25" width="25" class="float-left mr-2">
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
                        <div class=" col-xs-7 col-md-7">
                             <div class="item text-center pl-0">
                                <h2><strong>4.07 %</strong></h2> 
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
       
    name: 'solarload',
    props: ['title'],

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