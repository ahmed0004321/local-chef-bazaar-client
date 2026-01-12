import axios from "axios";
import { use, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate, useNavigate } from "react-router";

const axiosSecure = axios.create({
    baseURL: `http://localhost:3000`
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const {user, setUser, logOut, loading} = use(AuthContext);
    //client side theke jwt token ta pathacci server side e 
    //to intercept request
    useEffect(() => {
        if (loading) return;
        //interceptor request
        const requestInterceptor = axiosSecure.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config;
        })
        //interceptor response
        const resInterceptor = axiosSecure.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            console.log(error);
            const statusCode = error.response?.status;
            if(statusCode === 401 || statusCode === 403){
                logOut()
                .then(() => {
                    setUser(null);
                    navigate('/login');
                })
            }
            return Promise.reject(error)
        })


        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        }
    }, [loading, logOut, navigate, user])

    return axiosSecure;
}

export default useAxiosSecure;