import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../Components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT '} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col jsutify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} className='w-full md:max-w-[480px] ' alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>42/43,Joy Narayan Babu Ananda <br/>Dutta Lane, Howrah-1</p>
          <p className='text-gray-500'>Tel: (415) 555-0132 <br/> email: admin@forever.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black rounded-sm px-5 py-2 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default Contact
