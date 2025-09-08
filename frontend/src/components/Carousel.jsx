import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Thumbs ,Autoplay} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "../App.css"

function Carousel() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const slides = [
    {
      src: "https://g.sdlcdn.com/imgs/k/z/2/Snapdeal_New_Website_home_page_8-73a30.png",
      alt: "BOB CARD",
    },
    {
      src: "https://g.sdlcdn.com/imgs/k/x/z/DESKTOPBOOKBANNER-83d8b.jpg",
      alt: "India@100:Envisioning To...",
    },
    {
      src: "https://g.sdlcdn.com/imgs/k/x/g/sportshoesbanner03july-85e66.jpg",
      alt: "Sports Footwear",
    },
    {
     src:"https://g.sdlcdn.com/imgs/k/s/i/ethnicwear-ef4d9.jpg",
     alt:"ETHNIC WEAR",
    },
    {
      src: "https://g.sdlcdn.com/imgs/k/s/i/cookware-bc6ef.jpg",
      alt: "KITCHEN WARE",
    },
  ];

  return (
    <div className="w-[850px] text-[13px] text-[#666666]">
      {/* Main Swiper */}
      <Swiper
        className="h-[268px]"
        modules={[Navigation, Pagination, A11y, Thumbs,Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
         autoplay={{
          delay: 3000, // 3s per slide
          disableOnInteraction: false, // keep autoplay after manual swipe
        }}
        // pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={slide.src}
              alt={slide.alt}
              title={slide.alt}

              className="w-full h-full object-cover rounded-sm"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Text Tabs */}
      <div className="border-x border-b border-[#f6f6f6] rounded-sm bg-white shadow-sm">
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          watchSlidesProgress
          slidesPerView={slides.length}
          spaceBetween={0}
          className="h-[40px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-full px-2 cursor-pointer truncate">
                {slide.alt}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Active tab styling */}
      <style>
        {`
          .swiper-slide-thumb-active div {
            border-bottom: 2px solid black; /* highlight color */
            font-weight: 600;
            color: #000;
          }
        `}
      </style>
    </div>
  );
}

export default Carousel;
