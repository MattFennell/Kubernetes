import * as React from 'react';
import Enzyme from './enzyme-setup';
import TransactionCategoryInfo from '../../Components/Transactions/SpecificInformation/TransactionCategoryInfo';
import Category from '../../Models/Category';

const meta = {
  isRequestingChangeCategory: false,
  error: ''
};
const category1 = {
  id: 'cat1',
  description: 'Category1'
};
const category2 = {
  id: 'cat2',
  description: 'Category2'
};
const categories = [category1, category2];
const transaction = {
  amount: 100,
  category: category1,
  date: new Date('2018-12-05T13:40:36.742+0000'),
  description: '',
  id: 'transaction1',
  payee: {
    name: 'payeeTest',
    id: 'payee1'
  }
};

describe('TransactionCategoryInfo', () => {
  it('displays existing category', () => {
    const wrapper = Enzyme.render(
      <TransactionCategoryInfo
        categories={categories}
        transactionBeingViewed={transaction}
        setTransactionCategory={(category: Category) => {}}
        meta={meta}
      />
    );
    expect(wrapper.find('.category-menu-toggle')).toBeDefined();
    expect(wrapper.find('.category-menu-toggle').text()).toEqual(category1.description + ' ▼');
  });
});
