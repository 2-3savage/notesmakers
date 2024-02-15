import React, { useContext } from 'react';
import AuthContext from '../components/context/AuthContext';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  let { newPasswordReset } = useContext(AuthContext);
  const { uid, token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    newPasswordReset(e, uid, token);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="password" name="password" placeholder="Enter password" />
        <input type="password" name="re_password" placeholder="Enter password again" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default ResetPassword;
