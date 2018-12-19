import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import {
  setTransactions,
  addTransactionsAbove,
  addTransactionsBelow,
  removeTransactionsAbove,
  removeTransactionsBelow,
  setTransactionsPerPage,
  setFetchingTransactions,
  setTransactionCategory,
  setMonthBeingViewed
} from '../Actions/TransactionActions';
import { setCategories } from '../Actions/CategoryActions';
import Transactions from '../Components/Transactions/View';
import {
  getTransactions,
  getTransactionsPerPage,
  getFetchingTransactions,
  getMonthBeingViewed
} from '../Selectors/TransactionSelector';

import { getPayeeCache } from '../Selectors/PayeeSelector';
import { addToPayeeCache } from '../Actions/PayeeActions';

const mapStateToProps = (state: State) => ({
  transactionsPerPage: getTransactionsPerPage(state),
  transactions: getTransactions(state),
  fetchingTransactions: getFetchingTransactions(state),
  payeeCache: getPayeeCache(state),
  monthBeingViewed: getMonthBeingViewed(state)
});

const mapDispatchToProps = {
  setTransactions,
  addTransactionsAbove,
  addTransactionsBelow,
  removeTransactionsAbove,
  removeTransactionsBelow,
  setTransactionsPerPage,
  setFetchingTransactions,
  addToPayeeCache,
  setTransactionCategory,
  setCategories,
  setMonthBeingViewed
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(Transactions);
