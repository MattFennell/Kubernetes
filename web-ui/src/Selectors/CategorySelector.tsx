import { State } from '../Reducers/root';
import { createSelector } from 'reselect';

const getCategoriesState = (state: State) => state.categories;
export const getCategories = createSelector([getCategoriesState], s => s.categories);
