<template>
  <div class="google-maps-page">
      
      <card header-text="Google Maps" class="row">
            <input id="search-input" type="text"  ref="input" placeholder="Location?" @keyup.enter="getLocationText">
            <google-map  :props_coordinates="coordinates" ></google-map>
        </card>


  </div>
</template>

<script>
  import GoogleMap from './GoogleMap.vue';

  const axios = require('axios');

  export default {
    name: 'google-maps-page',
    data()  {
      return {
        location : "",
        coordinates : ""
      }
    },
    components: {
      GoogleMap
    },

    methods: {
      getCoordinates: function() {        
        this.locationEntered();
        var loc = this.location;
        var coords;
        var geocoder = new google.maps.Geocoder();
        console.log("[GoogleMapsPage] loc=", loc);
        return new Promise(function(resolve, reject) {
          geocoder.geocode({ address: loc }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              this.lat = results[0].geometry.location.lat();
              this.long = results[0].geometry.location.lng();
              this.full_location = results[0].formatted_address;
              coords = {
                lat: this.lat,
                long: this.long,
                full_location: this.full_location
              };
              this.coordinates = coords;
              resolve(coords);
            } else {
              alert("Oops! Couldn't get data for the location");
            }
          });
        });
      },

      locationEntered: function() {
        var input = this.$refs.input;
        if (input.value === '') {
          this.location = "Seoul";
        } else {
          this.location = this.convertToTitleCase(input.value);
        }
        this.makeInputEmpty();
    
      },

      makeInputEmpty: function() {
        this.$refs.input.value = '';
      },

      convertToTitleCase: function(str) {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
      },

      getLocationText: async function() {
        var coordinates = await this.getCoordinates();
        this.coordinates = coordinates;
        console.log("[GoogleMapsPage] this.location=",this.location);
        console.log("[GoogleMapsPage] this.coordinates=",this.coordinates);
        
    },
    
    }
    
  }
</script>

<style lang="scss">
   .google-maps-page{
    .card-body{
      height: 600px;
      width: 100%;
      margin: 0;
    }
  }
</style>
