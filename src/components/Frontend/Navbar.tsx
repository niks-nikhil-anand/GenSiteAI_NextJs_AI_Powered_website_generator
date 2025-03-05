import React from 'react'
import { Button } from '../ui/button'
import { COLORS } from '../../constants/colors' // Import COLORS
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='flex justify-between py-4 px-7 bg-gray-100'>
      <div>
        <Link href={"/"} >
        <h1 className='text-lg font-bold font-serif hover:underline cursor-pointer'>WebGenie</h1>
        </Link>
      </div>
      <div className='flex gap-4'>
        <Link href={"/sign-in"}>
        <Button className='cursor-pointer'>Sign In</Button>
        </Link>
        <Link href={"/sign-up"}>
        <Button className='text-white cursor-pointer' style={{ backgroundColor: COLORS.primaryBlue}}>
          Get Started
        </Button>
        </Link>
      </div>
    </div>
  ) 
}

export default Navbar
