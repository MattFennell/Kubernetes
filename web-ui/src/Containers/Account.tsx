import { connect } from 'react-redux';
import { setBalance, setFirstname as setFirstName } from '../Actions/AccountActions';
import AccountBalance from '../Components/Reusable/AccountBalance';
import { State } from '../Reducers/root';
import { getBalance, getFirstName } from '../Selectors/AccountSelector';

const mapStateToProps = (state: State) => ({
  balance: getBalance(state),
  firstName: getFirstName(state)
});

const mapDispatchToProps = {
  setBalance,
  setFirstName,
  getFirstName
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(AccountBalance);
