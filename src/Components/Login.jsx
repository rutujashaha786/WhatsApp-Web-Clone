import React from 'react';
import { Fingerprint, LogIn } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from '../../firebase'

function Login() {  
  const handleLogin = async() => {
      await signInWithPopup(auth, new GoogleAuthProvider);
  }

  return (
    <>
      <div className='h-[220px] bg-primary'>
        <div className='flex gap-3 items-center pl-[200px] pt-[40px]'>
          <img src="whatsapp-logo.svg" alt="whatsapp logo" className='h-7'/>
          <div className='text-white font-medium text-xl'>WhatsApp</div>
        </div>   
      </div>
      <div className='h-[calc(100vh-220px)] bg-background flex justify-center items-center relative'>
        <div className='h-[80%] w-[50%] bg-white shadow-2xl flex flex-col justify-center items-center gap-4 absolute top-[-93px]'>
          <Fingerprint className='h-20 w-20 text-primary' strokeWidth={1}></Fingerprint>
          <div className='text-xl font-small mb-2'>Log into WhatsApp Web</div>
          <div className='text-xs font-light text-slate-800 text-center'>Sign in with your google account <br /> to get started.</div>
          <button onClick={handleLogin} className='bg-primary py-3 px-4 flex gap-2 text-white rounded-[5px] hover:bg-primary-dense'>
            <div>Sign in with Google</div>
            <LogIn></LogIn>
          </button>
        </div>
      </div>   
    </>
  )
}

export default Login