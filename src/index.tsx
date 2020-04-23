import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import store from './core/Redux/Store';
import { Provider } from 'react-redux';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';
import EntrancePage from 'pages/EntrancePage/EntrancePage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from 'pages/HomePage/HomePage';
import AuthPage from 'pages/AuthPage/AuthPage';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";


var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_SENDER_ID}`,
  appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
  measurementId: `${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <Provider store={store()}>
    {/* <React.StrictMode> */}
    <Router>
      <Switch>
        <Route path="/login">
          <AuthPage />
        </Route>
        <Route path="/room/:id">
          <HomePage />
        </Route>
        <Route path="/">
          <EntrancePage />
        </Route>
      </Switch>
    </Router>
    {/* </React.StrictMode> */}
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
