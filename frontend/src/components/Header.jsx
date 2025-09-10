import React from 'react';

function Header() {
    return (
        <div className='bg-[#c6003d] flex  items-center justify-between px-4 py-1'>
            <div className='text-xs text-white ml-17' >
                <span>India's leading online shopping destination</span>
            </div>
            <div>
                <ul className='flex space-x-6  text-xs text-white items-center'>
                    <li className="cursor-pointer">Our Blog</li>
                    <li className="cursor-pointer">Help Center</li>
                    <li className="cursor-pointer">Sell On Snapdeal</li>
                    <li className="cursor-pointer mr-15  flex  items-center gap-1">
                        <img className="h-5 w-3" src="https://i4.sdlcdn.com/img/platinum09/downloadappicon2ndsep.png" alt="Download App" />
                        Download App
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;