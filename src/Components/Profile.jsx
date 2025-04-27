import { signOut } from 'firebase/auth';
import { ArrowLeft, CheckIcon, Edit2Icon, Loader2Icon } from 'lucide-react'
import React from 'react'
import { auth } from '../../firebase';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Profile(props) {
    const {userData, updateName, updateStatus, uploadProfileImage, isUploading, error, nameError} = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(userData?.name || "");
    const [status, setStatus] = useState(userData?.status || "");

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    } 

  return (
    <div className='bg-background w-[30vw] min-w-[330px]'>
        <div className='flex items-center py-4 px-4 bg-green-400 text-white text-lg gap-6'>
            <button onClick={props.onBack}>
                <ArrowLeft></ArrowLeft>
            </button>
            <div>Profile</div>
        </div>
        <div className='mt-10 flex flex-col justify-center items-center gap-8 py-16'>
          <label className={`mb-6 cursor-pointer rounded-full overflow-hidden relative ${isUploading ? "pointer-events-none" : ""}`}>
            <img src={userData.profile_pic} className="h-40 w-40 object-cover" alt="profile pic"></img>
            {
              isUploading ? (
              <div className='bg-black/30 absolute inset-0 flex justify-center items-center'>
                <Loader2Icon className='w-6 h-6 text-primary-dense animate-spin'></Loader2Icon>
              </div>
              )
              :
              (
                <div className='absolute inset-0 hover:bg-black/30 flex justify-center items-center'>
                  <Edit2Icon className='w-6 h-6 text-white'></Edit2Icon>
                </div>
              )
            }
            <input type='file' accept='image/png, image/jpeg, image/gif' className='hidden' 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadProfileImage(file);
              }}}>
            </input>
          </label>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className='flex flex-col bg-white py-4 px-8 gap-2 w-full'>
            <label className='text-sm text-primary-dense'>Your name</label>
            <div className='flex items-center'>
              <input type='text' className='w-full bg-transparent' value={name} placeholder='Update your name...' onChange={(e) => {setName(e.target.value)}}></input>
              <button onClick={()=> {updateName(name)}}>
                <CheckIcon className='w-5 h-5'></CheckIcon>
              </button>
            </div>
          </div>
          {nameError && <p className="text-red-600 text-sm">{nameError}</p>}

          <div className='flex flex-col bg-white py-4 px-8 gap-2 w-full'>
            <label className='text-sm text-primary-dense'>Status</label>
            <div className='flex items-center'>
              <input type='text' className='w-full bg-transparent' value={status} placeholder='Update your status...' onChange={(e) => {setStatus(e.target.value)}}></input>
              <button onClick={() => {updateStatus(status)}}>
                <CheckIcon className='w-5 h-5'></CheckIcon>
              </button>
            </div>
          </div>

          <button onClick={handleLogout} className='mt-8 text-white py-3 px-4 bg-primary rounded hover:bg-primary-dense'>Logout</button>
        </div>
    </div>
    
  )
}

export default Profile