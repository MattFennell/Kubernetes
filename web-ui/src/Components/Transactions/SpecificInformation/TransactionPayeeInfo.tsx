import * as React from 'react';
import DisplayMoney from '../../Reusable/DisplayMoney';
import * as dateformat from 'dateformat';
import PayeeSummary from '../../../Models/Types/PayeeSummary';

interface TransactionPayeeInfoProps {
  payeeSummary: PayeeSummary;
  payeeName: string;
}

class TransactionPayeeInfo extends React.Component<TransactionPayeeInfoProps> {
  _returnDateString = (date: Date) => {
    return dateformat(date, 'yyyy dddd dd mmm');
  };

  render() {
    const { totalVisits, totalSpend, address } = this.props.payeeSummary;
    return (
      <div className="payee-info-summary">
        <p className="address">{address}</p>
        <hr />
        <p className="payee-history">My {this.props.payeeName} History</p>
        <div className="flex-container">
          <p className="number-of-visits-text">Number of visits</p>
          <p className="number-of-visits-value">{totalVisits}</p>
        </div>
        <div className="flex-container">
          <p className="number-of-visits-text">Average spend</p>
          <p className="number-of-visits-value">
            <DisplayMoney balance={totalSpend / totalVisits} transactionRow={false} />
          </p>
        </div>
        <div className="flex-container">
          <p className="number-of-visits-text">Total spend</p>
          <p className="number-of-visits-value">
            <DisplayMoney balance={totalSpend} transactionRow={false} />
          </p>
        </div>
      </div>
    );
  }
}
export default TransactionPayeeInfo;
