
import social from '../assets/social.png'
import leaves from '../assets/leaves.png'
import googleplay from '../assets/playstore.png'
import appstore from '../assets/appstore.png'       
import { Link } from 'react-router-dom'

function Banner() {
  return (
    <div className='flex border border-[#f6f6f6] rounded-sm bg-white shadow-sm mt-3 mb-4 ml-10 mr-10'>
        <div>
        <img src={social} alt="banner" className='w-full h-[80px] ml-30 mt-12 mb-4' style={{width:"430px" ,height:"462px"}}/>
        </div>
        <div width="456px" height="462px">
            <div className='flex'>
           <p className='font-bold text-[45px] text-[#222222] mt-50 ml-60 mr-35'>Download Snapdeal App Now</p>
           <img src ={leaves} style={{width:"180px" ,height:"250px"}}></img>
           </div>
           <div className='flex flex-col ml-60 mt-8 text-[#98868f]'>
             <p className='text-[18px]'>Fast, Simple & Delightful.</p>
             <p className=' mt-2 text-[18px]'>All it takes is 30 seconds to Download.</p>
           </div>
           <div className='flex mt-8 ml-60 gap-2'>
            <Link to="https://play.google.com/store/apps/details?id=com.snapdeal.main&utm_source=mobileAppLp&utm_campaign=android&pli=1"  target="_blank"  rel="noopener noreferrer">
              <img src={googleplay} style={{width:"180px" ,height:"50px"}}></img>
            </Link>
            <Link to="https://apps.apple.com/in/app/snapdeal-shopping-app-online/id721124909?ls=1&utm_campaign=ios&utm_source=mobileAppLp"  target="_blank"  rel="noopener noreferrer">

              <img src={appstore}  style={{width:"180px" ,height:"50px"}}></img>
              </Link>
           </div>
          
        </div>

    </div>
  )
}

export default Banner