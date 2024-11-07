import React from 'react';
import Slider from 'react-slick';
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full h-full overflow-hidden">
                <Slider {...settings} className="h-full"> 
                    <div className="h-full flex items-center justify-center">
                        <img src={image1} alt="Description 1" className="w-full h-3/5 object-cover" />
                    </div>
                    <div className="h-full flex items-center justify-center">
                        <img src={image2} alt="Description 2" className="w-full h-3/5 object-cover" />
                    </div>
                    <div className="h-full flex items-center justify-center">
                        <img src={image3} alt="Description 3" className="w-full h-3/5 object-cover" />
                    </div>
                </Slider>
            </div>
        </div>
    );
};

export default Home;
