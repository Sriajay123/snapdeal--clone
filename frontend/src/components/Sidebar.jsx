import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import qrcode from '../assets/qrcode.png'
import mens from '../assets/mens.jpg'
import womens from '../assets/women.jpg'
import beauty from '../assets/sidebeauty.jpg'
import toy from '../assets/toy.jpg'
import sidehome from '../assets/sidehome.jpg'
import automotive from '../assets/auto.jpg'
import Electronics from '../assets/electronics.jpg'
import computers from '../assets/Laptop.jpg'
import books from '../assets/books.jpg'
import sports from '../assets/Cricket.jpg'
import hobbies from '../assets/Hobby.jpg'
import mobile from '../assets/Mobile.jpg'


// Category data structure based on the image
const categoryData = {
  "Men's Fashion": {
    "FOOTWEAR": [
      "Sports Shoes", "Casual Shoes", "Slippers & Flip Flops", "Sandals & Floaters", "Formal Shoes",
      "Loafers", "Sneakers", "Ethnic Footwear", "Shoe Accessories", "View All"
    ],
    "BAGS & LUGGAGE": [
      "Backpacks", "Laptop Bags", "Hiking Bags", "Luggage & Suitcases", "Travel Accessories", "Office Bags", "View All"
    ],
    "CLOTHING": [
      "T-Shirts & Polos", "Shirts", "Jeans", "Trousers & Chinos", "Innerwear & Sleepwear", "View All"
    ],
    "WINTER WEAR": [
      "Jackets", "Sweatshirts", "Sweaters", "Thermals"
    ],
    "SPORTSWEAR": [
      "T-Shirts & Polos", "Trackpants & Tracksuits", "View All"
    ],
    "MEN'S GROOMING": [
      "Shaving Creams & Gels"
    ],
    "EYEWEAR": [
      "Sunglasses", "View All"
    ],
    "WATCHES": [],
    "JEWELLERY & CUFFLINKS": [],
    "ACCESSORIES": [
      "Wallets", "Belts", "Hats & Caps", "Gift Sets", "Neckties & Cravats",
      "Card Holders", "Keychains", "Suspenders", "View All"
    ]
  },

  "Women's Fashion": {
    "ETHNIC WEAR": [
      "Sarees", "Kurtas & Kurtis", "Lehengas", "Salwar Suits", "Ethnic Bottomwear", "Saree Blouses", "View All"
    ],
    "FOOTWEAR": [
      "Heels", "Flats & Sandals", "Slippers & Flip Flops", "Ballerinas", "Casual Shoes", "Sports Shoes", "Ethnic Footwear", "Floater Sandal", "View All"
    ],
    "PERFUMES & FRAGRANCES": [
      "Perfumes", "Deodorants"
    ],
    "WOMEN'S CLOTHING": [
      "Dresses & Gowns", "Tops & Tunics", "T-Shirts", "Shirts", "Jeans",
      "Trousers", "Innerwear", "Nightwear", "Sportswear & Gymwear", "View All"
    ],
    "WINTER WEAR": [
      "Outerwear & Jackets", "Sweatshirts", "Cardigans & Pullovers", "Shrugs & Waistcoats"
    ],
    "MATERNITY WEAR": [],
    "HANDBAGS & CLUTCHES": [
      "Handbags", "Wallets", "Clutches", "Utility bags", "Eyewear", "Sunglasses", "Spectacle Frames", "Watches",
      "Fashion Jewellery", "Necklaces & Sets", "Earrings", "Bangles & Bracelets", "Pendants & Sets", "View All"
    ],
    "GOLD COINS & BARS": [],
    "FASHION ACCESSORIES": [
      "Hair Accessories", "Stoles & Scarves", "Socks & Stockings", "View All"
    ]
  },

  "Home & Kitchen": {
    "KITCHEN APPLIANCES": [
      "Juicer Mixer Grinders", "Water Purifiers", "Gas Stoves & Hobs", "Induction Cooktops", "Kettles & Coffee Makers",
      "Choppers & Blenders", "Sandwich Makers", "Roti Makers", "Electric Cookers", "View All"
    ],
    "KITCHENWARE": [
      "Cookware & Bakeware", "Kitchen Storage", "Dining & Serving", "Kitchen Tools", "Pressure Cookers",
      "Water Bottles", "Tea & Coffeeware", "Bar Accessories", "View All"
    ],
    "HOME FURNISHING": [
      "Bed Linen", "Bath Linen", "Blankets & Quilts", "Curtains & Accessories", "Mattresses", "View All"
    ],
    "HOME DÉCOR": [
      "Lighting Fixtures", "Wall Decor", "Gifts & Decor", "Religion & Spirituality", "LED Bulbs", "View All"
    ],
    "HOME IMPROVEMENT": [
      "Home Utility", "Cleaning Mops", "Plants & Gardening", "Ironing Boards", "Home Cleaning", "Laundry Accessories", "View All"
    ],
    "TOOLS & HARDWARE": [
      "Power & Hand Tools", "Bathroom Accessories", "Electrical", "Taps & Showers", "Safes Lock & Door Fitting", "Sanitaryware", "View All"
    ],
    "PET SUPPLIES": [
      "Dog Supplies", "Cat Supplies", "Fish & Aquatic Supplies", "Bird Supplies", "View All"
    ]
  },

  "Toys, Kids' Fashion & More": {
    "TOYS": [
      "Toy Cars", "Electronic Toys", "Action Toys & Figures", "Ride On & Scooters", "Outdoor Toys", "Soft Toys",
      "Educational Toys", "Toddler Toys", "Dolls & Doll Houses", "Activity Sets", "Indoor & Board Games", "Party Supplies", "Bicycles & Tricycles"
    ],
    "KIDS' FOOTWEAR": [
      "Boys Footwear", "Girls Footwear", "Baby Footwear"
    ],
    "KIDS EYEWEAR": [],
    "KIDS' WATCHES": [],
    "KIDS' FASHION": [
      "Girls' Clothing", "Girls Clothing Sets", "Frocks & Dresses", "T-Shirts, Tops & Shirts", "Jumpsuits & Dungarees",
      "Girls Sweatshirts", "Girls Jackets", "Girls Jeans", "Boys' Clothing", "Boys Clothing Sets", "Boys Tshirt & Polos",
      "Boys Shirt", "Boys Trackpant", "Boys Jeans", "Boys Sweatshirts", "Baby Clothing", "Baby Boys & Girls Sets",
      "Baby T-Shirt, Tops&Shirts", "Baby Girl Frock, &Dresses"
    ],
    "KIDS ACCESSORIES": [],
    "BABY CARE": [
      "Baby Mosquito Nets", "Baby Blankets", "Baby Carriers", "Baby Strollers", "Walkers", "Feeding & Nursing"
    ],
    "LAB EQUIPMENT": [],
    "STATIONERY": [
      "Pens & Markers", "Pencil Boxes", "Files & Folders", "Calculators", "Diaries & Planners", "Printing Papers", "Notebooks", "Writing Pads", "Photo Papers"
    ],
    "ART & CRAFT SUPPLIES": [
      "Tapes", "Card Holders", "Staplers"
    ]
  },

  "Beauty, Health & Daily Care": {
    "BEAUTY": [
      "Face", "Eyes", "Lips", "Nails", "Makeup Palettes", "Brushes & Applicators"
    ],
    "PERSONAL CARE & GROOMING": [
      "Skin Care", "Hair Care", "Bath & Shower", "Oral Care", "Men's Grooming", "Feminine Hygiene", "Waxing & Hair Removal", "Deodorants & Roll-ons"
    ],
    "SEXUAL WELLNESS": [
      "Condoms", "Lubes", "Adult Sex Toys", "Performance & Enlargement", "Sexy Lingerie"
    ],
    "FOOD AND GOURMET": [
      "Tea, Coffee & Beverages", "Noodles, Soups & Pastas", "Biscuits", "Breakfast Foods", "Ready To Cook & Eat",
      "Sauces & Dressings", "Baking Essentials", "Chocolates & Candies", "Staples, Oils & Spices", "Dry Fruits & Gifts Boxes"
    ],
    "NUTRITION & SUPPLEMENTS": [
      "Proteins", "Vitamins & Minerals", "Health Drinks", "Meal Replacements", "Weight Gainers", "Workout Supplements", "Muscle Support"
    ],
    "HEALTH MONITORING DEVICES": [
      "BP Monitors", "Diabetic Care", "Weighing Scales", "Body Fat Analysers", "Respiratory & Heart Care", "Thermometers"
    ],
    "GENERAL WELLNESS": [
      "Massagers & Pain Relief", "Mobility Rehabilitation", "First Aid", "Nicotine Gums"
    ],
    "BABY CARE": [
      "Diapers & Potty Training", "Bath, Skin & Health Care", "Baby Food"
    ],
    "HOUSEHOLD ESSENTIALS": [
      "Detergents & Fabric Care", "House & Kitchen Cleaners", "Repellents", "Air Fresheners"
    ]
  },

  "Automotives": {
    "AUTOMOTIVE ACCESSORIES": [

    ],
    "CAR & VEHICLE ElECTRONICS": [
      "Bluetooth Devices",
      "Car GPS Navigation",
      "View All",
    ],
    "CAR ACCESSORIES": [
      "Car Body Covers", "Car Mobile Chargers", "Car Mobile Holders",
    ],


    "CAR FRESHNERS": [
    ],

    "AIR PURIFIERS & IONIZERS": [],

    "BIKE GEAR & ACCESSORIES": [
      "Bike Body Covers", "Biker Protective Gear",
    ],

    "BIKER RAINCOATS": [],

    "HELMET AND ACCESSORIES": [
      "Helmet Accessories",
    ],
    "PARTS AND SPARES": [
      "Filters",
      "Lighting",
      "External Parts"
    ],
  },
  "Mobile & Accessories": {

    "MOBILE CASES & COVERS": [
      "Printed Back Covers", "Plain Back Covers", "Flip Covers", "Screen Guards",
      "View All"
    ],
    "MOBILE ACCESSORIES": [
      "Cables & Chargers", "Power Banks", "Selfie Sticks", "Mobile Enhancements", "Memory Cards",
      "View All"
    ]


  },
  "Electronics": {
    "SPEAKERS": [
      "Home Audio Systems",
      "Bluetooth Speakers",
      "2.0 Speakers",
    ],
    "HEADPHONES & EARPHONES": [

      "Bluetooth Headphone",
      "Earphones",
      "True Wireless Earbuds"],
    "AUDIO & VIDEO": [
      "Projectors", "Audio & Video Accessories"
    ],
    "ALL LARGE APPLIANCES": [
      "Geysers",
      "Immersion Rods",
      "Room Heaters"],
    "FANS": [

      "Ceiling Fans",
      "Table Fans",
      "Exhaust Fans"
    ],
    "HOME APPLIANCES": [
      "Microwaves & OTG",
      "Air Purifiers",
      "Vacuum Cleaners",
      "Irons",
      "Landline Phones",
      "Home Security Systems",
      "Sewing Machines"
    ],
    "GROOMING APPLIANCES": [
      "Trimmers",
      "Shavers",
      "Hair Dryers",
      "Hair Straighteners",
      "Hair Curlers & More"
    ]

  },
  "Sports, Fitness & Outdoor": {


    "SPORTS AND FITNESS": [
    ],
    "GET FIT AT HOME": [
      "Home Gym",
      "Dumbbells",
      "Abdominal Exercisers",
      "Exercise Bikes",
      "Yoga Mats",
      "Exercise Benches",
      "Weighing Scales",
      "View All"
    ],
    "GET READY FOR GYM": [
      "Sports Footwear",
      "Sippers",
      "Gym Gloves",
      "Sports Nutrition",
      "Gym Bags"
    ],
    "SPORTS": [
      "Running",
      "Cricket",
      "Kids Cycles",
      "Adult Cycles",
      "Bicycle Accessories",
      "Badminton",
      "Football",
      "Basketball",
      "Skating",
      "Archery and Shooting",
      "View All"
    ],
    "HIKING & OUTDOOR": [
      "Knives & Tools",
      "Backpacks",
      "Hiking Bags",
      "Luggage & Suitcases",
      "Travel Accessories",
      "View All"
    ]
  },

  "Computers & Gaming":

  {

    "PRINTER INKS & TONERS": [],
    "STORAGE": [
      "Memory cards",
      "Pen Drives",


    ],
    "NETWORKING DEVICES": [
      "Data Cards",
      "Dongles"
    ],

    "COMPUTER ACCESSORIES": [
      "Keyboards",
      "Mouse",
      "Webcams",
      "Laptop Skins",
      "Cooling Pads",
      "Extension Cords",
      "View All"
    ],
    "GAMING": [
      "Gaming Accessories",
      "View All"
    ],
    "COMPUTER COMPONENTS": [
      "RAM",
      "Internal Hard Drive",
      "View All"
    ],
    "SOFTWARE": [
      "Antivirus",
      "View All"
    ]
  },

  "Books, Media & Music": {

    "VIEW ALL BOOKS": [],
    "TOP EXAMS": [
      "GATE", "IIT JEE", "NEET", "BANK PO", "UGC Net",
      "UPSC"
    ],
    "BROWSE BY GENRE": [
      "School Texts", "Competitive Exams", "Academic & Professional", "Children & Young Adults",
      "Non-Fiction", "Literature & Fiction", "Self Help", "Reference"
    ],
    "ONLINE EDUCATION": [
      "School Learning Online", "Online Test Preparation"
    ],
    "INDIAN INSTRUMENTS": [
      "Tabla", "Flutes"

    ],
    "OTHER INSTRUMENTS": [
      "Mouth Organs"],


    "E-GIFT CARDS": [
      "Cleartrip",
      "MakeMyTrip"
    ]
  },

  "Hobbies": {
    "Arts & Crafts": [""],

    "Collectibles": [""],

  }




};

