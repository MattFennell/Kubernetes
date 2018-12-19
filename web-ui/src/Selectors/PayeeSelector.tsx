import { State } from '../Reducers/root';
import { createSelector } from 'reselect';

const getPayeeCacheState = (state: State) => state.payee;
export const getPayeeCache = createSelector([getPayeeCacheState], p => p.payeeCache);

const getPayeeSummaryBeingViewedState = (state: State) => state.payee;
export const getPayeeSummaryBeingViewed = createSelector(
  [getPayeeSummaryBeingViewedState],
  s => s.payeeSummaryBeingViewed
);
