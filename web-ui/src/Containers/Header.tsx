import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import Header from '../Components/Reusable/Header/Header';
import { setAccount } from '../Actions/AccountActions';
import { getSurname, getFirstName } from '../Selectors/AccountSelector';

const mapStateToProps = (state: State) => ({
  firstname: getFirstName(state),
  surname: getSurname(state)
});

const mapDispatchToProps = {
  setAccount
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(Header);
