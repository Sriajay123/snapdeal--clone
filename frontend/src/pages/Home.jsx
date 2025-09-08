import React from 'react'

import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Carousel from '../components/Carousel'


function Home() { 
  
  
  return ( 
  <div> 
    <Header/> 
    <Navbar/>
     <div className='bg-[#f7f7f7] pt-4 flex gap-4'> 
      <Sidebar/> 
      <Carousel/>
       
      </div> 
          
       </div> 
      ) 

}

export default Home;


