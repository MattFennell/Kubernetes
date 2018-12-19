import * as _ from 'lodash';
import { ActionTypes, Action } from '../Actions/TransactionActions';
import Transaction from '../Models/Types/Transaction';
import { MonthButtonInfo } from '../Models/Interfaces/MonthButtonInfo';
import { NotesMeta } from '../Models/Interfaces/NotesMeta';
import { CategoriesMeta } from '../Models/Interfaces/CategoriesMeta';

// Define our State interface for the current reducer
export interface State {
  transactions: Array<Transaction>;
  transactionsPerPage: number;
  buttonMonthInfo: Array<MonthButtonInfo>;
  fetchingTransactions: number;
  viewingTransactions: boolean;
  transactionBeingViewed: Transaction;
  transactionNotesMeta: NotesMeta;
  transactionCategoryMeta: { [id: string]: CategoriesMeta };
  monthBeingViewed: string;
}

// Define our initialState
export const initialState: State = {
  transactions: [],
  transactionsPerPage: 50,
  buttonMonthInfo: [],
  fetchingTransactions: 0,
  viewingTransactions: false,
  transactionBeingViewed: Object.prototype.toString.call(null),
  transactionNotesMeta: { error: '', isRequesting: {} },
  transactionCategoryMeta: {},
  monthBeingViewed: new Date().getFullYear() + '_' + (new Date().getMonth() + 1)
};

const reduceTransactionsToTransactionNotesMetaIsRequesting = (transactions: Array<Transaction>) => {
  return transactions.reduce(
    (
      obj: { [id: string]: { isRequestingAddNotes: boolean; isRequestingDeleteNotes: boolean } },
      transaction
    ) => {
      obj[transaction.id] = {
        isRequestingAddNotes: false,
        isRequestingDeleteNotes: false
      };
      return obj;
    },
    {}
  );
};

const reduceTransactionsToTransactionCategoriesMeta = (transactions: Array<Transaction>) => {
  return transactions.reduce((obj: { [id: string]: CategoriesMeta }, transaction) => {
    obj[transaction.id] = {
      isRequestingChangeCategory: false,
      error: ''
    };
    return obj;
  }, {});
};

/* 
 * Reducer takes 2 arguments
 * state: The state of the reducer. By default initialState ( if there was no state provided)
 * action: Action to be handled.
 */
