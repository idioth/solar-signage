<template>
 
  <div class="google-map">
  </div>
 
 
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as GoogleMapsLoader from 'google-maps'
  import { updateLocale } from 'moment';

  import {GPS_WRAPPER_URL} from './../../../../config.js'


  const axios = require('axios');
  const mapValZoom = 15;

  export default {
    name: 'google-map',

    props : ['props_coordinates'],

    data(){
          return{
              gpsLat: "0", gpsLong : "0", gpsName : "0"
          }
    },

    computed: mapGetters({
      config: 'config'
    }),

    watch : {
        props_coordinates() {  
          deep: true,        
          this.loadGoogleMap(this.props_coordinates.lat, this.props_coordinates.long, mapValZoom);
          console.log("watch 1");
        },

        gpsLat () {
          deep: true,        
          this.loadGoogleMap(this.gpsLat, this.gpsLong, mapValZoom);
          console.log("watch 2");
        }
        
    },

    methods : {
      loadGoogleMap : function(lat, long, valZoom) {
        console.log("[loadGoogleMap] coordinates=", this.props_coordinates);        
        GoogleMapsLoader.KEY = this.config.googleMaps.apiKey;

        this.$getLocation({
          enableHighAccuracy: true, //defaults to false
          timeout: Infinity, //defaults to Infinity
          maximumAge: 0 //defaults to 0
          
        })
        .then(coordinates => {
          console.log("[loadGoogleMap] getLocation=",coordinates);
        });

        GoogleMapsLoader.load((google) => {
        /* eslint-disable no-new */
          const map = new google.maps.Map(this.$el, {
            center: new google.maps.LatLng(lat, long),
            zoom: valZoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          console.log("[loadGoogleMap] this.gpsLat = ", this.gpsLat)
          console.log("[loadGoogleMap] this.gpsLong = ", this.gpsLong)

         var marker = new google.maps.Marker({               
              position: new google.maps.LatLng(this.gpsLat, this.gpsLong),
              draggable: false,
              animation: google.maps.Animation.DROP,
              map : map,
              label: {
                color: 'black',
                fontWeight: 'bold',
                text: this.gpsName
              },
          });
        })
      },

    getSolarGPS : function () { 
        var urlWrapper =GPS_WRAPPER_URL
        console.log("getSolarGPS")
       
          axios.get(urlWrapper)
              .then(({data}) => {
              console.log("[getSolarGPS] data =", data)
              this.gpsLat = data.lat
              this.gpsLong = data.long
              this.gpsName = data.name
              console.log("[getSolarGPS][Lat]=", this.gpsLat)
              console.log("[getSolarGPS][Long]=", this.gpsLong)
              console.log("[getSolarGPS][name]=", this.gpsName)

              //TODO : for test : set defult
              if (this.gpsLat == "0" ) {
                  // Chung-Ang University lat : 37.50528383664044, long : 126.95706901142802
                  this.gpsLat = 37.5052838
                  this.gpsLong = 126.9570690
              }
          })
          .catch(error => {
              console.log(error.response)
          }) 
      }
    },

    async created() {
      console.log("created")
      await this.getSolarGPS()
    },

    mounted () {
        console.log("mounted")      
        //this.loadGoogleMap(37.550647, 127.075344, mapValZoom)      
    },
  }
</script>

<style lang="scss">
  .google-map {
    height: 100%;
  }
</style>
