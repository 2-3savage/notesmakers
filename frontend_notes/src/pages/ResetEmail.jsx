import React, {useContext} from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import AuthContext from '../components/context/AuthContext';

const ResetEmail = () => {
    let { newPasswordEmailInput } = useContext(AuthContext);
  return (
    <div>
      <form onSubmit={newPasswordEmailInput}>
        <input type="email" name="email" placeholder="Enter email" />
        <input type="submit" />
      </form>
    </div>
  )
}

export default ResetEmail