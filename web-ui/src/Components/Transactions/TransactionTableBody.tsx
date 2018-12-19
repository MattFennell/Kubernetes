import * as React from 'react';
import RowTransaction from '../../Containers/RowTransaction';
import Transaction from '../../Models/Types/Transaction';
import * as dateformat from 'dateformat';

interface TransactionsProps {
  transactions: Transaction[];
}

class TransactionTableBody extends React.Component<TransactionsProps> {
  _isToday = (date: Date) => {
    let today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  _isYesterday = (date: Date) => {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  _returnDateString = (date: Date) => {
    return dateformat(date, 'dddd dd mmm yyyy');
  };

  _determineDate = (index: number, transaction: Array<Transaction>) => {
    let currentDate = new Date(transaction[index].date);
    if (index === 0) {
      if (this._isToday(currentDate)) {
        return 'Today';
      } else if (this._isYesterday(currentDate)) {
        return 'Yesterday';
      } else {
        return this._returnDateString(currentDate);
      }
    } else {
      let previousDate = new Date(transaction[index - 1].date);
      if (
        previousDate.getDate() === currentDate.getDate() &&
        previousDate.getMonth() === currentDate.getMonth() &&
        previousDate.getFullYear() === currentDate.getFullYear()
      ) {
        return '';
      } else {
        if (this._isYesterday(currentDate)) {
          return 'Yesterday';
        } else {
          return this._returnDateString(currentDate);
        }
      }
    }
  };

  _determineIfMostRecent = (index: number) => {
    if (index === 0) {
      return true;
    }
    const thisDateID: string = this.props.transactions[index].date.toString().substring(0, 7);
    const prevDateID: string = this.props.transactions[index - 1].date.toString().substring(0, 7);
    return thisDateID !== prevDateID;
  };

  render() {
    return (
      <tbody id="trans">
        {this.props.transactions.map((datum, index) => (
          <RowTransaction
            key={datum.id}
            element={datum}
            dateNeeded={this._determineDate(index, this.props.transactions)}
            mostRecentDateInMonth={this._determineIfMostRecent(index)}
          />
        ))}
        <div className="transaction-history-end">End of Transaction History</div>
      </tbody>
    );
  }
}
export default TransactionTableBody;
