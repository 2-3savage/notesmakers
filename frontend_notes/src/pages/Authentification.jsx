import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../components/context/AuthContext';

const Autentification = () => {
   const { loginUser, resendActivation } = useContext(AuthContext);
   const handleLogin = async (e) => {
      e.preventDefault();
      await loginUser(e);
   }
   const handleResendActivation = async (e) => {
      e.preventDefault();
      resendActivation(localStorage.getItem('email'))
   }
   return (
      <div>
         Аутентификация
         <span> | </span>
         <Link to="/">Home</Link>
         <span> | </span>
         <Link to="/registration">Registration</Link>
         <span> | </span>
         <Link to="/reset_password">Забыли пароль?</Link>
         <form onSubmit={handleLogin}>
            <input type='text' name='username' placeholder='Enter username' />
            <input type='password' name='password' placeholder='Enter password' />
            <input type='submit' />
         </form>
         
      </div>
   );
}

export default Autentification;
