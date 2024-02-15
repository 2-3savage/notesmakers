import React, { useContext, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import Menu from '../../components/sidebar/Menu';
import { jwtDecode } from "jwt-decode";
const RouteRegister = () => {
    let {} = useContext(AuthContext)
    let user = localStorage.getItem('authTokens') ?  jwtDecode(localStorage.getItem('authTokens')) : null
    return user ? <Navigate to={'/'}/> : <Outlet />
}

export default RouteRegister