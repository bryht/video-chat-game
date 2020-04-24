import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import store from './common/Redux/Store';
import { Provider } from 'react-redux';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';
import EntrancePage from 'pages/EntrancePage/EntrancePage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from 'pages/HomePage/HomePage';
import LoginPage from 'pages/LoginPage/LoginPage';
import FirebaseHelper from 'utils/FirebaseHelper';

FirebaseHelper.initial();

ReactDOM.render(
  <Provider store={store()}>
    {/* <React.StrictMode> */}
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
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
