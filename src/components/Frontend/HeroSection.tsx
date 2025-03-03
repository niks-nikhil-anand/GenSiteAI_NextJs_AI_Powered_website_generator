"use client"
import { Lookup } from '@/constants/lookup'
import React, { useState } from 'react'
import { FaArrowRight } from "react-icons/fa6";


const HeroSection = () => {
    const [userInput, setUserInput] = useState<string>('');
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
                    {userInput && (
                        <button
                            className="ml-4 bg-blue-600 text-white px-2 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                            aria-label="Submit"
                        >
                            <FaArrowRight className="h-5 w-5" />
                        </button>
                    )}                </div>
            </div>
            <div className='flex flex-wrap gap-5 max-w-2xl items-center justify-center my-4'>
                {Lookup.WebsiteIdeas.map((idea, index) => (
                    <div
                        key={index}
                        className='bg-gray-100 px-2 py-1 rounded-lg text-sm border cursor-pointer hover:bg-gray-200 transition-colors duration-200'
                        role='button'
                        tabIndex={0}
                    >
                        {idea}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default HeroSection