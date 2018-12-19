import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { Button } from 'reactstrap';

interface TransactionInfoCloseButtonProps {
  setViewingTransactions: (viewingTransactions: boolean) => void;
}

class TransactionInfoCloseButton extends React.Component<TransactionInfoCloseButtonProps> {
  _closeButtonOnClick = () => {
    this.props.setViewingTransactions(false);
  };

  render() {
    return (
      <div className="closeButton">
        <Button
          className="btn btn-default btn-round-lg btn-lg round"
          onClick={(e: any) => this._closeButtonOnClick()}
        >
          <Glyphicon glyph="remove" />
        </Button>
      </div>
    );
  }
}
export default TransactionInfoCloseButton;
