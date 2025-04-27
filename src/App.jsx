import Login from "./Components/Login"
import Home from "./Components/Home"
import PageNotFound from "./Components/PageNotFound"
import {Routes, Route} from 'react-router-dom'
import ProtectedRoute from "./Components/ProtectedRoute"
import PublicRoute from "./Components/PublicRoute"
import React, {useState, useEffect} from "react"

function App() {
    const [mobileDevice, setMobileDevice] = useState(false);

    useEffect(() => {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isMobileDevice = isMobile || window.innerWidth <= 1024;
        setMobileDevice(isMobileDevice);
    }, []);

    if (mobileDevice) {
        return (
            <div 
            style={{
                display: 'flex',
                justifyContent: 'center',    
                alignItems: 'center',       
                height: '100vh',             
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif'
            }}
            >
                <div style={{ padding: '20px' }}>
                    <h1 style={{ color: '#25D366' }}>WhatsApp Web</h1>
                    <h2 style={{ marginTop: '20px' }}>Mobile Not Supported</h2>
                    <p style={{ marginTop: '10px', color: 'gray' }}>
                    Please access this application using a desktop browser.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Routes>
                <Route path='/' element={
                <ProtectedRoute>
                    <Home></Home>
                </ProtectedRoute>}></Route>

                <Route path='/chat/:id' element={
                <ProtectedRoute>
                    <Home></Home>
                </ProtectedRoute>}></Route>

                <Route path='/login' element={
                <PublicRoute>
                    <Login></Login>
                </PublicRoute>}></Route>
                <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
            </Routes>
        </>
    )
}

export default App
