import React, { use } from 'react';
import { useLocation } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import Loading from '../Components/Loading/Loading';
import { Navigate } from 'react-router';

const PrivateRoutes = ({children}) => {
    const location = useLocation();
    const {loading, user} = use(AuthContext);
    if(loading){
        return <Loading></Loading>
    }
    if(!user){
        return <Navigate to='/login' state={location.pathname}></Navigate>
    }
    return children;
};

export default PrivateRoutes;