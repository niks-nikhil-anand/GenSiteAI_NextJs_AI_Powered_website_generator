"use client"
import { useUserStore } from '@/app/store/useUserStore';
import ChatView from '@/components/User/ChatView'
import CodeView from '@/components/User/CodeView'
import React, { useEffect } from 'react'


const Workplace = () => {
  const { userInput } = useUserStore();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/template" , {
          method: "POST",
          headers : {"Content-type" : "application/json"},
          body: JSON.stringify({userInput})
        })
        
        if(!response.ok){
          console.error("Template API failed")
        }
      } catch (error) {
        console.error("Error in template api" , error)
      }
    }
    fetchData();
  }, [userInput])

  
  return (
    <div className='p-10'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <p>Stored Input: {userInput}</p>
        <ChatView/>
        <div className='md:col-span-2'>
          <CodeView/>
        </div>
        </div>
    </div>
  )
}

export default Workplace