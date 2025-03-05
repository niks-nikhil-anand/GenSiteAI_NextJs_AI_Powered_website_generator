"use client"
import React from 'react'
import { Button } from '../ui/button'
import { COLORS } from '../../constants/colors'
import Link from 'next/link'
import { useAuth, useClerk, UserButton } from '@clerk/nextjs'


const Navbar = () => {
  const { userId } = useAuth();
  return (
    <div className='flex justify-between py-4 px-7 bg-gray-100'>
      <div>
        <Link href={"/"} >
          <h1 className='text-lg font-bold font-serif hover:underline cursor-pointer'>WebGenie</h1>
        </Link>
      </div>
      <div className='flex gap-4'>
        {!userId ? (
          <>
            <Link href={"/sign-in"}>
              <Button className='cursor-pointer'>Sign In</Button>
            </Link>
            <Link href={"/sign-up"}>
              <Button className='text-white cursor-pointer' style={{ backgroundColor: COLORS.primaryBlue }}>
                Get Started
              </Button>
            </Link>
          </>
        ) : (
          <>
            <UserButton/>
          </>
        )}

      </div>
    </div>
  )
}

export default Navbar