function Sidebar() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isMouseInSidebar, setIsMouseInSidebar] = useState(false);
  const [isMouseInPopup, setIsMouseInPopup] = useState(false);

  // Handle mouse enter category - immediate show
  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
    setIsMouseInSidebar(true);
  };

  // Handle sidebar mouse leave
  const handleSidebarMouseLeave = () => {
    setIsMouseInSidebar(false);
    // Close popup after delay if mouse is not in popup
    setTimeout(() => {
      if (!isMouseInPopup && !isMouseInSidebar) {
        setHoveredCategory(null);
      }
    }, 300);
  };

  // Handle popup mouse enter - keep popup open
  const handlePopupMouseEnter = () => {
    setIsMouseInPopup(true);
  };

  // Handle popup mouse leave - close popup
  const handlePopupMouseLeave = () => {
    setIsMouseInPopup(false);
    setHoveredCategory(null);
  };

  return (
    <div className="relative">
      {/* Main Sidebar */}
      <div
        className="w-[230px] h-auto ml-[40px] bg-white border border-gray-200 shadow-sm"
        onMouseLeave={handleSidebarMouseLeave}
      >

        {/* TOP CATEGORIES Section */}
        <div className="pt-3 pl-4 pb-1">
          <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">TOP CATEGORIES</span>
        </div>

        <div className="flex flex-col text-[12px] text-gray-600 px-4 pb-4 space-y-1">
          {/* Men's Fashion */}
          <div
            to="/Men's Fashion"
            className="flex items-center gap-3 py-1 px-1 cursor-pointer
             hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0 no-underline text-gray-600"
            onMouseEnter={() => handleMouseEnter("Men's Fashion")}
          >
            <img
              src="https://g.sdlcdn.com/imgs/k/v/x/Men_sitenavigation-b972a.jpg"
              className="w-6 h-6 rounded-full object-cover"
              alt="Men's Fashion"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face";
              }}
            />
            <span>Men's Fashion</span>
          </div>

          {/* Women's Fashion */}
          <div
            className="flex items-center gap-3 py-1 px-1 cursor-pointer
             hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Women's Fashion")}
          >
            <img
              src="https://g.sdlcdn.com/imgs/k/v/x/WoMen_sitenav-5a8ca.jpg"
              className="w-6 h-6 rounded-full object-cover"
              alt="Women's Fashion"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1494790108755-2616c4e69bdc?w=50&h=50&fit=crop&crop=face";
              }}
            />
            <span>Women's Fashion</span>
          </div>

          {/* Home & Kitchen */}
          <div
            className="flex items-center gap-3 py-1 px-1 cursor-pointer
             hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Home & Kitchen")}
          >
            <img
              src="https://g.sdlcdn.com/imgs/k/v/x/HOme_sitenavigation-d7a00.jpg"
              className="w-6 h-6  rounded-full object-cover"
              alt="Home & Kitchen"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=50&h=50&fit=crop";
              }}
            />
            <span>Home & Kitchen</span>
          </div>

          {/* Toys, Kids' Fashion & More */}
          <div
            className="flex items-center gap-3 py-1 px-1 cursor-pointer
             hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Toys, Kids' Fashion & More")}
          >
            <img
              src="https://g.sdlcdn.com/imgs/k/v/x/Toys_Sitenavigation-ef666.jpg"
              className="w-6 h-6 rounded-full object-cover"
              alt="Toys, Kids' Fashion & More"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=50&h=50&fit=crop";
              }}
            />
            <span>Toys, Kids' Fashion & More</span>
          </div>

          {/* Beauty, Health & Daily Care */}
          <div
            className="flex items-center gap-3 py-1 px-1 cursor-pointer
             hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Beauty, Health & Daily Care")}
          >
            <img
              src="https://g.sdlcdn.com/imgs/k/v/x/Beauty_Site_navigation-5f3be.jpg"
              className="w-6 h-6 rounded-full object-cover"
              alt="Beauty, Health & Daily Care"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=50&h=50&fit=crop";
              }}
            />
            <span>Beauty, Health & Daily Care</span>
          </div>
        </div>


        {/* MORE CATEGORIES Section */}
        <div className="pt-3 pl-4 pb-1">
          <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">MORE CATEGORIES</span>
        </div>

        <div className="flex flex-col text-[12px] text-gray-600 px-4  space-y-1">
          {/*Automotives*/}
          <div

            className="flex items-center gap-3 py-1 px-1 cursor-pointer
              hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Automotives")}
          >
            <span>Automotives</span>
          </div>
        </div>
        <div className="flex flex-col text-[12px] text-gray-600 px-4  space-y-1">
          {/*Mobile & Accessories*/}
          <div

            className="flex items-center gap-3 py-1 px-1 cursor-pointer
             hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0 no-underline text-gray-600"
            onMouseEnter={() => handleMouseEnter("Mobile & Accessories")}
          >
            <span>Mobile & Accessories</span>
          </div>
        </div>

        <div className="flex flex-col text-[12px] text-gray-600 px-4  space-y-1">
          {/*Electronics*/}
          <div

            className="flex items-center gap-3 py-1 px-1 cursor-pointer
              hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Electronics")}
          >
            <span>Electronics</span>
          </div>
        </div>
        <div className="flex flex-col text-[12px] text-gray-600 px-4  space-y-1">
          {/*Sports, Fitness & Outdoor*/}
          <div

            className="flex items-center gap-3 py-1 px-1 cursor-pointer
              hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Sports, Fitness & Outdoor")}
          >
            <span>Sports, Fitness & Outdoor</span>
          </div>
        </div>
        <div className="flex flex-col text-[12px] text-gray-600 px-4  space-y-1">
          {/*Computers & Gaming*/}
          <div

            className="flex items-center gap-3 py-1 px-1 cursor-pointer
              hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Computers & Gaming")}
          >
            <span>Computers & Gaming</span>
          </div>
        </div>
        <div className="flex flex-col text-[12px] text-gray-600 px-4 space-y-1">
          {/*Books, Media & Music*/}
          <div

            className="flex items-center gap-3 py-1 px-1 cursor-pointer
              hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Books, Media & Music")}
          >
            <span>Books, Media & Music</span>
          </div>
        </div>
        <div className="flex flex-col text-[12px] text-gray-600 px-4  space-y-1">
          {/*Hobbies*/}
          <div

            className="flex items-center gap-3 py-1 px-1 cursor-pointer
              hover:border-l-2 hover:border-t hover:border-b
             hover:border-l-[#e31e24] hover:border-t-[#d1d5db] hover:border-b-[#d1d5db]
             hover:border-r-0"
            onMouseEnter={() => handleMouseEnter("Hobbies")}
          >
            <span>Hobbies</span>
          </div>
        </div>




        {/* TRENDING SEARCHES Section */}
        <div className="pt-2 pl-4 pb-1 ">
          <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">TRENDING SEARCHES</span>
        </div>

        <div className="flex flex-col text-[11px] text-gray-500 px-4 pb-4 space-y-1 ">
          <Link to="/products/Kitchenware" className="flex items-center py-1 cursor-pointer no-underline text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-search text-gray-400 text-[10px] mr-2"></i>Kitchen Product
          </Link>
          <Link to="/products/Footwear" className="flex items-center py-1 cursor-pointer no-underline text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-search text-gray-400 text-[10px] mr-2"></i>Shoes For Men
          </Link>
            <Link to="/products/Ethnic Wear/Kurtas & Kurtis" className="flex items-center py-1 cursor-pointer no-underline text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-search text-gray-400 text-[10px] mr-2"></i>Kurti Set
          </Link>
          <Link to="/products/Footwear/Sandals & Floaters" className="flex items-center py-1 cursor-pointer no-underline text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-search text-gray-400 text-[10px] mr-2"></i>Sandal Men
          </Link>
          <Link to="/products/Footwear/Sports Shoes" className="flex items-center py-1 cursor-pointer mb-8 no-underline text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-search text-gray-400 text-[10px] mr-2"></i>Sport Shoe Men
          </Link>
        </div>



      </div>

      {/* Fixed Hover Dropdown Menu */}
      {hoveredCategory && categoryData[hoveredCategory] && (
        <div
          className="absolute left-[269px] top-0 bg-white border border-gray-200 shadow-xl z-50 w-[700px] min-h-[400px] flex"
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        >
          {/* Categories Section */}
          <div className="flex-1 px-4 py-3">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 h-full">
              {Object.entries(categoryData[hoveredCategory])
                .filter(([subcategory, items]) => items.length > 0)
                .map(([subcategory, items], index) => (
                  <div key={index} className="min-w-0">
                    <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-wide mb-2 pb-1 border-b border-gray-200 truncate">
                      {subcategory}
                    </h4>
                    <div className="space-y-0.5">
                      {items.slice(0, 8).map((item, itemIndex) => {
                        // Define special routing for Men's Fashion clothing items
                        let linkPath;
                        if (hoveredCategory === "Men's Fashion" && subcategory === "CLOTHING") {
                          switch (item) {
                            case "Shirts":
                              linkPath = "/products/Men's Fashion/Shirts";
                              break;
                            case "T-Shirts & Polos":
                              linkPath = "/products/Men's Fashion/T-Shirts";
                              break;
                            case "Jeans":
                              linkPath = "/products/Men's Fashion/Jeans";
                              break;
                            default:
                              linkPath = `/products/Men's Fashion`;
                          }
                        } else if (hoveredCategory === "Men's Fashion" && subcategory === "FOOTWEAR") {
                            switch (item) {
                            case "Sports Shoes":
                              linkPath = "/products/Footwear/Sports Shoes";
                              break;
                            case "Casual Shoes":
                              linkPath = '/products/Footwear/Casual Shoes'
                              break;
                            case "Slippers & Flip Flops":
                              linkPath ='/products/Footwear/Slippers & Flip Flops'
                              break;
                            case "Sandals & Floaters":
                              linkPath ='/products/Footwear/Sandals & Floaters'
                              break;
                            default:
                              linkPath = '/products/Footwear'
                          }


                        }
                        else if (hoveredCategory === "Women's Fashion") {
                          if (subcategory === "ETHNIC WEAR") {
                            switch (item) {

                              case "Sarees":
                                linkPath = "/products/Ethnic Wear/Sarees"
                                break;
                               case "Kurtas & Kurtis":
                                linkPath = "/products/Ethnic Wear/Kurtas & Kurtis"
                                break;
                            

                              default:
                                linkPath = "/products/Ethnic Wear"
                            }
                          }

                          
                          else if (subcategory === "FOOTWEAR"){
                            switch (item) {
                              case "Heels":
                                linkPath = "/products/WomenFootwear/Heels"
                                break;
                              default:
                                linkPath = "/products/WomenFootwear"
                            }
                          }
                          

                            else{
                            linkPath = `/product/${encodeURIComponent(subcategory)}`;
                            }

                         }
                        else if (hoveredCategory === "Home & Kitchen") {
                          if (subcategory === "KITCHEN APPLIANCES") {
                            switch (item) { 
                              case "Juicer Mixer Grinders":
                                linkPath = "/products/KitchenAppliances/Juicer Mixer Grinders"
                                break;

                                default:
                                linkPath = "/products/KitchenAppliances"
                            }
                          }
                          else if (subcategory === "KITCHENWARE") {
                            switch (item) {
                              case "Pressure Cookers":
                                linkPath = "/products/Kitchenware/Pressure Cookers"
                                break;
                                default:
                                linkPath = "/products/Kitchenware"
                           }
                          }
                        }
                       else if (hoveredCategory === "Toys, Kids' Fashion & More") {

                       }
                        else {
                        linkPath = `/product/${encodeURIComponent(item)}`;
                        }

                      return (
                      <Link
                        key={itemIndex}
                        to={linkPath}
                        className={`block text-[10px] py-0.5 leading-tight truncate no-underline transition-colors ${item === "View All"
                          ? "text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                          : "text-gray-600 hover:text-black"
                          }`}
                        title={item}
                      >
                        {item === "View All" ? (
                          <>
                            <span>View All</span>
                            <span className="ml-1 mb-1 text-lg transform transition-transform duration-200 group-hover:translate-x-1">›</span>
                          </>
                        ) : (
                          item
                        )}
                      </Link>
                      );
                      })}
                      {items.length > 8 && (
                        <Link
                          to={hoveredCategory === "Men's Fashion" && subcategory === "CLOTHING"
                            ? "/product/mens-fashion"
                            : `/product/${encodeURIComponent(subcategory)}`}
                          className="flex items-center text-[10px] text-blue-400 font-medium transition-colors py-0.5 no-underline group"
                        >
                          <span>View All</span>
                          <span className="ml-1 mb-1 text-lg transform transition-transform duration-200 group-hover:translate-x-1">›</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Promotional Image Section */}
          <div className="w-[180px] bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center border-l border-gray-200 px-3 py-4">
            {hoveredCategory === "Men's Fashion" && (
              <div className="text-center">
                <img
                  src={mens}
                  alt="Men's Fashion"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />

              </div>
            )}

            {hoveredCategory === "Women's Fashion" && (
              <div className="text-center">
                <img
                  src={womens}
                  alt="Women's Fashion"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />

              </div>
            )}

            {hoveredCategory === "Home & Kitchen" && (
              <div className="text-center">
                <img
                  src={sidehome}
                  alt="Home & Kitchen"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />

              </div>
            )}

            {hoveredCategory === "Toys, Kids' Fashion & More" && (
              <div className="text-center">
                <img
                  src={toy}
                  alt="Kids Fashion"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />

              </div>
            )}

            {hoveredCategory === "Beauty, Health & Daily Care" && (
              <div className="text-center">
                <img
                  src={beauty}
                  alt="Beauty Products"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />

              </div>
            )}

            {hoveredCategory === "Automotives" && (
              <div className="text-center">
                <img
                  src={automotive}
                  alt="Automotives"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />
              </div>
            )}
            {hoveredCategory === "Mobile & Accessories" && (
              <div className="text-center">
                <img
                  src={mobile}
                  alt="Mobile & Accessories"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />
              </div>
            )}{hoveredCategory === "Electronics" && (
              <div className="text-center">
                <img
                  src={Electronics}
                  alt="Electronics"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />
              </div>
            )}{hoveredCategory === "Sports, Fitness & Outdoor" && (
              <div className="text-center">
                <img
                  src={sports}
                  alt="Sports, Fitness & Outdoor"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />
              </div>
            )}{hoveredCategory === "Computers & Gaming" && (
              <div className="text-center">
                <img
                  src={computers}
                  alt="Computers & Gaming"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />
              </div>
            )}{hoveredCategory === "Books, Media & Music" && (
              <div className="text-center">
                <img
                  src={books}
                  alt="Books, Media & Music"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />
              </div>
            )}{hoveredCategory === "Hobbies" && (
              <div className="text-center">

                <img
                  src={hobbies}
                  alt="Hobbies"
                  className="w-40 h-120 object-cover rounded-lg shadow-md mb-3"
                />

              </div>
            )}


          </div>
        </div>
      )}

      {/* QR Code Section */}
      <div className="flex items-center bg-[#f7f7f7] px-4 py-3 border-t  mt-15 ml-10 border-gray-100">
        <img src={qrcode} alt="QR Code" className="w-16 h-16 mr-3" />
        <div className='pb-6 '>
          <p className="text-[11px] font-medium text-gray-700 mb-1 mt-5">Enjoy Convenient Order Tracking</p>
          <span className="text-[9px] text-gray-500">scan to download app</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
