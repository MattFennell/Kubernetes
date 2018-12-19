import { ActionTypes, Action } from '../Actions/PayeeActions';
import PayeeSummary from '../Models/Types/PayeeSummary';

export interface State {
  payeeCache: {};
  payeeSummaryBeingViewed: PayeeSummary;
}

export const initialState: State = {
  payeeCache: {} as { payee: { id: string; payee: PayeeSummary } },
  payeeSummaryBeingViewed: Object.prototype.toString.call(null)
};

export const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.ADD_TO_PAYEE_CACHE: {
      return {
        ...state,
        payeeCache: {
          ...state.payeeCache,
          [action.payload.id]: action.payload.payeeToAdd
        }
      };
    }
    case ActionTypes.SET_PAYEE_SUMMARY_BEING_VIEWED: {
      return {
        ...state,
        payeeSummaryBeingViewed: action.payload.payeeSummaryBeingViewed
      };
    }
    default:
      return state;
  }
};
