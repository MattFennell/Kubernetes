import Transaction from '../Models/Types/Transaction';
import { MonthButtonInfo } from '../Models/Interfaces/MonthButtonInfo';
import { addNote, deleteNote, changeTransactionCategory } from '../Services/UserService';
import Category from '../Models/Category';

/*
 * Defining every action name constant here
 * Using Typescript's enum
 * Typescript understands enum better 
 */
export enum ActionTypes {
  ADD_TRANSACTIONS_ABOVE = 'ADD_TRANSACTIONS_ABOVE',
  ADD_TRANSACTIONS_BELOW = 'ADD_TRANSACTIONS_BELOW',
  REMOVE_TRANSACTIONS_ABOVE = 'REMOVE_TRANSACTIONS_ABOVE',
  REMOVE_TRANSACTIONS_BELOW = 'REMOVE_TRANSACTIONS_BELOW',
  SET_TRANSACTIONS = 'SET_TRANSACTIONS',
  RESET_TRANSACTIONS = 'RESET_TRANSACTIONS',
  SET_TRANSACTIONS_PER_PAGE = 'SET_TRANSACTIONS_PER_PAGE',
  SET_BUTTON_MONTH_INFO = 'SET_BUTTON_MONTH_INFO',
  SET_FETCHING_TRANSACTIONS = 'SET_FETCHING_TRANSACTIONS',
  SET_VIEWING_TRANSACTIONS = 'SET_VIEWING_TRANSACTIONS',
  SET_TRANSACTION_BEING_VIEWED = 'SET_TRANSACTION_BEING_VIEWED',
  ADD_TRANSACTION_DESCRIPTION_REQUEST = 'ADD_TRANSACTION_DESCRIPTION_REQUEST',
  ADD_TRANSACTION_DESCRIPTION_SUCCESS = 'ADD_TRANSACTION_DESCRIPTION_SUCCESS',
  ADD_TRANSACTION_DESCRIPTION_FAILURE = 'ADD_TRANSACTION_DESCRIPTION_FAILURE',
  DELETE_TRANSACTION_DESCRIPTION_REQUEST = 'DELETE_TRANSACTION_DESCRIPTION_REQUEST',
  DELETE_TRANSACTION_DESCRIPTION_SUCCESS = 'DELETE_TRANSACTION_DESCRIPTION_SUCCESS',
  DELETE_TRANSACTION_DESCRIPTION_FAILURE = 'DELETE_TRANSACTION_DESCRIPTION_FAILURE',
  SET_TRANSACTION_CATEGORY_REQUEST = 'SET_TRANSACTION_CATEGORY_REQUEST',
  SET_TRANSACTION_CATEGORY_SUCCESS = 'SET_TRANSACTION_CATEGORY_SUCCESS',
  SET_TRANSACTION_CATEGORY_FAILURE = 'SET_TRANSACTION_CATEGORY_FAILURE',
  SET_MONTH_BEING_VIEWED = 'SET_MONTH_BEING_VIEWED'
}

/*
 * Defining return types of actions 
 * Every action returns a type and a payload
 */

export interface AddTransactionsAbove {
  type: ActionTypes.ADD_TRANSACTIONS_ABOVE;
  payload: { transactions: Transaction[] };
}

export interface AddTransactionsBelow {
  type: ActionTypes.ADD_TRANSACTIONS_BELOW;
  payload: { transactions: Transaction[] };
}

export interface RemoveTransactionsAbove {
  type: ActionTypes.REMOVE_TRANSACTIONS_ABOVE;
  payload: { pageSize: number };
}

export interface RemoveTransactionsBelow {
  type: ActionTypes.REMOVE_TRANSACTIONS_BELOW;
  payload: { pageSize: number };
}

export interface SetTransactions {
  type: ActionTypes.SET_TRANSACTIONS;
  payload: { transactions: Transaction[] };
}

export interface ResetTransactions {
  type: ActionTypes.RESET_TRANSACTIONS;
  payload: {};
}

export interface SetTransactionsPerPage {
  type: ActionTypes.SET_TRANSACTIONS_PER_PAGE;
  payload: { transactionsPerPage: number };
}

export interface SetButtonMonthInfo {
  type: ActionTypes.SET_BUTTON_MONTH_INFO;
  payload: { buttonMonthInfo: Array<MonthButtonInfo> };
}

export interface SetFetchingTransactions {
  type: ActionTypes.SET_FETCHING_TRANSACTIONS;
  payload: { fetchingTransactions: number };
}

export interface SetViewingTransactions {
  type: ActionTypes.SET_VIEWING_TRANSACTIONS;
  payload: { viewingTransactions: boolean };
}

