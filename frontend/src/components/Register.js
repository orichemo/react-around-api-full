import React from 'react';
import { Link } from 'react-router-dom';

function Register({onRegister}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
     email,
     password,
    };
    onRegister(userData);
  };

  return (
    <div className='auth-form'>
      <p className='auth-form__welcome'>Sign up</p>
      <form onSubmit={handleSubmit} className='auth-form__form'>
        <fieldset className='auth-form__fieldset'>
          <input
            required
            id='email'
            name='email'
            value={email}
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            className='auth-form__input'
            placeholder='Email'
          />
          <input
            required
            id='password'
            name='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='auth-form__input'
            placeholder='Password'
          />
        </fieldset>
        <div className='auth-form__button-container'>
          <button type='submit' className='auth-form__button'>
            Sign up
          </button>
          <Link to='/signin' className='auth-form__link'>
            Already a member? Log in here!
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
