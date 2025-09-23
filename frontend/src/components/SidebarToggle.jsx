import React, { useState } from 'react';
import Sidebar from './Sidebar';

const SidebarToggle = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative">
      {/* Hamburger Menu Icon */}
      <div 
        className="cursor-pointer flex items-center gap-2 hover:text-[#e40046] text-white"
        onMouseEnter={() => setShowSidebar(true)}
        onMouseLeave={() => setShowSidebar(false)}
      >
        <div className="flex flex-col gap-1">
          <div className="w-5 h-0.5 bg-white"></div>
          <div className="w-5 h-0.5 bg-white"></div>
          <div className="w-5 h-0.5 bg-white"></div>
        </div>
       
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div 
          className="fixed left-0 top-[60px] z-50"
          onMouseEnter={() => setShowSidebar(true)}
          onMouseLeave={() => setShowSidebar(false)}
        >
          <Sidebar 
            isHoverState={true} 
            onProductClick={() => setShowSidebar(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SidebarToggle;