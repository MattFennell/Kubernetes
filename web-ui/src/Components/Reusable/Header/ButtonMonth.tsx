import * as React from 'react';
import { MonthButtonInfo } from '../../../Models/Interfaces/MonthButtonInfo';
import Transaction from '../../../Models/Types/Transaction';
import { addTransactionsAbove, addTransactionsBelow } from '../../../Services/UserService';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as BufferSizes from '../../Transactions/TransactionBufferSize';

interface ButtonMonthProps {
  transactionsPerPage: number;
  fetchingTransactions: number;
  setTransactions: (transactions: Array<Transaction>) => void;
  setFetchingTransactions: (fetchingTransactions: number) => void;
  isSelected: boolean;
  selectButton: (targetButton: any) => void;
  id: string;
  thisMonth: boolean;
  setRef?: () => React.RefObject<HTMLElement>;
}

class ButtonMonth extends React.Component<
  MonthButtonInfo & ButtonMonthProps & RouteComponentProps
> {
  _determineMonth(monthNr: number): string {
    let monthNames: Array<string> = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return monthNames[monthNr - 1];
  }
  _fetch = (): void => {
    this.props.setFetchingTransactions(this.props.fetchingTransactions + 1);
    let date = new Date(this.props.year, this.props.month, 1).toISOString();
    date = date.replace(':', '%3A');
    date = date.replace('+', '%2B');
    let transactionsAbove: Array<Transaction>;
    let transactionsBelow: Array<Transaction>;
    addTransactionsAbove(date, this.props.transactionsPerPage * BufferSizes.amountToAddAbove)
      .then(response => {
        transactionsAbove = response;
      })
      .then(() =>
        addTransactionsBelow(date, this.props.transactionsPerPage * BufferSizes.amountToAddBelow)
      )
      .then(response => {
        transactionsBelow = response;
      })
      .then(() => {
        this.props.setTransactions(transactionsAbove.concat(transactionsBelow));
      })
      .then(() => {
        this.props.history.push('#' + this._determineDestination());
        if (this._determineDestination() !== null) {
          let month = document.getElementById(this._determineDestination());
          var top = month!.getBoundingClientRect().top;
          window.scrollBy(0, top - 121);
          month!.classList.add('selectedMonth');
        }
      })
      .then(() => {
        this.props.setFetchingTransactions(this.props.fetchingTransactions - 1);
      });
  };

  _determineClasses = (): string => {
    let className: string = 'month ';
    className += this.props.count === 0 ? 'no-transactions ' : '';
    className += this.props.isSelected ? 'selected ' : '';
    return className;
  };

  _determineDestination = (): string => {
    let dash: string = '-';
    if (this.props.month.toString().length === 1) {
      dash = '-0';
    }
    return this.props.year + dash + this.props.month;
  };
  _generateButtonText = (): string => {
    if (!this.props.thisMonth) {
      return this._determineMonth(this.props.month) + ' ' + this.props.year;
    }
    return 'This month';
  };

  render() {
    const className = this._determineClasses();
    const { isSelected, setRef } = this.props;
    return (
      <button
        ref={isSelected && setRef && (setRef() as any)}
        id={this.props.id}
        className={className}
        onClick={(e: any) => {
          this._fetch();
          this.props.selectButton(e.target);
        }}
      >
        {this._generateButtonText()}
      </button>
    );
  }
}

export default withRouter(ButtonMonth);
