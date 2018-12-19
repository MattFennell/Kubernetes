import PayeeSummary from '../Models/Types/PayeeSummary';

export enum ActionTypes {
  ADD_TO_PAYEE_CACHE = 'ADD_TO_PAYEE_CACHE',
  SET_PAYEE_SUMMARY_BEING_VIEWED = 'SET_PAYEE_SUMMARY_BEING_VIEWED'
}

export interface AddToPayeeCache {
  type: ActionTypes.ADD_TO_PAYEE_CACHE;
  payload: { id: string; payeeToAdd: PayeeSummary };
}

export interface SetPayeeSummaryBeingViewed {
  type: ActionTypes.SET_PAYEE_SUMMARY_BEING_VIEWED;
  payload: { payeeSummaryBeingViewed: PayeeSummary };
}

export const addToPayeeCache = (id: string, payeeToAdd: PayeeSummary): AddToPayeeCache => {
  return {
    type: ActionTypes.ADD_TO_PAYEE_CACHE,
    payload: { id, payeeToAdd }
  };
};

export const setPayeeSummaryBeingViewed = (
  payeeSummaryBeingViewed: PayeeSummary
): SetPayeeSummaryBeingViewed => {
  return {
    type: ActionTypes.SET_PAYEE_SUMMARY_BEING_VIEWED,
    payload: { payeeSummaryBeingViewed }
  };
};

export type Action = AddToPayeeCache | SetPayeeSummaryBeingViewed;
