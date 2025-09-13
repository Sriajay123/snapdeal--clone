
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FooterLinksData = [
  {
    title: "Men",
    links: [
      "Shirts for Men", "Casual Shirts for Men", "Formal Shirts for Men", "Hoodies for Men",
      "Cotton Shirts for Men", "T Shirts for Men", "Polo T Shirts", "Kurta Pajama for Men",
      "White Shirt", "Black Shirt", "Lower for Men", "Trousers for Men", "Jacket for Men",
      "Formal Pants for Men", "Tracksuit for Men", "Jeans for Men", "Kurta Payjama Sets",
      "Kurta for Men", "Blazer for Men", "Sweater for Men"
    ],
  },
  {
    title: "Women",
    links: [
      "Tops for Women", "Kurti", "Cotton Sarees", "Georgette Sarees", "Chiffon Sarees",
      "Net Sarees", "Dresses for Women", "Jumpsuit for Women", "Jeans for Women",
      "Salwar Suit", "Bra", "Jacket for Women", "Night Dress for Women", "Sweatshirt for Women",
      "Shorts for Women", "Readymade Blouse", "Dupatta", "T Shirt for Women", "Shirts for Women",
      "Skirts for Women", "Ethnic wear for Women", "Western Dresses for Women", "Leggings for Women"
    ],
  },
  {
    title: "Footwear",
    links: [
      "Men's Footwear", "Casual Shoes for Men", "Formal Shoes for Men", "Loafers for Men",
      "Slippers for Men", "Boots for Men", "Sandals for Men", "Footwear for Women",
      "Heels for Women", "Sandals for Women", "Shoes for Women",
      "Slippers for Women", "Boots for Women", "Jutti for Women", "Sports Shoes for Women"
    ],
  },
  {
    title: "Home & Kitchen",
    links: [
      "Wall Painting", "Wall Stickers", "Dream Catcher", "Rangoli Designs", "Clock",
      "Wall Clock", "Alarm Clock", "Diya", "Wall Hanging", "Ceiling Lights", "Table Lamp",
      "Hanging Lights", "LED Bulbs", "Torch Light", "Flower Vase", "Keychain", "Rudraksha", "Screwdriver"
    ],
  },
  {
    title: "Watch",
    links: [
      "Watch For Men", "Womens Watches", "Smart Watch", "Boys Watch", "Girls Watch"
    ],
  },
  {
    title: "Home Furnishing",
    links: [
      "Bed Sheet", "Mosquito Net", "Mattress", "Curtains", "Sofa Cover", "Blanket",
      "Pillow", "Carpet", "Apron", "Quilt", "Floor Mat", "Towel", "Pillow Cover"
    ],
  },
  {
    title: "Electronics",
    links: [
      "Bluetooth Speakers", "Headphones", "Earphone", "Ceiling Fan", "Geysers", "Trimmer",
      "Hair Straightener", "Hair Dryer", "Water Purifier", "Mixer Grinder", "Gas Stove",
      "Electric Kettle", "Computer Mouse", "Computer Keyboard", "USB", "HDMI Cables", "Computer Antivirus"
    ],
  },
  {
    title: "Mobiles Accessories",
    links: [
      "Mobile Covers", "Leather Mobile Covers", "Printed Back Covers", "Tempered Glass"
    ],
  }
];


function Footer() {



  return (
    <>
    <div className='w-full h-auto border-b border-[#ffffff] rounded-sm  shadow-sm'>
       <div className='ml-15 mt-10'>
           {FooterLinksData.map((item, i) => (
            <div key={i} className="">
              <span className="text-xs text-[#777878]">{item.title} : </span>
              {item.links.map((link, linkIndex) => (
                <span key={linkIndex} className="text-xs text-gray-500">
                  <Link
                    to="#"
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors hover:underline"
                  >
                    {link}
                  </Link>
                  {linkIndex < item.links.length - 1 ? " / " : ""}
                </span>
              ))}
            </div>
          ))}


            <div className='mt-5 mb-5 text-xs text-[#949aa2]'>
             <p>Snapdeal is India's leading pure-play value Ecommerce platform. Founded in 2010 by Kunal Bahl and Rohit Bansal, Snapdeal is one of the top four online lifestyle shopping destinations of India. Snapdeal brings together a wide assortment of good quality and value- priced merchandise on its platform. Snapdeal's vision is to enable the shoppers of Bharat to experience the joy of living their aspirations through reliable, value-for-money shopping. With a personalized, multilingual interface and cutting edge technology, Snapdeal has simplified the shopping experience for its value-conscious buyers by showcasing the most relevant products- products that are a good functional fit with their needs and of a quality that lasts- thereby delivering true value to its customers. With its commitment to high service standards, Snapdeal suppliers operate under a well structured ecosystem that enables them to offer great quality products at affordable prices. With majority of the value-seeking, middle-income, price-conscious buyers coming from the non-metros, Snapdeal’s logistics networks powered by third party logistics cover more than 96% of India’s pin codes enabling order deliveries to more than 2500 towns and cities and expanding. Further, Snapdeal's mission is to become India’s value lifestyle omni-channel leader. We are excited about continuing to build a complete ecosystem around value commerce, where we can serve Bharat consumers wherever they are on their offline to online shopping journey. Snapdeal is part of the AceVector Group and one of India’s best-known e-commerce companies with an exclusive focus on the value segment.</p>

             </div>
        </div>

       </div>

      <div className='bg-white w-full  h-11 flex  items-center justify-between  text-xs text-[#949aa2] '>
          <span className='ml-15 mt-3 '>Copyright © 2021, Snapdeal Limited. All Rights Reserved</span>
          <span className='mr-15' >Made for Bharat 
     <i className="fa-solid fa-heart text-red-500 hover:scale-125 transition-transform duration-300 ml-2"></i>
            </span>
     </div> 

    </>
  )
}

export default Footer