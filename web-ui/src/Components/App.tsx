import * as React from 'react';
import Login from '../Containers/Login';
import Register from '../Containers/Register';
import { isLoggedIn } from '../Services/CredentialInputService';
import { Redirect, Route, Switch } from 'react-router-dom';
import SplashScreen from './Reusable/SplashScreen';
import Header from '../Containers/Header';
import '../Style/App.css';
import PageBody from '../Containers/PageBody';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Switch>
          <Route
            exact
            path="/"
            component={() => (isLoggedIn ? <Redirect to="/balance" /> : <Redirect to="/login" />)}
          />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/splashScreen" component={SplashScreen} />
          <PageBody />
        </Switch>
      </React.Fragment>
    );
  }
}
export default App;
