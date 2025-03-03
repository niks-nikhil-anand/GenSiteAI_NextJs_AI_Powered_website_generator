import React from 'react'
import { Button } from '../ui/button'
import { COLORS } from '../../constants/colors' // Import COLORS

const Navbar = () => {
  return (
    <div className='flex justify-between py-4 px-7'>
      <div>
        <h1 className='text-lg font-bold font-serif hover:underline cursor-pointer'>WebGenie</h1>
      </div>
      <div className='flex gap-4'>
        <Button className='cursor-pointer'>Sign In</Button>
        <Button className='text-white cursor-pointer' style={{ backgroundColor: COLORS.primaryBlue}}>
          Get Started
        </Button>
      </div>
    </div>
  ) 
}

export default Navbar
