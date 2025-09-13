import React from 'react'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Carousel from '../components/Carousel'
import Delivery from '../components/Delivery'
import Header from '../components/Header'

import TrendingProducts from '../components/TrendingProducts'
import RecentlyViewedProducts from '../components/RecentlyViewedProducts'
import Banner from '../components/Banner'
import CustomerTrustSection from '../components/CustomerTrustSection'
import ContentFooter from '../components/ContentFooter'
import PaymentFooter from '../components/PaymentFooter'
import Footer from '../components/Footer'
function Home() { 
  
  
  return ( 
    <div className='bg-[#f7f7f7]'>
      <Header />
      <Navbar />
      <div className='pt-4 flex gap-4'>
        <Sidebar />
        <div className='flex flex-col w-full'>
          <div className='flex w-full gap-4'>
            <Carousel />
            <Delivery />
          </div>
          <RecentlyViewedProducts  />
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


