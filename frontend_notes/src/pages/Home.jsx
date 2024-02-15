import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../components/context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { NoteService } from '../services/note.service';

const Home = () => {
  let {logoutUser, authTokens} = useContext(AuthContext)
  let user = localStorage.getItem('authTokens') ?  jwtDecode(localStorage.getItem('authTokens')) : null
  const [listPages, setListPages] = useState(null)
  useEffect(() => {
      const fetchData = async () => {
          const data = await NoteService.getAll(authTokens)
          if (data === -1){
              logoutUser()
          }else if (data === 0){
              setListPages(null)
          }
          else{
              setListPages(data)
          }
      }
      fetchData()
  }, [])
  return (
  <div>
    <Link to="/">Home</Link>
    {user ? (
      <Link onClick={logoutUser}>Logout</Link>
    ) : (
      <Link to="/login">Login</Link>
    )}
      {listPages?.map((item, index)=> 
        <div key={index}>
          <Link to={`/pages/${item.id}`}>{item.title}</Link>
        </div>
      )}
      <span> | </span>
    
    <p>Hello {user? user.username : ""} !</p>

  </div>
    
  )
};


export default Home;
