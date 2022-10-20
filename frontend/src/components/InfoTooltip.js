import React from 'react';
import SuccessIcon from '../images/SuccessIcon.svg';
import ErrorIcon from '../images/ErrorIcon.svg';

function InfoTooltip({ isOpen, onClose, status }) {
  return (
    <div className={isOpen ? `popup popup_open` : `popup`}>
      <div className='popup__container popup__container_type_tooltip'>
        <form className='popup__form' noValidate>
          <button
            className='popup__close-button'
            type='button'
            aria-label='close'
            onClick={onClose}
          ></button>
          {status === 'sucsses' ? (
            <div className='popup__tooltip-content'>
              <img
                className='popup__icon'
                src={SuccessIcon}
                alt=' Black success Icon - v'
              ></img>
              <p className='popup__status-massage'>
                Success! You have now been registered.
              </p>
            </div>
          ) : (
            <div className='popup__tooltip-content'>
              <img
                className='popup__icon'
                src={ErrorIcon}
                alt='Red error Icon - x'
              ></img>
              <p className='popup__status-massage'>
                Oops, Something went worng! Please try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default InfoTooltip;
