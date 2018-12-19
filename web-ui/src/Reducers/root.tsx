import { combineReducers } from 'redux';
import { reducer as transactions, State as TransactionsState } from './Transactions';
import { reducer as categories, State as CategoriesState } from './Categories';
import { reducer as account, State as AccountState } from './Account';
import { reducer as payee, State as PayeeState } from './Payee';
import { reducer as formReducer, FormReducer } from 'redux-form';

export interface State {
  account: AccountState;
  transactions: TransactionsState;
  payee: PayeeState;
  formReducer: FormReducer;
  categories: CategoriesState;
}

const rootReducer = combineReducers<State>({
  account,
  transactions,
  payee,
  form: formReducer,
  categories
} as any);
export default rootReducer;
