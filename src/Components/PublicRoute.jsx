import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader2Icon } from 'lucide-react';

function PublicRoute({ children }) {
    const { userData, loading } = useAuth();

    if (loading) {
        return <div className='w-screen h-screen flex justify-center items-center bg-background'>
                    <Loader2Icon className='w-8 h-8 animate-spin'></Loader2Icon>
                </div>
    }

    if (userData) {
        return <Navigate to="/" />;
    } else {
        return children;
    }
}

export default PublicRoute;