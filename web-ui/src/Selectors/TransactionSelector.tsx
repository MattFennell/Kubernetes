import { State } from '../Reducers/root';
import { createSelector } from 'reselect';

const getTransactionsState = (state: State) => state.transactions;
export const getTransactions = createSelector([getTransactionsState], s => s.transactions);

const getTransactionsPerPageState = (state: State) => state.transactions;
export const getTransactionsPerPage = createSelector(
  [getTransactionsPerPageState],
  s => s.transactionsPerPage
);

const getButtonMonthInfoState = (state: State) => state.transactions;
export const getButtonMonthInfo = createSelector([getButtonMonthInfoState], s => s.buttonMonthInfo);

const getFetchingTransactionsState = (state: State) => state.transactions;
export const getFetchingTransactions = createSelector(
  [getFetchingTransactionsState],
  s => s.fetchingTransactions
);

const getViewingTransactionsState = (state: State) => state.transactions;
export const getViewingTransactions = createSelector(
  [getViewingTransactionsState],
  s => s.viewingTransactions
);

const getTransactionBeingViewedState = (state: State) => state.transactions;
export const getTransactionBeingViewed = createSelector(
  [getTransactionBeingViewedState],
  s => s.transactionBeingViewed
);

const getTransactionsNotesMeta = (state: State) => state.transactions.transactionNotesMeta;
export const getNotesErrorMessage = createSelector([getTransactionsNotesMeta], meta => meta.error);
export const getCurrentNotesMetaIsRequesting = createSelector(
  [getTransactionBeingViewed, getTransactionsNotesMeta],
  (currentTransaction, notesMeta) => notesMeta.isRequesting[currentTransaction.id]
);

const getTransactionsCategoriesMeta = (state: State) => state.transactions.transactionCategoryMeta;
export const getCurrentCategoriesMeta = createSelector(
  [getTransactionBeingViewed, getTransactionsCategoriesMeta],
  (currentTransaction, transactionCategoryMeta) => transactionCategoryMeta[currentTransaction.id]
);

const getMonthBeingViewedState = (state: State) => state.transactions;
export const getMonthBeingViewed = createSelector(
  [getMonthBeingViewedState],
  s => s.monthBeingViewed
);
