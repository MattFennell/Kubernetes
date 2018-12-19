import * as React from 'react';
import '../../Style/AccountBalance.css';
import { getUser } from '../../Services/UserService';
import DisplayMoney from './DisplayMoney';

interface Props {
  setBalance: (value: number) => void;
  setFirstName: (value: string) => void;
  balance: number;
  firstName: string;
}

class AccountBalance extends React.Component<Props, {}> {
  shouldComponentUpdate(nextProps: Props, nextState: {}) {
    return nextProps !== this.props || nextState !== this.state;
  }

  componentDidMount() {
    getUser()
      .then(response => {
        this.props.setBalance(parseFloat(response.balance));
        this.props.setFirstName(response.firstName);
      })
      .catch(error => {
        console.error(error);
      });
  }

  public render() {
    return (
      <div id="container-account-balance">
        <div id="balance" className="unselectable shadow">
          {!this.props.firstName || !this.props.balance ? (
            <div className="loading-spinner-container-balance">
              <img className="loading-spinner-balance" />
            </div>
          ) : (
            <div>
              <span id="AccountBalance-Debit" className="text-center">
                {this.props.firstName}
                's debit
                <br />
                account
              </span>
              <span id="AccountBalance-Value" className="text-center">
                <DisplayMoney balance={this.props.balance} transactionRow={false} />
              </span>
              <span id="AccountBalance-Text">Account Balance</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default AccountBalance;
