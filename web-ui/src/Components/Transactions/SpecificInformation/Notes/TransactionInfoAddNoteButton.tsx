import * as React from 'react';
import { Button } from 'reactstrap';

interface Props {
  onClick: (e: any) => void;
}

class TransactionInfoAddNoteButton extends React.Component<Props> {
  render() {
    const { onClick } = this.props;

    return (
      <Button
        className="btn btn-default btn-round-lg btn-lg second"
        id="btnAddNote"
        onClick={onClick}
      >
        Add Note
      </Button>
    );
  }
}
export default TransactionInfoAddNoteButton;
