<template>
    
    <div class="slide_page">
        <div class ="row">
        <carousel class="carousel_menu" :autoplay="true" :mouse-drag="true">
            
            <carousel-slide  v-for="slide in slides" :key="slide" class="carousel-slider">
                <img :src="slide" :alt="slide">
                
            </carousel-slide>
        </carousel>
        <div>sss</div>
        </div>    
    </div>    

    
</template>

<script>
import Carousel from './Carousel.vue';
import CarouselSlide from './CarouselSlide.vue';
export default {
    data(){
        return {
            slides: [
                'https://picsum.photos/id/230/1280/720',
                
                'https://picsum.photos/id/231/1280/720',
                'https://picsum.photos/id/232/1280/720',
                'https://picsum.photos/id/233/1280/720',
                'https://picsum.photos/id/234/1280/720',
                'https://picsum.photos/id/235/1280/720',
                'https://picsum.photos/id/236/1280/720',
            ]
        }
    },
    components : {
        Carousel : Carousel,
        CarouselSlide : CarouselSlide,
    }
}
</script>

<style>
    .slide_page {
        display:flex;
        justify-content: center;
        background-size: cover;
        margin :0;
        padding:0;
        border:none;
        object-fit: cover;
    }
    .carousel_menu {
        position:relative;
        overflow: hidden;
        
        width:1280px;
        height:720px;
        z-index:10;
    }
    .btn {
        padding:5px 10px;
        background-color:rgba(0,0,0,0.5);
        border:1px solid transparent;
        margin:5px 10px;
        color:#FFF;
        height:50px;
        width:50px;
        position:absolute;
        margin-top:-25px;
        z-index:2;
    }
    .btn:hover {
        cursor: pointer;
    }
    .btn:focus{
        outline:none;
    }
    .btn-next {
        top:50%;
        right:0;
    }
    .btn-prev {
        top:50%;
        left:0;
    }
    .carousel-slider {
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
    }
    .carousel-slider img {
        width:100%;
        height:100%;
    }
</style>