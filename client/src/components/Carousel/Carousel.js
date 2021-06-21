import React, {useRef} from 'react'
import './carousel.css'

import {Grid} from "@material-ui/core";

import pic1 from "./Capture.PNG"
import pic2 from "./Capture2.PNG"





  const Carousel = () =>{

    const carItem = useRef();
    const carItem2 = useRef();
    const carItem3 = useRef();
    
    const dotRef = useRef();
    const dotRef2 = useRef();
    const dotRef3 = useRef();

    var slideIndex = 1;
    function focus(){
        console.log("aaa");
    }
    
    

    function currentSlide(n, e) {
        showSlides(slideIndex = n, e);
    }

    function showSlides(n, e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(e);
        var i;
        var slides = [carItem.current, carItem2.current, carItem3.current];
        var dots = [dotRef.current, dotRef2.current, dotRef3.current];
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display="none";
            e.stopPropagation();
        e.preventDefault();
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
            dots[i].className = dots[i].className.replace(" firstDot", "");

        }
        e.stopPropagation();
        e.preventDefault();
        slides[slideIndex-1].style.display = "block";
        slides[slideIndex-1].className += "d-block";
        slides[slideIndex-1].className += "blockClass";
        dots[slideIndex-1].className += " active";
    }
    return(
                    <Grid className='carouselContainer carouselContainerAlpha' alignItems="center" textAlign="center" justify="center" container direction="column">
                        <Grid item ref={carItem} className='mySlides fade'>
                            <div className="carouselFlex">
                                <img src={pic1} style={{width: "40%"}} className="carouselImage"></img>
                                <h1 className="carouselTitle">Web App User Interface</h1>
                                <p className="carouselText">Friendly User Interface</p>
                            </div>
                        </Grid>
                        <Grid item ref={carItem2} className='mySlides fade'>
                            <div className="carouselFlex">
                                <img src={pic2} style={{width: "40%"}} className="carouselImage"></img>
                                <h1 className="carouselTitle">Hydroponics</h1>
                                <p className="carouselText">Up to 70% more efficient than traditional agriculture.</p>
                            </div>
                        </Grid>
                        <Grid item ref={carItem3} className='mySlides fade'>
                            <div className="carouselFlex">
                                <img src={pic1}  style={{width: "40%"}}className="carouselImage"></img>
                                <h1 className="carouselTitle">Single Control Center</h1>
                                <p className="carouselText">Control all of your parameters and operations here.</p>
                            </div>
                        </Grid>
                        <Grid item>
                            <div className="textAlignCenter dots">
                                <span ref={dotRef} class="dot firstDot" onClick={(e)=> currentSlide(1, e)}></span>
                                <span ref={dotRef2} class="dot" onClick={(e)=> currentSlide(2, e)}></span>
                                <span ref={dotRef3} class="dot" onClick={(e)=> currentSlide(3, e)}></span>
                            </div>
                        </Grid>
                    </Grid>
    );
  };

  export default Carousel;