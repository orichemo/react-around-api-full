import React from 'react';
import { Route, Link } from 'react-router-dom';
import logo from '../images/header.svg';

function Header({ email, onSignOut }) {
  function handleonSignOut() {
    onSignOut();
  }

  return (
    <header className='header'>
      <img className='header__logo' src={logo} alt='Around The U.S' />
      <Route exact path='/'>
        <div className='header__wrapper'>
          <p className='header__user'>{email}</p>
          <button
            className='header__logout'
            type='button'
            onClick={handleonSignOut}
          >
            Sign out
          </button>
        </div>
      </Route>
      <Route path='/signup'>
        <Link className='header__auth-link' to='signin'>
          Sign in
        </Link>
      </Route>
      <Route path='/signin'>
        <Link className='header__auth-link' to='signup'>
          Sign up
        </Link>
      </Route>
    </header>
  );
}

export default Header;
