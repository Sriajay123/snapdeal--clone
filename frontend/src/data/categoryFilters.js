const categoryFilters = {
  "Men's Fashion": {

    default: {
      // Default filters for Men's Fashion when no subcategory is selected
      priceRange: {
        min: 103,
        max: 2289,
        name: 'Price'
      },

      Swagostav:{
        name:'Swagostav',
        options:['Diwali2025',' MissionSwagostav99']
      },
      
      color: {
        name: 'Color',
        options: ['Black', 'Blue', 'White', 'Grey', 'Red']
      },
      brand: {
        name: 'Brand',
        options: ['Levi\'s', 'Peter England', 'Allen Solly', 'Van Heusen', 'Louis Philippe']
      },
      fabric:{
        name:'Fabric',
       options: ['100 Percent Cotton','100 Percent Cotton Fleece28','100 Percent Cotton Terry']

      },
      size:{
        name:'Size',
        options:['1.2 Metre','1.3Metre','1.6 Metre','100 - 105 Cms']
      },
      sleevelength:{
        name:'Sleeves Length',
        options:['3/4th Sleeves','Full Sleeve','Half Sleeves','Rollup Sleeves']
      },
      discount:{
        name:'Discount %',
        options:['0-10','10-20','30-40','40-50']
      }
      

    },
    subcategories: {
      
      'Jeans': {
        'pattern or print type':{
            name:'Pattern or Print Type',
            options:['Abstract','Ombre','Solid','Tie & Dye']
        },
        color: {
        name: 'Color',
        options: ['Black', 'Blue', 'White', 'Grey', 'Red']
      },


        size: {
          name: 'Size',
          options: ['28', '30', '32', '34', '36', '38', '40']
        },
       
        fit: {
          name: 'Fit Type',
          options: ['Baggy Fit','Boyfriend Fit','Dad Fit','Jogger Fit','Loose Fit']
        },
        brand: {
          name: 'Brand',
          options: ['Levi\'s', 'Lee', 'Wrangler', 'Pepe Jeans', 'Diesel']
        },
        wash: {
          name: 'Wash',
          options: ['Light', 'Medium', 'Dark', 'Acid', 'Raw']
        },
        discount:{
        name:'Discount %',
        options:['0-10','10-20','30-40','40-50']
      }
      },

      'T-Shirts':{
        swagostav:{
        name:'Swagostav',
        options:['Diwali2025',' MissionSwagostav99']
      },
      
      color: {
        name: 'Color',
        options: ['Black', 'Blue', 'White', 'Grey', 'Red']
      },
      brand: {
        name: 'Brand',
        options: ['Levi\'s', 'Peter England', 'Allen Solly', 'Van Heusen', 'Louis Philippe']
      },
      size:{
        name:'Size',
        options:['S','M','L','XL','2XL']
      },
      fabric:{
        name:"Fabric",
        options:['Cotton','Cotton Blend','Cotton Nylon','Elastane','Lycra']
      },
      discount:{
        name:'Discount %',
        options:['0-10','10-20','30-40','40-50']
      }

      },

      'Shirts':{
         color: {
        name: 'Color',
        options: ['Black', 'Blue', 'White', 'Grey', 'Red']
      },
      brand: {
        name: 'Brand',
        options: ['Levi\'s', 'Peter England', 'Allen Solly', 'Van Heusen', 'Louis Philippe']
      },
      size:{
        name:'Size',
        options:['S','M','L','XL','2XL']
      },
      fabric:{
        name:"Fabric",
        options:['Cotton','Cotton Blend','Cotton Nylon','Elastane','Lycra']
      },
      discount:{
        name:'Discount %',
        options:['0-10','10-20','30-40','40-50']
      }

      },
      'backpack': {
        capacity: {
          name: 'Capacity',
          options: ['15L', '20L', '25L', '30L', '35L']
        },
        material: {
          name: 'Material',
          options: ['Polyester', 'Nylon', 'Canvas', 'Leather']
        },
        usage: {
          name: 'Usage',
          options: ['Casual', 'Travel', 'Laptop', 'Hiking', 'School']
        },
        brand: {
          name: 'Brand',
          options: ['American Tourister', 'Wildcraft', 'Skybags', 'Safari', 'Nike']
        }
      }
    }
  },
 
  // "Kitchenware": {
  //   default: {
  //     priceRange: {     

  //       min: 103,
  //       max: 2289,
  //       name: 'Price' 
  //     },
  //     swagostav:{
  //       name:'Swagostav', 
  //       options:['Diwali2025',' MissionSwagostav99']
  //     }
  //   },
  //   subcategories: {
  //     'Pressure Cookers': {
  //       capacity: {
  //         name: 'Capacity',
  "Footwear": {
    default: {
      priceRange: {
        min: 103, 
        max: 2289,
        name: 'Price'
      },
      Swagostav:{
        name:'Swagostav',
        options:['Diwali2025',' MissionSwagostav99']
      },
      
      color: {
        name: 'Color',
        options: ['Black', 'Blue', 'White', 'Grey', 'Red']
      },

      size: {
          name: 'Size',
          options: ['6', '7', '8', '9', '10', '11', '12']
        },
       
        brand: {
          name: 'Brand',
          options: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour']
        },

        discount:{
        name:'Discount %',
        options:['0-10','10-20','30-40','40-50']
      },
    },
      subcategories: {
      'Sports Shoes': {
        cushioning:{
            name:'Cushioning',
            options:['High','Medium','Low']
        }

      }
      },
      

    
  },
  "Women's Fashion": {
    default: {
      priceRange: {
        min: 103,
        max: 2289,
        name: 'Price'
      },
      swagostav:{
        name:'Swagostav',
        options:['Diwali2025',' MissionSwagostav99']
      },
      brand:{
        name:'Brand',
         options:['Aurelia','Biba','W','Libas','Global Desi']
      },
      color: {
        name: 'Color',
        options: ['Black', 'Blue', 'White', 'Grey', 'Red']
      },
      
      sleevelength:{
        name:'Sleeves Length',
        options:['3/4th Sleeves','Full Sleeve','Half Sleeves','Rollup Sleeves']
      },
      discount:{
        name:'Discount %',
        options:['0-10','10-20','30-40','40-50']
      }
    },
    subcategories: {
      'Sarees': {
        fabric: {
          name: 'Fabric',
          options: ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Crepe']
        },
        style: {
          name: 'Style',
          options: ['Traditional', 'Designer', 'Contemporary', 'Bridal']
        },
        work: {
          name: 'Work',
          options: ['Embroidered', 'Printed', 'Zari', 'Handloom', 'Banarasi']
        },
        occasion: {
          name: 'Occasion',
          options: ['Wedding', 'Party', 'Festive', 'Daily Wear']
        }
      },
      'Kurtis': {
        size: {
          name: 'Size',
          options: ['S', 'M', 'L', 'XL', 'XXL']
        },
        length: {
          name: 'Length',
          options: ['Knee Length', 'Mid Length', 'Long', 'Ankle Length']
        },
        pattern: {
          name: 'Pattern',
          options: ['Printed', 'Embroidered', 'Plain', 'Embellished']
        },
        sleeve: {
          name: 'Sleeve',
          options: ['Full Sleeve', 'Half Sleeve', '3/4th Sleeve', 'Sleeveless']
        }
      }
    }
  },
  'Electronics': {
    default: {
      priceRange: {
        min: 103,
        max: 2289,
        name: 'Price'
      },
      brand: {
        name: 'Brand',
        options: ['Samsung', 'Apple', 'OnePlus', 'Mi', 'Realme']
      },
      rating: {
        name: 'Rating',
        options: ['4★ & above', '3★ & above', '2★ & above']
      },
      discount: {
        name: 'Discount',
        options: ['10% or more', '20% or more', '30% or more', '50% or more']
      }
    },
    subcategories: {
      'Mobile Phones': {
        ram: {
          name: 'RAM',
          options: ['4 GB', '6 GB', '8 GB', '12 GB']
        },
        storage: {
          name: 'Storage',
          options: ['64 GB', '128 GB', '256 GB', '512 GB']
        },
        processor: {
          name: 'Processor',
          options: ['Snapdragon', 'MediaTek', 'Apple A Series', 'Exynos']
        },
        battery: {
          name: 'Battery',
          options: ['3000-4000 mAh', '4000-5000 mAh', '5000+ mAh']
        }
      },
      'Laptops': {
        processor: {
          name: 'Processor',
          options: ['Intel i3', 'Intel i5', 'Intel i7', 'AMD Ryzen']
        },
        ram: {
          name: 'RAM',
          options: ['4 GB', '8 GB', '16 GB', '32 GB']
        },
        storage: {
          name: 'Storage',
          options: ['256 GB SSD', '512 GB SSD', '1 TB HDD', '1 TB SSD']
        },
        brand: {
          name: 'Brand',
          options: ['HP', 'Dell', 'Lenovo', 'Asus', 'Apple']
        }
      }
    }
  }
};

// Export the filters
export default categoryFilters;