import * as React from 'react';
import Bubble from '../Reusable/Bubble';
import TextScottCash from '../Reusable/TextScottCash';
import SplashScreen from '../Reusable/SplashScreen';
import LoginForm from './LoginForm';
import { isLoggedIn } from '../../Services/CredentialInputService';
import { UserProps } from '../../Models/Interfaces/UserProps';
import '../../Style/LoginForm.css';

class Login extends React.Component<UserProps> {
  componentDidMount() {
    let header: HTMLElement | null = document.getElementById('header');
    if (header != null) {
      header.hidden = true;
    }
  }
  render() {
    if (!isLoggedIn()) {
      return (
        <div id="bubbles">
          <Bubble className="bubble-medium">
            <TextScottCash />
          </Bubble>
          <Bubble className="bubble-smallest" />
          <Bubble className="bubble-largest">
            <LoginForm
              setAccount={this.props.setAccount}
              setButtonMonthInfo={this.props.setButtonMonthInfo}
            />
          </Bubble>
        </div>
      );
    } else {
      return <SplashScreen redirect={'/balance'} />;
    }
  }
}
export default Login;
