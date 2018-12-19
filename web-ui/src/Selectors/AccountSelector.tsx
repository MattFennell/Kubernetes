import { State } from '../Reducers/root';
import { createSelector } from 'reselect';

const getBalanceState = (state: State) => state.account;
export const getBalance = createSelector([getBalanceState], a => a.balance);

const getFirstNameState = (state: State) => state.account;
export const getFirstName = createSelector([getFirstNameState], s => s.firstName);

const getSurnameState = (state: State) => state.account;
export const getSurname = createSelector([getSurnameState], s => s.surname);
