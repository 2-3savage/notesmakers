import React, {useContext, useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../components/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom'
const Registration = () => {
    let { registrationUser, loginUserActivate, resendActivation } = useContext(AuthContext)
    const [message, setMessage] = useState(null);
    const [registration, setRegistration] = useState(null)
    const handleRegistration = async (e) => {
      e.preventDefault();
      const registrationSuccess = await registrationUser(e);
      try{
        if (('email' in registrationSuccess && 'username' in registrationSuccess && 'id' in registrationSuccess)) {
          setRegistration({username: e.target.username.value, password: e.target.password.value, email: e.target.email.value})
        }
      } catch (error){
        if ((registrationSuccess === "Сообщение отправлено повторно на почту")){
          setRegistration({username: e.target.username.value, password: e.target.password.value, email: e.target.email.value})
        }
      } 
      if (registrationSuccess === "Пожалуйста, заполните все поля формы."){
        setMessage("Пожалуйста, заполните все поля формы.")
      }else if (registrationSuccess?.non_field_errors){
        setMessage("Пароли разные. Попробуйте еще раз!")
      }else if (registrationSuccess?.email?.includes('Введите правильный адрес электронной почты.')){
        setMessage("Введите правильный адрес электронной почты!")
      }else if (registrationSuccess?.username){
        setMessage("Пользователь с таким именем пользователя уже существует!")
      }else if (registrationSuccess?.password?.includes('Введённый пароль слишком широко распространён.')){
        setMessage("Введённый пароль слишком широко распространён. Попробуйте другой.")
      }else if (registrationSuccess?.password?.includes('Введённый пароль состоит только из цифр.')){
        setMessage("Введённый пароль состоит только из цифр. Попробуйте другой.")
      }else if (registrationSuccess?.password){
        setMessage("Введённый пароль слишком короткий. Он должен содержать как минимум 8 символов!")
      }else if (registrationSuccess?.email){
        setMessage("Пользователь с таким адресом электронной почты уже существует!")
      }
    }
    useEffect(() => {
      function checkUserData() {
        if (localStorage.getItem('email') === registration.email){
          loginUserActivate(registration.username, registration.password)
        }
      }
      window.addEventListener('storage', checkUserData)
      return () => {
        window.removeEventListener('storage', checkUserData)
      }
    }, [registration])
    
  return (
    !registration ? (
    <div>
        Регистрация
        <span> | </span>
        <Link to="/">Home</Link>
        <span> | </span>
        <Link to="/login">Login</Link>
        <span> | </span>

        <form onSubmit={handleRegistration}>
            <input type='email' name='email' placeholder='Enter email'></input>
            <input type='text' name='username' placeholder='Enter username'></input>
            <input type='password' name='password' placeholder='Enter password'></input>
            <input type='password' name='re_password' placeholder='Enter password again'></input>
            <input type='submit' />
        </form>
        {message}
    </div>
    ) : (
      <div>
        Здравствуйте {registration.username}. Вам отправлено подтверждение на почту - {registration.email}. Не пришло сообщение? 
        <Link onClick={(e) => resendActivation(e, registration.email)}>Переотправить</Link>
      </div>
    )
  )
}

export default Registration