export interface SetTransactionBeingViewed {
  type: ActionTypes.SET_TRANSACTION_BEING_VIEWED;
  payload: { transactionBeingViewed: Transaction };
}

export interface AddTransactionDescriptionRequest {
  type: ActionTypes.ADD_TRANSACTION_DESCRIPTION_REQUEST;
  payload: {
    id: string;
  };
}

export interface AddTransactionDescriptionSuccess {
  type: ActionTypes.ADD_TRANSACTION_DESCRIPTION_SUCCESS;
  payload: {
    id: string;
    description: string;
  };
}

export interface AddTransactionDescriptionFailure {
  type: ActionTypes.ADD_TRANSACTION_DESCRIPTION_FAILURE;
  payload: {
    id: string;
    errorMessage: string;
  };
}

export interface DeleteTransactionDescriptionRequest {
  type: ActionTypes.DELETE_TRANSACTION_DESCRIPTION_REQUEST;
  payload: {
    id: string;
  };
}

export interface DeleteTransactionDescriptionSuccess {
  type: ActionTypes.DELETE_TRANSACTION_DESCRIPTION_SUCCESS;
  payload: {
    id: string;
  };
}

export interface DeleteTransactionDescriptionFailure {
  type: ActionTypes.DELETE_TRANSACTION_DESCRIPTION_FAILURE;
  payload: {
    id: string;
    errorMessage: string;
  };
}

export interface SetTransactionCategoryRequest {
  type: ActionTypes.SET_TRANSACTION_CATEGORY_REQUEST;
  payload: {
    id: string;
  };
}

export interface SetTransactionCategorySuccess {
  type: ActionTypes.SET_TRANSACTION_CATEGORY_SUCCESS;
  payload: {
    id: string;
    category: Category;
  };
}

export interface SetTransactionCategoryFailure {
  type: ActionTypes.SET_TRANSACTION_CATEGORY_FAILURE;
  payload: {
    id: string;
    errorMessage: string;
  };
}
export interface SetMonthBeingViewed {
  type: ActionTypes.SET_MONTH_BEING_VIEWED;
  payload: { monthBeingViewed: string };
}

/*
 * Define actions creators
 * Returning the right Action for each function
 */
export const addTransactionsAbove = (transactions: Transaction[]): AddTransactionsAbove => {
  return {
    type: ActionTypes.ADD_TRANSACTIONS_ABOVE,
    payload: {
      transactions
    }
  };
};

export const addTransactionsBelow = (transactions: Transaction[]): AddTransactionsBelow => {
  return {
    type: ActionTypes.ADD_TRANSACTIONS_BELOW,
    payload: {
      transactions
    }
  };
};

export const removeTransactionsAbove = (pageSize: number): RemoveTransactionsAbove => {
  return {
    type: ActionTypes.REMOVE_TRANSACTIONS_ABOVE,
    payload: { pageSize }
  };
};

export const removeTransactionsBelow = (pageSize: number): RemoveTransactionsBelow => {
  return {
    type: ActionTypes.REMOVE_TRANSACTIONS_BELOW,
    payload: { pageSize }
  };
};

export const setTransactions = (transactions: Transaction[]): SetTransactions => {
  return {
    type: ActionTypes.SET_TRANSACTIONS,
    payload: {
      transactions
    }
  };
};

export const resetTransactions = (): ResetTransactions => {
  return {
    type: ActionTypes.RESET_TRANSACTIONS,
    payload: {}
  };
};

export const setTransactionsPerPage = (transactionsPerPage: number): SetTransactionsPerPage => {
  return {
    type: ActionTypes.SET_TRANSACTIONS_PER_PAGE,
    payload: { transactionsPerPage }
  };
};

export const setButtonMonthInfo = (buttonMonthInfo: Array<MonthButtonInfo>): SetButtonMonthInfo => {
  return {
    type: ActionTypes.SET_BUTTON_MONTH_INFO,
    payload: { buttonMonthInfo }
  };
};

export const setFetchingTransactions = (fetchingTransactions: number): SetFetchingTransactions => {
  return {
    type: ActionTypes.SET_FETCHING_TRANSACTIONS,
    payload: { fetchingTransactions }
  };
};

export const setViewingTransactions = (viewingTransactions: boolean): SetViewingTransactions => {
  return {
    type: ActionTypes.SET_VIEWING_TRANSACTIONS,
    payload: { viewingTransactions }
  };
};

export const setTransactionBeingViewed = (
  transactionBeingViewed: Transaction
): SetTransactionBeingViewed => {
  return {
    type: ActionTypes.SET_TRANSACTION_BEING_VIEWED,
    payload: { transactionBeingViewed }
  };
};

