import { collection, onSnapshot } from 'firebase/firestore';
import { CircleFadingPlusIcon, Loader2Icon, MessageSquare, SearchIcon, UserRoundIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import Profile from '../Components/Profile';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ChatPanel() {
    const [isLoading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [showProfile, setShowProfile] = useState(false);   //conditional Profile component rendering is handled through state
    const [searchQuery, setSearchQuery] = useState("");
    const {userData} = useAuth();

    const params = useParams();

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "users"), (querySnapshot) => {
            const usersArray = querySnapshot.docs.map((doc) => ({
                userData: doc.data(),
                id: doc.id
            }));
            setUsers(usersArray);
            setLoading(false);
        });
    
        return () => unsub();
    }, []);

    const onBack = () => {
        setShowProfile(false);
    }
    if(showProfile){
        return <Profile onBack={onBack}></Profile>
    }

    let filteredUsers = users;
    if(searchQuery){
        filteredUsers = users.filter((user) => {
           return user?.userData?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        })
    }

    return (
        <div className='bg-white w-[30vw] min-w-[330px]'>
            {/* top bar */}
            <div className='flex justify-between items-center py-2 px-4'>
                <button onClick={() => {setShowProfile(true)}}>
                    <img src={userData?.profile_pic || "/default-user.png"} className="rounded-full h-10 w-10"></img>
                </button>
                <div className='flex gap-6 mx-4'>
                    <CircleFadingPlusIcon className='w-6 h-6'></CircleFadingPlusIcon>
                    <MessageSquare className='w-6 h-6'></MessageSquare>
                    <UserRoundIcon className='w-6 h-6'></UserRoundIcon>
                </div>
            </div>

            {/* chat list */}
            {
                isLoading ? (<div className='flex justify-center items-center h-full w-full'>
                <Loader2Icon className='w-10 h-10 animate-spin'></Loader2Icon>
              </div>) :
                <div className='bg-white py-2 px-3'>
                    <div className='flex items-center gap-4 py-2 px-3 rounded-lg bg-background'>
                        <SearchIcon className='w-4 h-4'></SearchIcon>
                        <input type='text' className='bg-background focus-within:outline-none' value={searchQuery} placeholder='Search' onChange={(e) => {setSearchQuery(e.target.value)}}></input>
                    </div>
                    <div className='flex flex-col divide-y py-4 max-h-[calc(100vh-152px)] overflow-y-scroll'>
                        {filteredUsers.map((userObject) => {
                            return <Link key={userObject.id} className={`flex items-center gap-4 p-2 hover:bg-background rounded ${ params?.id === userObject.id && "bg-background"}`} to={`/chat/${userObject.id}`}>
                                        <img src={userObject.userData.profile_pic} className="rounded-full h-10 w-10"></img>
                                        <h2>{userObject.userData.name}</h2>
                                    </Link>
                        })}
                    </div>
                </div>
            }
        </div>    
    )
}

export default ChatPanel