import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import ButtonMonth from '../Components/Reusable/Header/ButtonMonth';
import { setTransactions, setFetchingTransactions } from '../Actions/TransactionActions';
import { getTransactionsPerPage, getFetchingTransactions } from '../Selectors/TransactionSelector';

const mapStateToProps = (state: State) => ({
  transactionsPerPage: getTransactionsPerPage(state),
  fetchingTransactions: getFetchingTransactions(state)
});

const mapDispatchToProps = {
  setTransactions,
  setFetchingTransactions
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(ButtonMonth);
