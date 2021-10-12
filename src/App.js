import React, { useEffect } from 'react';

import { Switch, Route, useHistory } from 'react-router-dom';

import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCHxn1khBcymcH01prxtPh1zMFCzsdIjOQ',
  authDomain: 'bruch-chat-app.firebaseapp.com',
  databaseURL:
    'https://bruch-chat-app-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'bruch-chat-app',
  storageBucket: 'bruch-chat-app.appspot.com',
  messagingSenderId: '273949212893',
  appId: '1:273949212893:web:fc1e66330dd6fc954d5b34',
  measurementId: 'G-8Q2PZ2RJZD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

function App() {
  let history = useHistory();
  console.log('history', history);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log('user', user);
      if (user) {
        history.push('/');
      } else {
        history.push('/');
      }
    });
  }, [history]);

  return (
    <Switch>
      <Route exact path='/' component={ChatPage} />
      <Route exact path='/login' component={LoginPage} />
      <Route exact path='/register' component={RegisterPage} />
    </Switch>
  );
}

export default App;
