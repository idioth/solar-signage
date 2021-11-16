<template>
    
    <div class="slide_page">
        <div class="prev_line">
        <carousel :autoplay="true" :mouse-drag="true">
            <carousel-slide  v-for="slide in slides" :key="slide" class="carousel-slider">
                <img :src="slide" :alt="slide">
            
            </carousel-slide>
        </carousel>
            <basic-elements></basic-elements>
        </div>        
    </div>    
</template>

<script>
import Carousel from './Carousel.vue';
import CarouselSlide from './CarouselSlide.vue';
import BasicElements from "./BasicElements.vue";
export default {
    data(){
        return {
            slides: [
                'https://picsum.photos/id/476/900/600',
                'https://picsum.photos/id/653/900/600',
                'https://picsum.photos/id/496/900/600',
                'https://picsum.photos/id/265/900/600',
                'https://picsum.photos/id/25/900/600',
            ]
        }
    },
    components : {
        Carousel,
        CarouselSlide,
        BasicElements
    }
}
</script>

<style>
    .prev_line{
        display:flex;
        justify-content: center;
    }
    .carousel {

        position:relative;
        overflow: hidden;
        
        width:900px;
        height:600px;
        z-index:10;
    }
    .btn {
        padding:5px 10px;
        background-color:rgba(18, 100, 135, 0.5);
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