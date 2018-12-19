import * as React from 'react';
import Bubble from '../Reusable/Bubble';
import TextScottCash from '../Reusable/TextScottCash';
import { MonthButtonInfo } from '../../Models/Interfaces/MonthButtonInfo';
import RegisterForm from './RegisterForm';
import { clearSessionStorage } from '../../Services/CredentialInputService';
import '../../Style/RegisterForm.css';
import { Account } from '../../Models/Interfaces/Account';

interface RegisterProps {
  resetTransactions: () => void;
  resetAccount: () => void;
  setAccount: (account: Account) => void;
  setButtonMonthInfo: (buttonMonthInfo: Array<MonthButtonInfo>) => void;
}

class Register extends React.Component<RegisterProps, {}> {
  constructor(props: RegisterProps) {
    super(props);
    this.props.resetTransactions();
    this.props.resetAccount();
    clearSessionStorage();
  }
  componentDidMount() {
    let header: HTMLElement | null = document.getElementById('header');
    if (header != null) {
      header.hidden = true;
    }
  }
  render() {
    return (
      <div id="bubbles">
        <Bubble className="bubble-medium">
          <TextScottCash />
        </Bubble>
        <Bubble className="bubble-smallest" />
        <Bubble className="bubble-largest">
          <RegisterForm
            setAccount={this.props.setAccount}
            setButtonMonthInfo={this.props.setButtonMonthInfo}
          />
        </Bubble>
      </div>
    );
  }
}
export default Register;
