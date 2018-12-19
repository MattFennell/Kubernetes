import { reducer, initialState } from '../../Reducers/Transactions';
import {
  addTransactionsAbove,
  addTransactionsBelow,
  removeTransactionsAbove,
  removeTransactionsBelow,
  setTransactionBeingViewed,
  ActionTypes
} from '../../Actions/TransactionActions';

const transaction1 = {
  amount: 0,
  category: {
    description: 'General',
    id: 'general'
  },
  date: new Date(),
  description: 'Weekly shop',
  id: '1',
  payee: {
    id: 'tesco',
    name: 'Tesco'
  }
};
const transaction2 = {
  amount: 0,
  category: {
    description: 'General',
    id: 'general'
  },
  date: new Date(),
  description: 'Weekly shop',
  id: '2',
  payee: {
    id: 'tesco',
    name: 'Tesco'
  }
};
const transaction3 = {
  amount: 0,
  category: {
    description: 'General',
    id: 'general'
  },
  date: new Date(),
  description: 'Weekly shop',
  id: '3',
  payee: {
    id: 'tesco',
    name: 'Tesco'
  }
};
const transaction4 = {
  amount: 0,
  category: {
    description: 'General',
    id: 'general'
  },
  date: new Date(),
  description: 'Weekly shop',
  id: '4',
  payee: {
    id: 'tesco',
    name: 'Tesco'
  }
};
const transaction5 = {
  amount: 0,
  category: {
    description: 'General',
    id: 'general'
  },
  date: new Date(),
  description: 'Weekly shop',
  id: '5',
  payee: {
    id: 'tesco',
    name: 'Tesco'
  }
};

const storeWithTransactions = {
  ...initialState,
  transactionBeingViewed: transaction1,
  transactions: [transaction1, transaction2, transaction3],
  transactionNotesMeta: {
    error: '',
    isRequesting: {
      [transaction1.id]: {
        isRequestingAddNotes: false,
        isRequestingDeleteNotes: false
      },
      [transaction2.id]: {
        isRequestingAddNotes: false,
        isRequestingDeleteNotes: false
      },
      [transaction3.id]: {
        isRequestingAddNotes: false,
        isRequestingDeleteNotes: false
      }
    }
  }
};