export const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_TRANSACTIONS: {
      const transactions = action.payload.transactions;

      return {
        ...state,
        transactions,
        transactionNotesMeta: {
          ...state.transactionNotesMeta,
          isRequesting: reduceTransactionsToTransactionNotesMetaIsRequesting(transactions)
        },
        transactionCategoryMeta: reduceTransactionsToTransactionCategoriesMeta(transactions)
      };
    }
    case ActionTypes.SET_TRANSACTIONS_PER_PAGE: {
      const transactionsPerPage = action.payload.transactionsPerPage;
      return {
        ...state,
        transactionsPerPage
      };
    }

    case ActionTypes.SET_BUTTON_MONTH_INFO: {
      const buttonMonthInfo = action.payload.buttonMonthInfo;
      return {
        ...state,
        buttonMonthInfo
      };
    }

    // Concats the server response, adding the response to the start of the array
    case ActionTypes.ADD_TRANSACTIONS_ABOVE: {
      const transactions = action.payload.transactions;

      return {
        ...state,
        transactions: transactions.concat(state.transactions),
        transactionNotesMeta: {
          ...state.transactionNotesMeta,
          isRequesting: _.assign(
            {},
            state.transactionNotesMeta.isRequesting,
            reduceTransactionsToTransactionNotesMetaIsRequesting(transactions)
          )
        }
      };
    }

    // Concats the server response, adding the response to the end of the array
    case ActionTypes.ADD_TRANSACTIONS_BELOW: {
      const transactions = action.payload.transactions;

      return {
        ...state,
        transactions: [...state.transactions].concat(transactions),
        transactionNotesMeta: {
          ...state.transactionNotesMeta,
          isRequesting: _.assign(
            {},
            state.transactionNotesMeta.isRequesting,
            reduceTransactionsToTransactionNotesMetaIsRequesting(transactions)
          )
        }
      };
    }

    // Cuts 'pageSize' transactions off the top
    case ActionTypes.REMOVE_TRANSACTIONS_ABOVE: {
      const transactionsBeingRemoved = state.transactions.slice(0, action.payload.pageSize);
      const transactionIdsBeingRemoved = transactionsBeingRemoved.map(
        transaction => transaction.id
      );

      return {
        ...state,
        transactions: state.transactions.slice(action.payload.pageSize, state.transactions.length),
        transactionNotesMeta: {
          ...state.transactionNotesMeta,
          isRequesting: _.omit(state.transactionNotesMeta.isRequesting, transactionIdsBeingRemoved)
        }
      };
    }

    // Cuts 'pageSize' transactions off the bottom
    case ActionTypes.REMOVE_TRANSACTIONS_BELOW: {
      const transactionsBeingRemoved = state.transactions.slice(
        state.transactions.length - action.payload.pageSize,
        state.transactions.length
      );
      const transactionIdsBeingRemoved = transactionsBeingRemoved.map(
        transaction => transaction.id
      );

      return {
        ...state,
        transactions: state.transactions.slice(
          0,
          state.transactions.length - action.payload.pageSize
        ),
        transactionNotesMeta: {
          ...state.transactionNotesMeta,
          isRequesting: _.omit(state.transactionNotesMeta.isRequesting, transactionIdsBeingRemoved)
        }
      };
    }

    // Cuts 'pageSize' transactions off the bottom
    case ActionTypes.SET_FETCHING_TRANSACTIONS: {
      return {
        ...state,
        fetchingTransactions: action.payload.fetchingTransactions
      };
    }

    case ActionTypes.SET_VIEWING_TRANSACTIONS: {
      return {
        ...state,
        viewingTransactions: action.payload.viewingTransactions
      };
    }

    case ActionTypes.SET_TRANSACTION_BEING_VIEWED: {
      return {
        ...state,
        transactionBeingViewed: action.payload.transactionBeingViewed,
        transactionNotesMeta: {
          ...state.transactionNotesMeta,
          error: ''
        }
      };
    }

    case ActionTypes.SET_MONTH_BEING_VIEWED: {
      return {
        ...state,
        monthBeingViewed: action.payload.monthBeingViewed
      };
    }

    case ActionTypes.RESET_TRANSACTIONS: {
      return initialState;
    }

    case ActionTypes.ADD_TRANSACTION_DESCRIPTION_REQUEST: {
      return {
        ...state,
        transactionNotesMeta: {
          error: '',
          isRequesting: {
            ...state.transactionNotesMeta.isRequesting,
            [action.payload.id]: {
              ...state.transactionNotesMeta.isRequesting[action.payload.id],
              isRequestingAddNotes: true
            }
          }
        }
      };
    }

    case ActionTypes.ADD_TRANSACTION_DESCRIPTION_SUCCESS: {
      return {
        ...state,
        transactions: state.transactions.map(
          transaction =>
            transaction.id === action.payload.id
              ? {
                  ...transaction,
                  description: action.payload.description
                }
              : transaction
        ),
        transactionBeingViewed:
          state.transactionBeingViewed.id === action.payload.id
            ? {
                ...state.transactionBeingViewed,
                description: action.payload.description
              }
            : state.transactionBeingViewed,
        transactionNotesMeta: {
          error: '',
          isRequesting: {
            ...state.transactionNotesMeta.isRequesting,
            [action.payload.id]: {
              ...state.transactionNotesMeta.isRequesting[action.payload.id],
              isRequestingAddNotes: false
            }
          }
        }
      };
    }

    case ActionTypes.ADD_TRANSACTION_DESCRIPTION_FAILURE: {
      return {
        ...state,
        transactionNotesMeta: {
          error:
            action.payload.id === state.transactionBeingViewed.id
              ? action.payload.errorMessage
              : state.transactionNotesMeta.error,
          isRequesting: {
            ...state.transactionNotesMeta.isRequesting,
            [action.payload.id]: {
              ...state.transactionNotesMeta.isRequesting[action.payload.id],
              isRequestingAddNotes: false
            }
          }
        }
      };
    }

    case ActionTypes.DELETE_TRANSACTION_DESCRIPTION_REQUEST: {
      return {
        ...state,
        transactionNotesMeta: {
          error: '',
          isRequesting: {
            ...state.transactionNotesMeta.isRequesting,
            [action.payload.id]: {
              ...state.transactionNotesMeta.isRequesting[action.payload.id],
              isRequestingDeleteNotes: true
            }
          }
        }
      };
    }

    case ActionTypes.DELETE_TRANSACTION_DESCRIPTION_SUCCESS: {
      return {
        ...state,
        transactions: state.transactions.map(
          transaction =>
            transaction.id === action.payload.id
              ? {
                  ...transaction,
                  description: ''
                }
              : transaction
        ),
        transactionBeingViewed:
          state.transactionBeingViewed.id === action.payload.id
            ? {
                ...state.transactionBeingViewed,
                description: ''
              }
            : state.transactionBeingViewed,
        transactionNotesMeta: {
          error: '',
          isRequesting: {
            ...state.transactionNotesMeta.isRequesting,
            [action.payload.id]: {
              ...state.transactionNotesMeta.isRequesting[action.payload.id],
              isRequestingDeleteNotes: false
            }
          }
        }
      };
    }

    case ActionTypes.DELETE_TRANSACTION_DESCRIPTION_FAILURE: {
      return {
        ...state,
        transactionNotesMeta: {
          error:
            action.payload.id === state.transactionBeingViewed.id
              ? action.payload.errorMessage
              : state.transactionNotesMeta.error,
          isRequesting: {
            ...state.transactionNotesMeta.isRequesting,
            [action.payload.id]: {
              ...state.transactionNotesMeta.isRequesting[action.payload.id],
              isRequestingDeleteNotes: false
            }
          }
        }
      };
    }

    case ActionTypes.SET_TRANSACTION_CATEGORY_REQUEST: {
      return {
        ...state,
        transactionCategoryMeta: {
          ...state.transactionCategoryMeta,
          [action.payload.id]: {
            ...state.transactionCategoryMeta[action.payload.id],
            isRequestingChangeCategory: true,
            error: ''
          }
        }
      };
    }

    case ActionTypes.SET_TRANSACTION_CATEGORY_SUCCESS: {
      return {
        ...state,
        transactions: state.transactions.map(
          transaction =>
            transaction.id === action.payload.id
              ? {
                  ...transaction,
                  category: action.payload.category
                }
              : transaction
        ),
        transactionBeingViewed:
          state.transactionBeingViewed.id === action.payload.id
            ? {
                ...state.transactionBeingViewed,
                category: action.payload.category
              }
            : state.transactionBeingViewed,
        transactionCategoryMeta: {
          ...state.transactionCategoryMeta,
          [action.payload.id]: {
            ...state.transactionCategoryMeta[action.payload.id],
            isRequestingChangeCategory: false,
            error: ''
          }
        }
      };
    }

    case ActionTypes.SET_TRANSACTION_CATEGORY_FAILURE: {
      return {
        ...state,
        transactionCategoryMeta: {
          ...state.transactionCategoryMeta,
          [action.payload.id]: {
            ...state.transactionCategoryMeta[action.payload.id],
            isRequestingChangeCategory: false,
            error: action.payload.errorMessage
          }
        }
      };
    }

    default:
      return state;
  }
};
