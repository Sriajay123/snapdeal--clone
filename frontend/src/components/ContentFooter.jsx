
import { Link } from 'react-router-dom'    
const contentData = [
  {
    heading: "POLICY INFO",
    links: [
      "Privacy Policy",
      "Terms of Sale", 
      "Terms of Use",
      "Report Abuse & Takedown Policy",
      "Know Your BIS Standard",
      "Products Under Cumpulsory BIS",
      "Certification",
       "FAQ",
    ],
  },
  {
    heading: "COMPANY",
    links: ["About Us", "Careers", "Blog", "Sitemap","Contact Us"],
  },
  {
    heading: "SNAPDEAL BUSINESS", 
    links: [
      "Shopping App",
      "Sell on Snapdeal",
    
      "Media Enquiries", 
      
    ],
  },

  {
    heading: "POPULAR LINKS",
    links: [
      "Lehenga",
      "Kids Clothing",
      "Sarees",
      "Winter Wear",
      "Sweatshirts"
    ],
  },
  
];

function ContentFooter() {
  return (
    <div className="bg-white py-12 border-b border-gray-200 rounded-sm shadow-xs">
      <div className="max-w-screen-xl mx-auto px-5 ml-8 flex justify-between ">
        <div className="flex justify-between w-full max-w-4xl">
        {contentData.map((item, index) => {
          return (
            <div key={index} className=" text-[#e8ecef] min-w-0 flex-1">
              <div>
                <p className="text-sm pb-4 uppercase font-medium text-gray-700">
                  {item.heading}
                </p>
                <ul >
                  {item.links.map((link, i) => {
                    return (
                      <li key={i} className="h-5 mb-1">
                        <Link 
                          to="#" 
                          className="text-gray-500 no-underline text-xs m-0 p-0 hover:text-black hover:underline transition-colors"
                        >
                          {link}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
        </div>
        
        <div className="mr-0">
          <p className="text-sm text-gray-700 pb-4 uppercase font-medium">
            SUBSCRIBE
          </p>
          <div className='flex'>
          <input
            className="text-xs border border-gray-300 py-2 px-3 mb-2 w-60 focus:outline-none "
            type="text"
            placeholder="Your email address"
          />
          <button className="block bg-[#3F3F3F] text-white text-xs py-2 px-6 mb-2 hover:bg-black transition-colors">
            SUBSCRIBE
          </button>
           </div>
          <p className="text-xs text-gray-500 mb-1">
            Register now to get updates on promotions and coupons.
          </p>
        
         
       
            <Link to="https://play.google.com/store/apps/details?id=com.snapdeal.main" className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
              Or Download App
            </Link>
      
        </div>
      </div>
    </div>
  )
}

export default ContentFooter