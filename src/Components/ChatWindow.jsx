import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { MessageSquareText, PlusIcon, SendIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase';
import { useAuth } from './AuthContext';

function ChatWindow() {
  const {userData} = useAuth();
  const [msg, setMsg] = useState("");
  const [secondUser, setSecondUser] = useState(null);
  const [msgList, setMsgList] = useState([]);

  const params = useParams();
  const receiverID = params.id;

  //Key for user-chats collection 
  const chatId = userData.id > receiverID ? `${userData.id}-${receiverID}` : `${receiverID}-${userData.id}`

  const handleSendMessage = async () => {
    if(msg){
      const date = new Date();
      const timestamp = date.toLocaleString("en-IN", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        day: "2-digit",
        month: "short"
      })

      if(msgList.length === 0){
        //start chat 
        await setDoc(doc(db, "user-chats", chatId), {
          chatId: chatId,
          messages: [
            {
              time: timestamp,
              text: msg,
              sender: userData.id,
              receiver: receiverID
            }
          ]
        })
      }
      else{
        //update in message list
        await updateDoc(doc(db, "user-chats", chatId), {
          chatId: chatId,
          messages: arrayUnion({
            time: timestamp,
            text: msg,
            sender: userData.id,
            receiver: receiverID
          })
        })
      }
    }
    setMsg("");
  }

  useEffect(() => {
    if(!receiverID) return;

    const receiverUserUnsubscribe = onSnapshot(doc(db, "users", receiverID), (docSnap) => {
      if (docSnap.exists()) {
          setSecondUser(docSnap.data());
      }
    })

    //Setup listener for doc, Fetch messages & update state 
    const chatConversationUnSubscribe = onSnapshot(doc(db, "user-chats", chatId), (doc) => {
      setMsgList(doc.data()?.messages || []);
    })

    return () => {
      receiverUserUnsubscribe();
      chatConversationUnSubscribe();
    }

  }, [receiverID]);

  if(!receiverID){
    //Empty Screen
    return (
      <div className='flex flex-col items-center justify-center gap-4 w-[70%]'>
        <MessageSquareText className='w-28 h-28 text-gray-400' strokeWidth={1.2}></MessageSquareText>
        <p className='text-gray-400 text-center text-sm'>
          select any contact to
          <br></br>
          start a chat with.
        </p>
      </div>
    )
  }
  

  //Chat screen
  return (
      <div className='flex flex-col w-[70%] bg-chat-bg'>
        {/* Top bar */}
        <div className='flex items-center gap-2 shadow-sm py-2 px-4 bg-background'>
          <img src={secondUser?.profile_pic || "/default-user.png"} className="rounded-full h-10 w-10"></img>
          <div>
            <h3>{secondUser?.name}</h3>
            {secondUser?.lastSeen && (<p className='text-xs text-neutral-400'>last seen at {secondUser?.lastSeen}</p>)
            }
          </div>
        </div>
        
        {/* message list */}
        <div className='flex-grow flex flex-col gap-16 p-6 overflow-y-scroll'>
          {msgList.map((m, index) => {
            return <div key={index} data-sender={userData.id === m.sender} className='bg-white rounded w-fit p-2 shadow-sm max-w-[400px] break-words data-[sender=true]:ml-auto data-[sender=true]:bg-primary-light'>
                    <p>{m?.text}</p>
                    <p className='text-xs text-neutral-500 text-end'>{m?.time}</p>
                  </div>
          })}
        </div>

        {/* Chat input */}
        <div className='flex px-6 py-3 bg-background shadow gap-6 items-center'>
          <PlusIcon></PlusIcon>
          <input type='text' className='w-full focus:outline-none py-2 px-4 rounded' placeholder='Type a message...' 
                 value={msg} 
                 onChange={(e) => { setMsg(e.target.value) }}
                 onKeyDown={(e) => 
                  {
                    if(e.key === "Enter") 
                        handleSendMessage();
                  }}></input>
          <button onClick={handleSendMessage}><SendIcon></SendIcon></button>
        </div>
      </div>
  )
  
}

export default ChatWindow