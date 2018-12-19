import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import { setViewingTransactions } from '../Actions/TransactionActions';
import TransactionInfoCloseButton from '../Components/Transactions/SpecificInformation/TransactionInfoCloseButton';

const mapStateToProps = (state: State) => ({});

const mapDispatchToProps = {
  setViewingTransactions
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(TransactionInfoCloseButton);
