import * as React from 'react';

interface DisplayMoneyProps {
  balance: number;
  transactionRow: boolean;
}

class DisplayMoney extends React.Component<DisplayMoneyProps> {
  currencyPrefix(input: number, includePlusSymbol: boolean): string {
    if (input < 0) {
      return '-£';
    } else if (includePlusSymbol) {
      return '+£';
    } else {
      return '£';
    }
  }

  toCommas = (value: string) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  absoluteDivide100(input: number): JSX.Element {
    return (
      <span className="large">
        {this.toCommas(
          Math.abs(input / 100)
            .toFixed(2)
            .split('.')[0]
        )}
      </span>
    );
  }

  render() {
    return (
      <div className="money">
        <span className="small">
          {this.currencyPrefix(this.props.balance, this.props.transactionRow)}
        </span>
        <span className="large">{this.absoluteDivide100(this.props.balance)}</span>
        {'.'}
        <span className="small">{(this.props.balance / 100).toFixed(2).split('.')[1]}</span>
      </div>
    );
  }
}
export default DisplayMoney;