const addTransactionDescriptionRequest = (id: string): AddTransactionDescriptionRequest => {
  return {
    type: ActionTypes.ADD_TRANSACTION_DESCRIPTION_REQUEST,
    payload: { id }
  };
};

const addTransactionDescriptionSuccess = (
  id: string,
  description: string
): AddTransactionDescriptionSuccess => {
  return {
    type: ActionTypes.ADD_TRANSACTION_DESCRIPTION_SUCCESS,
    payload: { id, description }
  };
};

export const setMonthBeingViewed = (monthBeingViewed: string): SetMonthBeingViewed => {
  return {
    type: ActionTypes.SET_MONTH_BEING_VIEWED,
    payload: { monthBeingViewed }
  };
};

const addTransactionDescriptionFailure = (
  id: string,
  errorMessage: string
): AddTransactionDescriptionFailure => {
  return {
    type: ActionTypes.ADD_TRANSACTION_DESCRIPTION_FAILURE,
    payload: { id, errorMessage }
  };
};

export const addTransactionDescription = (id: string, description: string) => (dispatch: any) => {
  dispatch(addTransactionDescriptionRequest(id));
  addNote(id, description)
    .then(response => dispatch(addTransactionDescriptionSuccess(id, description)))
    .catch(error => dispatch(addTransactionDescriptionFailure(id, error.message)));
};

const deleteTransactionDescriptionRequest = (id: string): DeleteTransactionDescriptionRequest => {
  return {
    type: ActionTypes.DELETE_TRANSACTION_DESCRIPTION_REQUEST,
    payload: { id }
  };
};

const deleteTransactionDescriptionSuccess = (id: string): DeleteTransactionDescriptionSuccess => {
  return {
    type: ActionTypes.DELETE_TRANSACTION_DESCRIPTION_SUCCESS,
    payload: { id }
  };
};

const deleteTransactionDescriptionFailure = (
  id: string,
  errorMessage: string
): DeleteTransactionDescriptionFailure => {
  return {
    type: ActionTypes.DELETE_TRANSACTION_DESCRIPTION_FAILURE,
    payload: { id, errorMessage }
  };
};

export const deleteTransactionDescription = (id: string) => (dispatch: any) => {
  dispatch(deleteTransactionDescriptionRequest(id));
  deleteNote(id)
    .then(response => dispatch(deleteTransactionDescriptionSuccess(id)))
    .catch(error => dispatch(deleteTransactionDescriptionFailure(id, error.message)));
};

const setTransactionCategoryRequest = (id: string): SetTransactionCategoryRequest => {
  return {
    type: ActionTypes.SET_TRANSACTION_CATEGORY_REQUEST,
    payload: { id }
  };
};

const setTransactionCategorySuccess = (
  id: string,
  category: Category
): SetTransactionCategorySuccess => {
  return {
    type: ActionTypes.SET_TRANSACTION_CATEGORY_SUCCESS,
    payload: { id, category }
  };
};

const setTransactionCategoryFailure = (
  id: string,
  errorMessage: string
): SetTransactionCategoryFailure => {
  return {
    type: ActionTypes.SET_TRANSACTION_CATEGORY_FAILURE,
    payload: { id, errorMessage }
  };
};

export const setTransactionCategory = (transactionId: string, category: Category) => (
  dispatch: any
) => {
  dispatch(setTransactionCategoryRequest(transactionId));
  changeTransactionCategory(transactionId, category.id)
    .then(response => dispatch(setTransactionCategorySuccess(transactionId, category)))
    .catch(error => dispatch(setTransactionCategoryFailure(transactionId, error.message)));
};

/*
 * Defining the Action type
 * It can be one of the types defining in our action directory
 * It will be useful to tell typescript about our types in our reducer
 */

export type Action =
  | AddTransactionsAbove
  | AddTransactionsBelow
  | RemoveTransactionsAbove
  | RemoveTransactionsBelow
  | SetTransactions
  | SetTransactionsPerPage
  | SetButtonMonthInfo
  | SetFetchingTransactions
  | SetViewingTransactions
  | SetTransactionBeingViewed
  | SetMonthBeingViewed
  | ResetTransactions
  | AddTransactionDescriptionRequest
  | AddTransactionDescriptionSuccess
  | AddTransactionDescriptionFailure
  | DeleteTransactionDescriptionRequest
  | DeleteTransactionDescriptionSuccess
  | DeleteTransactionDescriptionFailure
  | SetTransactionCategoryRequest
  | SetTransactionCategorySuccess
  | SetTransactionCategoryFailure;
