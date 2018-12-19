import * as React from 'react';
import DisplayMoney from '../../Reusable/DisplayMoney';
import TransactionCategoryInfo from './TransactionCategoryInfo';
import * as dateformat from 'dateformat';
import Category from '../../../Models/Category';
import Transaction from '../../../Models/Types/Transaction';
import { CategoriesMeta } from '../../../Models/Interfaces/CategoriesMeta';

interface TransactionInfoHeaderProps {
  setTransactionCategory: (category: Category) => void;
  transactionBeingViewed: Transaction;
  categories: Array<Category>;
  meta: CategoriesMeta;
}

class TransactionInfoHeader extends React.Component<TransactionInfoHeaderProps> {
  _returnDateString = (date: Date) => {
    return dateformat(date, 'dddd dd mmm yyyy');
  };

  render() {
    const { date, payee, amount } = this.props.transactionBeingViewed;
    const transaction = this.props.transactionBeingViewed;
    const categories = this.props.categories;
    const categoriesMeta = this.props.meta;
    const setTransactionCategory = this.props.setTransactionCategory;
    return (
      <div className="transaction-header-info">
        <div className="category-header">
          <TransactionCategoryInfo
            categories={categories}
            transactionBeingViewed={transaction}
            setTransactionCategory={setTransactionCategory}
            meta={categoriesMeta}
          />
        </div>
        <p className="Date">{this._returnDateString(date)}</p>
        <p className="payeeName">{payee.name}</p>
        <div className="amount">
          <DisplayMoney balance={amount} transactionRow={true} />
        </div>
      </div>
    );
  }
}
export default TransactionInfoHeader;
