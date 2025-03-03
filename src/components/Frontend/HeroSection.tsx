"use client"
import { Lookup } from '@/constants/lookup'
import React, { useState } from 'react'
import { FaArrowRight } from "react-icons/fa6";


const HeroSection = () => {
    const [userInput , setUserInput] = useState<string>('');
  return (
    <div className='h-[89vh] w-full bg-white flex justify-center items-center flex-col '>
        <div className='flex flex-col gap-4 justify-center items-center py-4'>
        <h2 className='text-5xl font-bold'>{Lookup.HERO_HEADING}</h2>
        <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>
        </div>
        <div className="border rounded-xl p-5 max-w-2xl w-full">
    <div className="flex items-center h-20">
        <textarea 
            placeholder={Lookup.INPUT_PLACEHOLDER} 
            className="outline-none w-full h-full resize-none"
            onChange={(event) => setUserInput(event.target.value)}
        />
        {userInput && <FaArrowRight className="ml-4 text-blue-600 h-5 cursor-pointer" />}
    </div>
</div>
    </div>
  )
}

export default HeroSection