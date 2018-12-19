import * as React from 'react';
import Transaction from '../../Models/Types/Transaction';
import Icon from './Icons/Icon';
import DisplayMoney from '../Reusable/DisplayMoney';
import classNames from 'classnames';
import PayeeSummary from '../../Models/Types/PayeeSummary';
import { getPayeeSummary } from '../../Services/UserService';

interface RowTransactionProps {
  element: Transaction;
  dateNeeded: string;
  mostRecentDateInMonth: boolean;
  setViewingTransactions: (viewingTransactions: boolean) => void;
  setTransactionBeingViewed: (viewingTransactions: Transaction) => void;
  setPayeeSummaryBeingViewed: (payeeSummaryBeingViewed: PayeeSummary) => void;
  payeeSummaryBeingViewed: PayeeSummary;
  payeeCache: any;
  addToPayeeCache: (id: string, payeeSummary: PayeeSummary) => void;
}

class RowTransaction extends React.Component<RowTransactionProps> {
  handleRowClick = () => {
    let payeeId = this.props.element.payee.id;

    let {
      setPayeeSummaryBeingViewed,
      setTransactionBeingViewed,
      setViewingTransactions,
      addToPayeeCache,
      payeeCache,
      element
    } = this.props;

    // If the payee is already in the cache, set the payee information and which transaction to look at
    if (payeeCache[payeeId]) {
      setPayeeSummaryBeingViewed(payeeCache[payeeId]);
      setTransactionBeingViewed(element);
      setViewingTransactions(true);
    } else {
      // Otherwise get the response from the server about the summary info and add the payee to the cache
      getPayeeSummary(payeeId)
        .then(response => {
          setPayeeSummaryBeingViewed(response);
          addToPayeeCache(payeeId, response);
        })
        .then(() => {
          setTransactionBeingViewed(element);
        })
        .then(() => {
          setViewingTransactions(true);
        });
    }
  };

  _uniqueName = (): string => {
    return this.props.element.date.toString().substring(0, 7);
  };
  _transactionJSX = () => {
    const { category, payee, amount, id } = this.props.element;
    return (
      <tr className="transaction" key={id} onClick={() => this.handleRowClick()}>
        <td className="transaction-icon">
          <Icon name={category.description} />
        </td>
        <td className="payee">{payee.name}</td>
        <td
          className={classNames('transaction-currency', {
            positive: amount > 0
          })}
        >
          <DisplayMoney balance={amount} transactionRow={true} />
        </td>
      </tr>
    );
  };
  render() {
    if (this.props.mostRecentDateInMonth) {
      return (
        <React.Fragment>
          <tr id={this._uniqueName()} className="date-row">
            <td className="date" colSpan={3}>
              {this.props.dateNeeded}
            </td>
          </tr>
          {this._transactionJSX()}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {this.props.dateNeeded ? (
            <tr className="date-row">
              <td className="date" colSpan={3}>
                {this.props.dateNeeded}
              </td>
            </tr>
          ) : null}
          {this._transactionJSX()}
        </React.Fragment>
      );
    }
  }
}
export default RowTransaction;
