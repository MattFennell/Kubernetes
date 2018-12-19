import * as React from 'react';
import { Form, FormGroup, Label, Button } from 'reactstrap';
import { login, getUser, getButtonMonthInfo } from '../../Services/UserService';
import { Credentials } from '../../Models/Interfaces/Credentials';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { RoutedFormProps } from '../../Models/Types/RoutedFormProps';
import * as LoginService from '../../Services/CredentialInputService';

interface State {
  username: string;
  passcode: string;
  error: string;
}

class LoginForm extends React.Component<RoutedFormProps<RouteComponentProps>, State> {
  constructor(props: RoutedFormProps<RouteComponentProps>) {
    super(props);
    this.state = {
      username: '',
      passcode: '',
      error: ''
    };
    this._onSubmit = this._onSubmit.bind(this);
  }

  _handleInput(eventName: string, eventTarget: HTMLInputElement) {
    this.setState({
      [eventName]: eventTarget.value
    } as Pick<State, keyof State>); // Needs type conversion, see: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26635
  }

  _validate = () => {
    if (LoginService.emptyFields(this.state.username, this.state.passcode)) {
      this.setState({ error: 'All fields must be filled in' });
      return true;
    } else if (
      LoginService.invalidUsername(this.state.username) ||
      LoginService.invalidPasscode(this.state.passcode) ||
      LoginService.passcodeTooShort(this.state.passcode)
    ) {
      this.setState({ error: 'Username or Passcode not recognised' });
      return true;
    } else return false;
  };

  _onSubmit = (event: string) => {
    switch (event) {
      case 'btnLogin':
        const err = this._validate();
        if (!err) {
          const data: Credentials = {
            username: this.state.username,
            password: this.state.passcode
          };
          login(data)
            .then(function(response) {
              LoginService.setTokens(response);
            })
            .then(() => getUser())
            .then(response => {
              this.props.setAccount({
                id: response.id,
                firstName: response.firstName,
                surname: response.surname,
                email: response.email,
                username: response.username,
                balance: response.balance
              });
            })
            .then(() => getButtonMonthInfo())
            .then(response => this.props.setButtonMonthInfo(response))
            .then(() => {
              this.props.history.push('/balance');
            })
            .catch(error => {
              this.setState({ error: LoginService.formatError(error.toString()) });
            });
        }
        break;
      case 'btnRegister':
        this.props.history.push('/register');
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div id="login-form" onSubmit={e => e.preventDefault()}>
        <Form id="login-form">
          <h1 id="greeting" className="text-center unselectable">
            Hi there!
          </h1>
          <div id="login-input-fields">
            <Label className="error-text">{this.state.error}</Label>
            <FormGroup>
              <Label for="username" className="unselectable">
                Username
              </Label>
              <Field
                type="text"
                name="username"
                id="username"
                component="input"
                onChange={e => this._handleInput(e!.target.name, e!.target)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="passcode" className="unselectable">
                Passcode
              </Label>
              <Field
                type="password"
                name="passcode"
                id="passcode"
                component="input"
                onChange={e => this._handleInput(e!.target.name, e!.target)}
              />
            </FormGroup>
          </div>
          <Button
            id="btnLogin"
            type="submit"
            className="btn btn-default btn-round-lg btn-lg first"
            onClick={(e: any) => this._onSubmit(e.target.id)}
          >
            Log In
          </Button>
          <Button
            className="btn btn-default btn-round-lg btn-lg second"
            id="btnRegister"
            onClick={(e: any) => this._onSubmit(e.target.id)}
          >
            Sign Up
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(
  reduxForm<{}, any>({
    form: 'login'
  })(LoginForm)
);
