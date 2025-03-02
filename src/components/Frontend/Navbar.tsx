import React from 'react'
import { Button } from '../ui/button'

const Navbar = () => {
  return (
    <div>
        <div>
            <h1>WebGenie</h1>
        </div>
        <div>
            <Button>SignIn</Button>
            <Button>Get Started</Button>
        </div>
    </div>
  )
}

export default Navbar