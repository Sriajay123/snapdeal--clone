import React from 'react'
import paymenta from '../assets/paymentsec.png'
import facebook from '../assets/facebook.png'
import twitter from '../assets/twitter.png'
import youtube from '../assets/youtube.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/linkedin.png'
import telegram from '../assets/telegram.png'
import whatsapp from '../assets/whatsapp.png'

const socialIcons = [facebook ,twitter,instagram,linkedin,youtube,telegram,whatsapp];

function PaymentFooter() {
  return (
    <div className='bg-white w-full border-b border-gray-300 py-6 flex  border-b border-gray-200 rounded-sm shadow-xs text-[#344C55] text-[14px]' > 
        <div className='ml-14' >
           <p className=''>Payment</p> 
          <img className='h-8 mt-4' src={paymenta} alt="Payment Methods"  style={{height:"45px", width:"300px"}} />
        </div>
        <div className='ml-60' >
            <p>Connect</p>
             <div className='flex gap-2 mt-4 '>
                {
                socialIcons.map((icon,index)=>{
                   return <img src={icon} alt="social"  style={{height:"35px", width:"35px"}}/>
                })
                }




                             
              
             </div>
         </div>


    </div>
  )
}

export default PaymentFooter