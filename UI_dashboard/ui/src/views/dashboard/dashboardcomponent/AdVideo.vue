<template>
    <div class="player">
        <iframe width="1280" 
        height="720" 
        :src="getData" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>
    </div>
</template>

<script>

import {AD_WRAPPER_URL} from './../../../../config.js'

const default_AD_URL = "https://www.youtube.com/embed/xLD8oWRmlAE";

const axios = require('axios');

export default {

    data(){
          return{
              adUrl: ""
          }
    },

    mounted () {
        this.getAdUrl()
    },

    computed : {
        getData : {
            get : function () {
                return this.adUrl;
            
            }
        }
    },

    methods: {
    
    getAdUrl : function () { 
        
        var urlWrapper = AD_WRAPPER_URL
        console.log("[getAdUrl]")
       
          axios.get(urlWrapper)
              .then(({data}) => {
              console.log("[getAdUrl] data =", data)
              this.adUrl = data
          })
          .catch(error => {
              // default url
              this.adUrl = default_AD_URL
              console.log(error.response)
          }) 

      }
    }
}
</script>
<style>
.player{
        display:flex;
        justify-content: center;
        align-items: center;
}
</style>