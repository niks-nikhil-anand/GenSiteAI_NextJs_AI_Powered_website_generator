import React from 'react'

const Footer = () => {
  return (
    <footer className='flex justify-center items-center  text-gray-600 text-sm'>
      <h1>© {new Date().getFullYear()} <span className='hover:underline font-bold'>WebGenie</span> - AI-Powered Website Generator. All Rights Reserved.</h1>
    </footer>
  )
}

export default Footer
