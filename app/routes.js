/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import LoginPage from './containers/LoginPage';
import Main from './containers/Principal';

export default () => (
  <App>
    <Switch>
      <Route path="/main" component={Main} />
      <Route path="/" component={LoginPage} />
    </Switch>
  </App>
);
