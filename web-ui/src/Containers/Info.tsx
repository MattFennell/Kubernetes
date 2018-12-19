import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import {
  addTransactionDescription,
  deleteTransactionDescription,
  setTransactionCategory
} from '../Actions/TransactionActions';
import Info from '../Components/Transactions/Info';
import {
  getTransactionBeingViewed,
  getNotesErrorMessage,
  getCurrentNotesMetaIsRequesting,
  getCurrentCategoriesMeta
} from '../Selectors/TransactionSelector';
import { getCategories } from '../Selectors/CategorySelector';
import { getPayeeSummaryBeingViewed } from '../Selectors/PayeeSelector';

const mapStateToProps = (state: State) => ({
  transactionBeingViewed: getTransactionBeingViewed(state),
  payeeSummaryBeingViewed: getPayeeSummaryBeingViewed(state),
  notesMeta: {
    error: getNotesErrorMessage(state),
    ...getCurrentNotesMetaIsRequesting(state)
  },
  categories: getCategories(state),
  categoriesMeta: getCurrentCategoriesMeta(state)
});

const mapDispatchToProps = {
  addTransactionDescription,
  deleteTransactionDescription,
  setTransactionCategory
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(Info);
