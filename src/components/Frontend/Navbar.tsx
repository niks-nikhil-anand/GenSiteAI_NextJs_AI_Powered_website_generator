"use client"
import React from 'react'
import { Button } from '../ui/button'
import { COLORS } from '../../constants/colors'
import Link from 'next/link'
import { useAuth, useClerk } from '@clerk/nextjs'

const Navbar = () => {
  const { userId } = useAuth();
  const { signOut } = useClerk()
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
            <Link href={"/profile"}>
              <Button className='cursor-pointer'>Profile</Button>
            </Link>
            <Button
              className="bg-red-500 text-white cursor-pointer hover:bg-red-600"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        )}

      </div>
    </div>
  )
}

export default Navbar
