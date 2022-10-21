import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import AddPlacePopup from './AddPlacePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import ImagePopup from './ImagePopup';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip.js';
import { api } from '../utils/Api';
import ProtectedRoute from './ProtectedRoute.js';
import {
  CurrentUserContext,
  CurrentCradsContext,
} from '../contexts/CurrentUserContext.js';
import * as auth from '../utils/auth.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    name: '',
    link: '',
  });
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isInfoTootlipOpen, setIsInfoTootlipOpen] = React.useState(false);
  const [TooltipStatus, setTooltipStatus] = React.useState('');

  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  const [isloggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const history = useHistory();
  const [token, setToken] = React.useState(localStorage.getItem('jwt'));

  React.useEffect(() => {
    if (token) {
      api
        .getUserInfo(token)
        .then((userInfo) => setCurrentUser(userInfo))
        .catch((err) => console.log(err));
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      api
        .getInitialCards(token)
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.email);
            setIsLoggedIn(true);
            history.push('/');
          } else {
            localStorage.removeItem('jwt');
          }
        })
        .catch((err) => console.log(err));
    }
  }, [history, token]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .changeProfilePicture(avatar, token)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser({ name, about }) {
    api
      .patchUserProfile(name, about, token)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardClick(data) {
    setIsImagePopupOpen(true);
    setSelectedCard({ name: data.name, link: data.link });
  }

  function handleUpdateCard({ name, link }) {
    api
      .createCard({ name: name, link: link }, token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id, token)
      .then(() => {
        setCards(cards.filter((item) => item !== card));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTootlipOpen(false);
  }

  function onRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        if (res._id) {
          setTooltipStatus('sucsses');
          setIsInfoTootlipOpen(true);
          history.push('/signin');
        } else {
          setTooltipStatus('fail');
          setIsInfoTootlipOpen(true);
        }
      })
      .catch((err) => {
        setTooltipStatus('fail');
        setIsInfoTootlipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res.token) {
          setIsLoggedIn(true);
          setEmail(email);

          localStorage.setItem('jwt', res.token);
          setToken(res.token);
          history.push('/');
        } else {
          setTooltipStatus('fail');
          setIsInfoTootlipOpen(true);
        }
      })
      .catch((err) => {
        setTooltipStatus('fail');
        setIsInfoTootlipOpen(true);
      });
  }

  function onSignOut() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push('/signin');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentCradsContext.Provider value={cards}>
        <div>
          <Header email={email} onSignOut={onSignOut} />
          <Switch>
            <ProtectedRoute exact path='/' loggedIn={isloggedIn}>
              <Main
                handleEditProfileClick={handleEditProfileClick}
                handleEditAvatarClick={handleEditAvatarClick}
                handleAddPlaceClick={handleAddPlaceClick}
                onCardClick={handleCardClick}
                handleCardLike={handleCardLike}
                handleTrashClick={handleCardDelete}
              />
            </ProtectedRoute>
            <Route path='/signup'>
              <Register onRegister={onRegister} />
            </Route>
            <Route path='/signin'>
              <Login onLogin={onLogin} />
            </Route>
            <Route path='/'>
              {isloggedIn ? <Redirect to='/' /> : <Redirect to='/signin' />}
            </Route>
          </Switch>
          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onUpdateCard={handleUpdateCard}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup
            selectedCard={selectedCard}
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
          />
          <InfoTooltip
            isOpen={isInfoTootlipOpen}
            onClose={closeAllPopups}
            status={TooltipStatus}
          />
        </div>
      </CurrentCradsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