describe('Transactions reducer', () => {
  it('should add correct transactions above', () => {
    expect(
      reducer(storeWithTransactions, addTransactionsAbove([transaction4, transaction5]))
    ).toEqual({
      ...storeWithTransactions,
      transactions: [transaction4, transaction5, transaction1, transaction2, transaction3],
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        isRequesting: {
          ...storeWithTransactions.transactionNotesMeta.isRequesting,
          [transaction4.id]: {
            isRequestingAddNotes: false,
            isRequestingDeleteNotes: false
          },
          [transaction5.id]: {
            isRequestingAddNotes: false,
            isRequestingDeleteNotes: false
          }
        }
      }
    });
  });

  it('should add correct transactions below', () => {
    expect(
      reducer(storeWithTransactions, addTransactionsBelow([transaction4, transaction5]))
    ).toEqual({
      ...storeWithTransactions,
      transactions: [transaction1, transaction2, transaction3, transaction4, transaction5],
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        isRequesting: {
          ...storeWithTransactions.transactionNotesMeta.isRequesting,
          [transaction4.id]: {
            isRequestingAddNotes: false,
            isRequestingDeleteNotes: false
          },
          [transaction5.id]: {
            isRequestingAddNotes: false,
            isRequestingDeleteNotes: false
          }
        }
      }
    });
  });

  it('should remove correct transactions above', () => {
    expect(reducer(storeWithTransactions, removeTransactionsAbove(1))).toEqual({
      ...storeWithTransactions,
      transactions: [transaction2, transaction3],
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        isRequesting: {
          [transaction2.id]:
            storeWithTransactions.transactionNotesMeta.isRequesting[transaction2.id],
          [transaction3.id]:
            storeWithTransactions.transactionNotesMeta.isRequesting[transaction3.id]
        }
      }
    });
  });

  it('should remove correct transactions below', () => {
    expect(reducer(storeWithTransactions, removeTransactionsBelow(1))).toEqual({
      ...storeWithTransactions,
      transactions: [transaction1, transaction2],
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        isRequesting: {
          [transaction1.id]:
            storeWithTransactions.transactionNotesMeta.isRequesting[transaction1.id],
          [transaction2.id]:
            storeWithTransactions.transactionNotesMeta.isRequesting[transaction2.id]
        }
      }
    });
  });

  it('should reset error message when transaction being viewed changes', () => {
    const storeWithError = {
      ...storeWithTransactions,
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        error: 'Error'
      }
    };
    expect(reducer(storeWithError, setTransactionBeingViewed(transaction2))).toEqual({
      ...storeWithTransactions,
      transactionBeingViewed: transaction2,
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        error: ''
      }
    });
  });

  it('should not add error message after add description failure if transaction is not currently viewed', () => {
    const storeWithRequestingAddNote = {
      ...storeWithTransactions,
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        isRequesting: {
          ...storeWithTransactions.transactionNotesMeta.isRequesting,
          [transaction2.id]: {
            ...storeWithTransactions.transactionNotesMeta.isRequesting[transaction2.id],
            isRequestingAddNotes: true
          }
        }
      }
    };
    expect(
      reducer(storeWithRequestingAddNote, {
        type: ActionTypes.ADD_TRANSACTION_DESCRIPTION_FAILURE,
        payload: {
          id: transaction2.id,
          errorMessage: 'Error'
        }
      })
    ).toEqual(storeWithTransactions);
  });

  it('should add error message after add description failure if transaction is currently viewed', () => {
    const storeWithRequestingAddNote = {
      ...storeWithTransactions,
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        isRequesting: {
          ...storeWithTransactions.transactionNotesMeta.isRequesting,
          [transaction1.id]: {
            ...storeWithTransactions.transactionNotesMeta.isRequesting[transaction1.id],
            isRequestingAddNotes: true
          }
        }
      }
    };
    expect(
      reducer(storeWithRequestingAddNote, {
        type: ActionTypes.ADD_TRANSACTION_DESCRIPTION_FAILURE,
        payload: {
          id: transaction1.id,
          errorMessage: 'Error'
        }
      })
    ).toEqual({
      ...storeWithTransactions,
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        error: 'Error'
      }
    });
  });

  it('should not add error message after delete description failure if transaction is not currently viewed', () => {
    const storeWithRequestingDeleteNote = {
      ...storeWithTransactions,
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        isRequesting: {
          ...storeWithTransactions.transactionNotesMeta.isRequesting,
          [transaction2.id]: {
            ...storeWithTransactions.transactionNotesMeta.isRequesting[transaction2.id],
            isRequestingDeleteNotes: true
          }
        }
      }
    };
    expect(
      reducer(storeWithRequestingDeleteNote, {
        type: ActionTypes.DELETE_TRANSACTION_DESCRIPTION_FAILURE,
        payload: {
          id: transaction2.id,
          errorMessage: 'Error'
        }
      })
    ).toEqual(storeWithTransactions);
  });

  it('should add error message after delete description failure if transaction is currently viewed', () => {
    const storeWithRequestingDeleteNote = {
      ...storeWithTransactions,
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        isRequesting: {
          ...storeWithTransactions.transactionNotesMeta.isRequesting,
          [transaction1.id]: {
            ...storeWithTransactions.transactionNotesMeta.isRequesting[transaction1.id],
            isRequestingDeleteNotes: true
          }
        }
      }
    };
    expect(
      reducer(storeWithRequestingDeleteNote, {
        type: ActionTypes.DELETE_TRANSACTION_DESCRIPTION_FAILURE,
        payload: {
          id: transaction1.id,
          errorMessage: 'Error'
        }
      })
    ).toEqual({
      ...storeWithTransactions,
      transactionNotesMeta: {
        ...storeWithTransactions.transactionNotesMeta,
        error: 'Error'
      }
    });
  });
});
