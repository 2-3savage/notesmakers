import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import { Cookies, useCookies } from 'react-cookie';
const AuthContext = createContext()

export default AuthContext


export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ?  JSON.parse(localStorage.getItem('authTokens')) : null)
    const [loading, setLoading] = useState(true)

    const history = useNavigate()

    let loginUserActivate = async (username, password) => {
        let responce = await fetch('http://127.0.0.1:8000/auth/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'username': username, 'password': password})
            }
        )
        let data = await responce.json()
        if (responce.status === 200) {
            setAuthTokens(data)
            localStorage.setItem('authTokens', JSON.stringify(data))
            localStorage.removeItem('email')
            history('/')
        }
    }
    let newPasswordEmailInput = async (e) => {
        e.preventDefault()
        let responce = await fetch('http://127.0.0.1:8000/auth/user/users/reset_password/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'email': e.target.email.value })
        })
        if (responce.status === 204) {
            return 1
        }else{
            return -1
        }
    }
    let newPasswordReset = async (e, uid, token) => {
        e.preventDefault()
        let responce = await fetch('http://127.0.0.1:8000/auth/user/users/reset_password_confirm/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'new_password': e.target.password.value, 're_new_password': e.target.re_password.value, 'uid': uid, 'token': token})
        })
        if (responce.status === 204) {
            return 1
        }else{
            return -1
        }
    }
    let activateUser = async (uid, token) => {
        let responce = await fetch('http://127.0.0.1:8000/auth/user/users/activation/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'uid': uid, 'token': token})
        })
        if (responce.status === 204) {
            let responce = await fetch(`http://127.0.0.1:8000/auth/activate/${uid}/${token}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
            )
            let data = await responce.json()
            localStorage.setItem('email', data.email)
        }
    }
    let registrationUser = async (e) => {
        e.preventDefault()
        const email = e.target.email.value;
        const username = e.target.username.value;
        const password = e.target.password.value;
        const rePassword = e.target.re_password.value;
        if (email && username && password && rePassword){
            let responce = await fetch(`http://127.0.0.1:8000/auth/active/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'username': e.target.username.value,})
                }
            )
            let data = await responce.json()
            if (data === "Пользователь не зарегистрирован"){
                let responce = await fetch('http://127.0.0.1:8000/auth/user/users/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value, 're_password': e.target.re_password.value, 'email': e.target.email.value})
                }
                )
                let data = await responce.json()
                return data
            }else if (data === true){
                loginUserActivate(e.target.username.value, e.target.password.value)
            }else{
                resendActivation(e, e.target.email.value)
                return "Сообщение отправлено повторно на почту"
            }
        }else{
            return "Пожалуйста, заполните все поля формы."
        }
        
    }
    let resendActivation = async (e, email) => {
        e.preventDefault()
        let responce = await fetch('http://127.0.0.1:8000/auth/user/users/resend_activation/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'email': email})
            }
        )
    }

    let loginUser = async (e) => {
        let responce = await fetch('http://127.0.0.1:8000/auth/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
            }
        )
        let data = await responce.json()
        if (responce.status === 200) {
            setAuthTokens(data)
            localStorage.removeItem('email')
            localStorage.setItem('authTokens', JSON.stringify(data))
            history('/')
        }
        return data
    } 

    let logoutUser = () => {
        setAuthTokens(null)
        localStorage.removeItem('authTokens')
        localStorage.removeItem('lastTokenRefreshTime')
        history('/login')
    }

    let updateToken = async () => {
        if (!authTokens) return
        let responce = await fetch('http://127.0.0.1:8000/auth/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'refresh': authTokens?.refresh})
            }
        )
        
        let data = await responce.json()

        if (responce.status === 200){
            setAuthTokens(data)
            localStorage.setItem('authTokens', JSON.stringify(data))
        }
        else{
            logoutUser()
        }
        if (loading){
            setLoading(false)
        }
    } 

    let contextData = {
        registrationUser: registrationUser,
        authTokens:authTokens,
        loginUser: loginUser,
        logoutUser:logoutUser,
        activateUser:activateUser,
        newPasswordReset:newPasswordReset,
        newPasswordEmailInput:newPasswordEmailInput,
        resendActivation:resendActivation,
        history:history,
        loginUserActivate:loginUserActivate
    }

    useEffect(() => {
        if (!authTokens) return
        if (loading){
            updateToken()
        }
        let lastTokenRefreshTime = localStorage.getItem('lastTokenRefreshTime');
        let currentTime = new Date().getTime();
        let timeSinceLastRefresh = currentTime - lastTokenRefreshTime;
        let minutes = 1000 * 100 * 6 // 10 минут
        if (timeSinceLastRefresh > minutes) { // Проверка прошедшего времени (10 минут) для обновления токена
            updateToken();
            localStorage.setItem('lastTokenRefreshTime', currentTime); // Сохранение времени последнего обновления токена
        }
        
        let interval = setInterval(() => {
            if (authTokens){
                updateToken()
            }
        }, minutes)
        return ()=> clearInterval(interval)
    }, [authTokens, loading])
    

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
