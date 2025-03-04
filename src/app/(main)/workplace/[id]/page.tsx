import ChatView from '@/components/User/ChatView'
import CodeView from '@/components/User/CodeView'
import React from 'react'

const Workplace = () => {
  return (
    <div className='p-10'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
        <ChatView/>
        <div className='md:col-span-2'>
          <CodeView/>
        </div>
        </div>
    </div>
  )
}

export default Workplace