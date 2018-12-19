import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import Login from '../Components/Login/View';
import { setAccount } from '../Actions/AccountActions';
import { setButtonMonthInfo } from '../Actions/TransactionActions';

const mapStateToProps = (state: State) => ({});

const mapDispatchToProps = {
  setAccount,
  setButtonMonthInfo
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(Login);
