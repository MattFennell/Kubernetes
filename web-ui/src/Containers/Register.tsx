import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import {
  setTransactions,
  resetTransactions,
  setButtonMonthInfo
} from '../Actions/TransactionActions';
import Register from '../Components/Register/View';
import { getTransactions } from '../Selectors/TransactionSelector';
import { setAccount, resetAccount } from '../Actions/AccountActions';

const mapStateToProps = (state: State) => ({
  transactions: getTransactions(state)
});

const mapDispatchToProps = {
  setTransactions,
  resetTransactions,
  resetAccount,
  setAccount,
  setButtonMonthInfo
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(Register);
