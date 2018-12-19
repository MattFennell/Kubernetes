import * as React from 'react';
import Enzyme from './enzyme-setup';
import ButtonMonth from '../../Components/Reusable/Header/ButtonMonth';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import RootReducer from '../../Reducers/root';
import { MonthButtonInfo } from '../../Models/Interfaces/MonthButtonInfo';

const store = createStore(RootReducer);

describe('ButtonMonth', () => {
  it("adds 'month' class to the button as expected", () => {
    let date: MonthButtonInfo = {
      count: 1,
      month: 1,
      year: 2018
    };
    let wrapper = Enzyme.mount(
      <Provider store={store}>
        <Router>
          <ButtonMonth
            key={date.year + '_' + date.month}
            id={date.year + '_' + date.month}
            count={date.count}
            month={date.month}
            year={date.year}
            selectButton={() => {}}
            isSelected={false}
            transactionsPerPage={23}
            fetchingTransactions={0}
            setTransactions={() => {}}
            setFetchingTransactions={() => {}}
            thisMonth={false}
          />
        </Router>
      </Provider>
    );
    expect(wrapper.find('button').hasClass('month')).toBeTruthy();
  });

  it("adds 'no-transactions' classname to the button as expected", () => {
    let date: MonthButtonInfo = {
      count: 0,
      month: 1,
      year: 2018
    };
    let wrapper = Enzyme.mount(
      <Provider store={store}>
        <Router>
          <ButtonMonth
            key={date.year + '_' + date.month}
            id={date.year + '_' + date.month}
            count={date.count}
            month={date.month}
            year={date.year}
            selectButton={() => {}}
            isSelected={false}
            transactionsPerPage={23}
            fetchingTransactions={0}
            setTransactions={() => {}}
            setFetchingTransactions={() => {}}
            thisMonth={false}
          />
        </Router>
      </Provider>
    );
    expect(wrapper.find('button').hasClass('no-transactions')).toBeTruthy();
  });

  it("adds 'selected' classname to the button as expected", () => {
    let date: MonthButtonInfo = {
      count: 1,
      month: 1,
      year: 2018
    };
    let wrapper = Enzyme.mount(
      <Provider store={store}>
        <Router>
          <ButtonMonth
            key={date.year + '_' + date.month}
            id={date.year + '_' + date.month}
            count={date.count}
            month={date.month}
            year={date.year}
            selectButton={() => {}}
            isSelected={true}
            transactionsPerPage={23}
            fetchingTransactions={0}
            setTransactions={() => {}}
            setFetchingTransactions={() => {}}
            thisMonth={false}
          />
        </Router>
      </Provider>
    );
    expect(wrapper.find('button').hasClass('selected')).toBeTruthy();
  });
  it("changes the button's text to `this month` as expected", () => {
    let date: MonthButtonInfo = {
      count: 1,
      month: 1,
      year: 2018
    };
    let wrapper = Enzyme.mount(
      <Provider store={store}>
        <Router>
          <ButtonMonth
            key={date.year + '_' + date.month}
            id={date.year + '_' + date.month}
            count={date.count}
            month={date.month}
            year={date.year}
            selectButton={() => {}}
            isSelected={true}
            transactionsPerPage={23}
            fetchingTransactions={0}
            setTransactions={() => {}}
            setFetchingTransactions={() => {}}
            thisMonth={true}
          />
        </Router>
      </Provider>
    );
    expect(wrapper.find('button').text()).toBe('This month');
  });
});
