import React from 'react'
import paymentIcon from '../assets/paymentImg.png'
import trustIcon from '../assets/trust.png'
import helpIcon from '../assets/help.png'
import shopMobileIcon from '../assets/shop.png'

const FootData = [
    {
      icon: paymentIcon,
      heading: "100% Secure Payments",
      para: "Moving your card details to a much more secured place",
    },
    {
      icon: trustIcon,
      heading: "TrustPay",
      para: "100% Payment Protection. Easy Return Policy ",
    },
    {
      icon: helpIcon,
      heading: "Help Center",
      para:
        "Got a question? Look no further. Browse our FAQs or submit your query here.",
    },
    {
      icon: shopMobileIcon,
      heading: "Shop on the Go",
      para:
        "Download the app and get exciting app only offers at your fingertips",
    },
  ];

function CustomerTrustSection() {
  return (
    <div className="bg-white mt-12 border-t border-b border-gray-300" style={{height: '201px'}}>
      <div className="flex h-full">
        {FootData.map((foot, i) => {
          const isFirst = i === 0;
          const isLast = i === FootData.length - 1;
          return (
            <div 
              key={i} 
              className={`border-r border-gray-300 cursor-pointer h-full flex-1 ${
                isFirst ? 'ml-10 border-l' : 'border-l'
              } ${isLast ? 'mr-10' : ''}`}
            >
              <div className="flex flex-col items-center justify-center px-6 h-full">
                <img className="h-12 w-12 mb-4" src={foot.icon} alt={foot.heading} />
                <p className="font-semibold text-sm text-gray-800 uppercase mb-3 text-center">
                  {foot.heading}
                </p>
                <p className="text-xs text-gray-500 text-center leading-relaxed px-2">
                  {foot.para}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default CustomerTrustSection