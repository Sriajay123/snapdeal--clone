function Sidebar() {
    return (

        <div className="w-[200px] h-[625px] ml-[90px] border border-[#f6f6f6] rounded-sm bg-white shadow-sm">

            <div className="pt-2 pl-6">
                <span className="text-[11px] text-[#333333] ">TOP CATEGORIES</span>
            </div>
               <div className="flex flex-col text-[12px] text-[#666666] pt-2 pl-4 pb-[30px] space-y-2"> 
                <span className="bg-[url('https://g.sdlcdn.com/imgs/k/v/x/Men_sitenavigation-b972a.jpg')] bg-no-repeat bg-left bg-contain pl-8 py-1 inline-block"> Men's Fashion </span>
                 <span className="bg-[url('https://g.sdlcdn.com/imgs/k/v/x/WoMen_sitenav-5a8ca.jpg')] bg-no-repeat bg-left bg-contain pl-8 py-1 inline-block " >Women'sFashion</span> 
                <span className="bg-[url('https://g.sdlcdn.com/imgs/k/v/x/HOme_sitenavigation-d7a00.jpg')] bg-no-repeat bg-left bg-contain pl-8 py-1 inline-block">Home & Kitchen</span> 
                <span className="bg-[url('https://g.sdlcdn.com/imgs/k/v/x/Toys_Sitenavigation-ef666.jpg')] bg-no-repeat bg-left bg-contain pl-8 py-1 inline-block">Toys,Kids Fashion &m...</span> 
                <span className="bg-[url('https://g.sdlcdn.com/imgs/k/v/x/Beauty_Site_navigation-5f3be.jpg')] bg-no-repeat bg-left bg-contain pl-8 py-1">Beauty,Health&Daily...</span> 
                </div>
              <div className="pt-2 pl-6">
                <span className="text-[11px] text-[#333333] ">More Categories</span>
            </div>
               <div className="flex flex-col text-[12px] text-[#666666] pt-2 pl-4  space-y-3 ml-2"> 
                <span> Automotives</span>
                 <span >Women'sFashion</span> 
                <span>Home & Kitchen</span> 
                <span >Toys,Kids Fashion &m...</span> 
                <span >Beauty,Health&Daily...</span> 
                </div>  

                 <div className="pt-4 pl-6">
                <span className="text-[11px] text-[#333333] ">Trending Searches</span>
                 </div>

                <div className="flex flex-col text-[12px] text-[#666666] pt-2 pl-4  space-y-3 ml-2"> 
            
                 <span className="cursor-pointer"><i className="fa-solid fa-search text-white-300 text-md mr-2"></i>Kitchen Product</span>
                   <span  className="cursor-pointer"><i className="fa-solid fa-search text-white-300 text-md mr-2"></i>Shoes For Men</span> 
                     <span  className="cursor-pointer"><i className="fa-solid fa-search text-white-300 text-md mr-2"></i>Kurti Set</span> 
                       <span  className="cursor-pointer"><i className="fa-solid fa-search text-white-300 text-md mr-2"></i>Sandal Men</span> 
                         <span  className="cursor-pointer"><i className="fa-solid fa-search text-white-300 text-md mr-2"></i>Sport Shoe Men</span> 
               
              
                </div>    
        </div>

    );
}

export default Sidebar;
