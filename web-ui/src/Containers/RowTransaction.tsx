import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import { addToPayeeCache, setPayeeSummaryBeingViewed } from '../Actions/PayeeActions';
import { setViewingTransactions, setTransactionBeingViewed } from '../Actions/TransactionActions';
import RowTransaction from '../Components/Transactions/RowTransaction';
import {
  getViewingTransactions,
  getTransactionBeingViewed
} from '../Selectors/TransactionSelector';
import { getPayeeCache } from '../Selectors/PayeeSelector';

const mapStateToProps = (state: State) => ({
  viewingTransactions: getViewingTransactions(state),
  transactionBeingViewed: getTransactionBeingViewed(state),
  payeeCache: getPayeeCache(state)
});

const mapDispatchToProps = {
  setViewingTransactions,
  setTransactionBeingViewed,
  setPayeeSummaryBeingViewed,
  addToPayeeCache
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(RowTransaction);
