import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState, useContext } from 'react';
import { auth, db, storage } from '../../firebase';

//Create AuthContext
export const AuthContext = React.createContext();

//Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
}

//Create AuthProvider component
function AuthWrapper({children}) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [nameError, setNameError] = useState("");

    useEffect(() => {
        //currentUser : act as cookie
        //Listener to check whether any user was logged in before or not
        //For any auth state changes, listener calls automatically, create/fetch user, and update app login state
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

            if(currentUser){   
                const docRef = doc(db, "users", currentUser?.uid);
                const docSnap = await getDoc(docRef);

                if(!docSnap.exists()){
                    //create a user
                    const newUser = {
                        email: currentUser.email,
                        name: currentUser.displayName,
                        profile_pic: currentUser.photoURL || "/default-profile.png"
                    };
                    await setDoc(docRef, newUser);
                    setUserData({
                        id: docRef.id,
                        ...newUser,
                        status: ""
                    });
                }
                else {
                    const { email, name, profile_pic, status } = docSnap.data();
                    const id = docSnap.id;
                    //set login state of app
                    setUserData({
                        id,
                        email,
                        name,
                        profile_pic,
                        status: status || ""
                    });
                }
                await updateLastSeen(currentUser);
            }
            else {
                setUserData(null);
            }
            setLoading(false);
        })

        //Stop listener when component unmounts
        return () => {
            unsubscribe();
        }
    }, []);

    //Update last login time
    const updateLastSeen = async (currentUser) => {
        const date = new Date();
        const timestamp = date.toLocaleString("en-IN", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
          day: "2-digit",
          month: "short"
        })

        await updateDoc(doc(db, "users", currentUser.uid), {
            lastSeen: timestamp
        })
    }

    //Update Name
    const updateName = async (newName) => {
        if(!newName){
            setNameError("Name can't be empty")
            return
        }
        await updateDoc(doc(db, "users", userData.id), {
            name: newName
        })
        setUserData({
            ...userData,
            name: newName
        });
        setNameError(null)
    }

    //Update status
    const updateStatus = async (newStatus) => {
        await updateDoc(doc(db, "users", userData.id), {
            status: newStatus
        })
        setUserData({
            ...userData,
            status: newStatus
        });
    }

    //Upload profile image
    const uploadProfileImage = (img) => {
        const storageRef = ref(storage, `profile/${userData.id}`);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on("state_changed", 
            () => {
                // on State Changed
                setIsUploading(true);
                setError(null);
                console.log("Upload started");
            },
            () => {
                // on Error
                setError("Unable to upload!");
                setIsUploading(false);
                alert("Unable to upload!");
            },
            async () => {
                // on Success
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                await updateDoc(doc(db, "users", userData.id), { profile_pic: downloadURL });
                setUserData({
                    ...userData,
                    profile_pic: downloadURL
                });
                setIsUploading(false);
                setError(null);
            }
        
        )
    }

  return <AuthContext.Provider value={{userData, setUserData, loading, updateName, updateStatus, uploadProfileImage, isUploading, setIsUploading, error, nameError}}>
            {children}
        </AuthContext.Provider>
}

export default AuthWrapper