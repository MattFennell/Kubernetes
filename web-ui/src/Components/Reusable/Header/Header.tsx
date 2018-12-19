import * as React from 'react';
import { Row, Col } from 'reactstrap';
import '../../../Style/Header.css';
import { Image } from 'react-bootstrap';
import RowMonths from '../../../Containers/RowMonths';
import { getUser } from '../../../Services/UserService';
import { Account } from '../../../Models/Interfaces/Account';
import ButtonPageSelector from './ButtonPageSelector';

interface Props {
  setAccount: (account: Account) => void;
  firstname: string;
  surname: string;
}
class Header extends React.Component<Props> {
  private transactionsRef: React.RefObject<HTMLDivElement>;
  private categoriesRef: React.RefObject<HTMLDivElement>;
  private settingsRef: React.RefObject<HTMLDivElement>;
  private _onSettingsSelect: () => void;
  private _onCategoriesSelect: () => void;
  private _onTransactionsSelect: () => void;

  constructor(props: Props) {
    super(props);

    this.transactionsRef = React.createRef<HTMLDivElement>();
    this.categoriesRef = React.createRef<HTMLDivElement>();
    this.settingsRef = React.createRef<HTMLDivElement>();
    this._onSettingsSelect = () => this._select(this.settingsRef);
    this._onCategoriesSelect = () => this._select(this.categoriesRef);
    this._onTransactionsSelect = () => this._select(this.transactionsRef);
  }

  componentDidMount() {
    getUser().then(response => {
      if (response !== undefined) {
        this.props.setAccount({
          id: response.id,
          firstName: response.firstName,
          surname: response.surname,
          email: response.email,
          username: response.username,
          balance: response.balance
        });
      }
    });
  }
  _select = (target: React.RefObject<HTMLDivElement>) => {
    this.transactionsRef.current!.classList.remove('selected');
    this.categoriesRef.current!.classList.remove('selected');
    this.settingsRef.current!.classList.remove('selected');
    target.current!.classList.add('selected');
  };

  render() {
    return (
      <div id="header">
        <Row className="categories-user unselectable">
          <Col lg="2">
            <Image id="appIcon" src="appIcon.jpg" alt="App Icon" />
          </Col>
          <Col lg="9">
            <div id="midOptions">
              <ButtonPageSelector
                id="transactions"
                setRef={() => this.transactionsRef}
                selected={true}
                select={() => this._onTransactionsSelect()}
                imgSrc="Transactions.png"
                text="Transactions"
              />
              <ButtonPageSelector
                id="categories"
                setRef={() => this.categoriesRef}
                selected={false}
                select={() => this._onCategoriesSelect()}
                imgSrc="Categories.png"
                text="Categories"
              />
              <ButtonPageSelector
                id="settings"
                setRef={() => this.settingsRef}
                selected={false}
                select={() => this._onSettingsSelect()}
                imgSrc="Settings.png"
                text="Settings"
              />
            </div>
          </Col>
          <Col lg="2">
            <div id="account">
              <div id="avatar" />
              <h5 id="name">{this.props.firstname + ' ' + this.props.surname}</h5>
              <i className="fa fa-caret-down cursor-pointer" aria-hidden="true" />
            </div>
          </Col>
        </Row>
        <RowMonths />
      </div>
    );
  }
}
export default Header;
