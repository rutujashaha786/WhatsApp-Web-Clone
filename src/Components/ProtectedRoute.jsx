import { Loader2Icon } from 'lucide-react';
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext';

function ProtectedRoute(props) {
    const {userData, loading} = useAuth();
    
    if(loading){
        return <div className='w-screen h-screen flex justify-center items-center bg-background'>
                    <Loader2Icon className='w-8 h-8 animate-spin'></Loader2Icon>
                </div>
    }
    const children = props.children;
    if (userData) {
        return children;
    }
    else {
        return <Navigate to='/login'></Navigate>   //for redirection from '/' to '/login', then login component renders auto
    }
}

export default ProtectedRoute