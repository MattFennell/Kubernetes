import Category from '../Models/Category';
import { ActionTypes, Action } from '../Actions/CategoryActions';

// Define our State interface for the current reducer
export interface State {
  categories: Array<Category>;
}

// Define our initialState
export const initialState: State = {
  categories: []
};

/* 
 * Reducer takes 2 arguments
 * state: The state of the reducer. By default initialState ( if there was no state provided)
 * action: Action to be handled.
 */
export const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_CATEGORIES: {
      const categories = action.payload.categories;
      return {
        ...state,
        categories
      };
    }
    default:
      return state;
  }
};
