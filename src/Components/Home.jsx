import React from 'react'
import ChatPanel from './ChatPanel';
import ChatWindow from './ChatWindow';

function Home() {
  return (
    <div className='h-screen w-screen bg-[#E3E1DB] relative'>
      <div className='bg-primary h-[130px]'></div>
      <div className='flex bg-background absolute inset-5'>
        <ChatPanel></ChatPanel>
        <ChatWindow></ChatWindow>
      </div> 
    </div>
  )
}

export default Home