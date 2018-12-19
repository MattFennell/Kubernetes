import * as React from 'react';
import Enzyme from './enzyme-setup';
import RowTransaction from '../../Components/Transactions/RowTransaction';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import RootReducer from '../../Reducers/root';
import Transaction from '../../Models/Types/Transaction';
import PayeeSummary from '../../Models/Types/PayeeSummary';
import Category from '../../Models/Category';
import Payee from '../../Models/Payee';

const category: Category = {
  description: 'category description',
  id: 'category id'
};

const payee: Payee = {
  id: 'payee id',
  name: 'payee name'
};

const transaction: Transaction = {
  amount: 100,
  category: category,
  date: new Date(),
  description: 'transaction description',
  id: 'transaction id',
  payee: payee
};

const payeeSummary: PayeeSummary = {
  totalVisits: 10,
  totalSpend: 10,
  address: 'address'
};

const store = createStore(RootReducer);

describe('RowTransaction', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = Enzyme.mount(
      <Provider store={store}>
        <Router>
          <RowTransaction
            element={transaction}
            dateNeeded={''}
            mostRecentDateInMonth={true}
            setViewingTransactions={() => {}}
            setTransactionBeingViewed={() => {}}
            setPayeeSummaryBeingViewed={() => {}}
            payeeSummaryBeingViewed={payeeSummary}
            payeeCache={[]}
            addToPayeeCache={() => {}}
          />
        </Router>
      </Provider>
    );
  });

  it('For a positive transaction of 100 pence, there should be a table data with the correct value displayed in pounds to two decimal places with +£ as the prefix', () => {
    expect(wrapper.find('td.transaction-currency.positive').text()).toBe('+£1.00');
  });

  it('For a positive transaction, there should be a table data with id "positive"', () => {
    expect(wrapper.exists('td.transaction-currency.positive')).toEqual(true);
  });

  it('For a negative transaction, there should not be a table data with id "positive"', () => {
    transaction.amount = -100;
    wrapper = Enzyme.shallow(
      <RowTransaction
        element={transaction}
        dateNeeded={''}
        mostRecentDateInMonth={false}
        setViewingTransactions={() => {}}
        setTransactionBeingViewed={() => {}}
        setPayeeSummaryBeingViewed={() => {}}
        payeeSummaryBeingViewed={payeeSummary}
        payeeCache={[]}
        addToPayeeCache={() => {}}
      />
    );
    expect(wrapper.exists('td.transaction-currency.positive')).toEqual(false);
  });

  it('For a transaction with a dateNeeded prop, a row with class "date-row" should be generated', () => {
    wrapper = Enzyme.shallow(
      <RowTransaction
        element={transaction}
        dateNeeded={'test'}
        mostRecentDateInMonth={false}
        setViewingTransactions={() => {}}
        setTransactionBeingViewed={() => {}}
        setPayeeSummaryBeingViewed={() => {}}
        payeeSummaryBeingViewed={payeeSummary}
        payeeCache={[]}
        addToPayeeCache={() => {}}
      />
    );
    expect(wrapper.exists('tr.date-row')).toEqual(true);
  });

  it('For a transaction without a dateNeeded prop, a row with class "date-row" should not be generated', () => {
    wrapper = Enzyme.shallow(
      <RowTransaction
        element={transaction}
        dateNeeded={''}
        mostRecentDateInMonth={false}
        setViewingTransactions={() => {}}
        setTransactionBeingViewed={() => {}}
        setPayeeSummaryBeingViewed={() => {}}
        payeeSummaryBeingViewed={payeeSummary}
        payeeCache={[]}
        addToPayeeCache={() => {}}
      />
    );
    expect(wrapper.exists('tr.date-row')).toEqual(false);
  });
});
