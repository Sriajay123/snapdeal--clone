import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Carousel from '../components/Carousel'
import Delivery from '../components/Delivery'
import Header from '../components/Header'
import { hideSuccessNotification } from '../store/notificationSlice'

import TrendingProducts from '../components/TrendingProducts'
import RecentlyViewedProducts from '../components/RecentlyViewedProducts'
import Banner from '../components/Banner'
import CustomerTrustSection from '../components/CustomerTrustSection'
import ContentFooter from '../components/ContentFooter'
import PaymentFooter from '../components/PaymentFooter'
import Footer from '../components/Footer'
function Home() { 
  const dispatch = useDispatch();
  const { showSuccess, message } = useSelector((state) => state.notification);
  
  return ( 
    <div className='bg-[#f7f7f7]'>
      <Header />
      <Navbar />
      {showSuccess && (
        <div className="relative bg-emerald-500 text-white py-4 px-6 flex items-center justify-between z-50 mx-auto max-w-7xl mt-4 rounded-md">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{message}</span>
          </div>
          <button 
            onClick={() => dispatch(hideSuccessNotification())}
            className="text-white hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className='pt-4 flex gap-4'>
        <Sidebar />
        <div className='flex flex-col w-full'>
          <div className='flex w-full gap-4'>
            <Carousel />
            <Delivery />
          </div>
          <RecentlyViewedProducts/>
        </div>
      </div>
      <TrendingProducts className="mt-[50px]" />
      <Banner/>
      <CustomerTrustSection />
      <ContentFooter />
      <PaymentFooter/>
      <Footer/>
   
    </div>
  )

}

export default Home;


