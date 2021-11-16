<template>
  <nav class="nav_bar">
    <div class="navbar_logo">
        <div class="nav_img"><img src="src/images/solarPanel.png" alt="" height="50" width="50" class="float-right"></div>
        <a href="/">Solar Signage</a>
    </div>
    <ul class="navbar_menu">
      <li><router-link to="/">Home</router-link></li>        
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/weather">Weather</router-link></li>
        <li><router-link to="/google-maps">GoogleMap</router-link></li>
        <li><router-link to="/ad">Advertisement</router-link></li>
        <li><router-link to="/downloadcsv">Download CSV</router-link></li>
        
    </ul>
    <!--
    <ul class="navbar_icons">
        <li><a href="#"></a>About Us</li>
        <li><a href="#"></a>Github</li>
        <li><a href="#"></a></li>
    </ul>
    -->

  </nav>
</template>

<script>

import Dropdown from './Dropdown';
export default {
  name: 'navbar',
  components: {
    Dropdown
  },
  data () {
    return {
      services: [
        {
          title: 'Web',
          link: '#'
        },
        {
          title: 'Design',
          link:'#'
        },
        {
          title: 'Videos',
          link: '#'
        }
      ]
    }
  }
}
</script>

<style>
body{
    margin:0;
    
}
a{
    text-decoration:none;
    color:white;
}

.nav_bar {
  display: flex;
  justify-content:space-between;
  align-items: center;
  background-color: #80b6db;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  padding: 8px 12px;
}
.navbar_logo{
    display:flex;
    
    font-size: 32px;
    padding: 8px 12px;
    color: white;
}
.nav_img{
    
    top:1%;

    
    
}
.navbar_menu{
    display:flex;
    list-style:none;
    padding-left: 0;
}
.navbar_menu li{
    padding: 24px 30px 0px 30px;
    color:white;
    font-size: 24px;
    border-bottom: 3px solid transparent;
    
}
.navbar_menu li:hover{
    background-color: rgb(97, 165, 208);
    border-bottom-color: #FF5858;
    border-radius: 6px;
}
.navbar_icons{
list-style:none;
    color:white;
    display:flex;
    font-size:24px;
    
}
.navbar_icons li{
    padding: 24px 30px 0px 30px;
    
}
@media screen and (max-width:1280px){
    .nav_bar{
        width:1280px;
        flex-direction: row;
        align-items: flex-start;
    }
    .navbar_menu{
        width:1280px;
        flex-direction: row;
        align-items: center;
        width:100%;

    }
    .navbar_menu li{
        width:100%;
        text-align: center;
        
    }
    .navbar_icons{
      flex-direction: row;
        align-items: center;
      justify-content: center;
      width:100%;
    }

}

</style>