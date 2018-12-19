import * as React from 'react';
import '../../Style/TextScottCash.css';
import { Route } from 'react-router-dom';
import '../../Style/App.css';
import { Row, Col } from 'react-bootstrap';
import { Container } from 'reactstrap';
import CategoryTemplate from '../CategoryTemplate';
import Info from '../../Containers/Info';

interface PageBodyProps {
  viewingTransactions: boolean;
}

class PageBody extends React.Component<PageBodyProps> {
  render() {
    const transactionListColumnWidth = this.props.viewingTransactions ? 6 : 8;
    const transactionListColumnOffset = this.props.viewingTransactions ? 1 : 2;
    const transactionInfoColumnWidth = 4;

    const renderTransactionInfo = () => (
      <Col
        xs={transactionInfoColumnWidth}
        md={transactionInfoColumnWidth}
        lg={transactionInfoColumnWidth}
        className="transaction-info-screen"
      >
        <div id="custom-container" className="unselectable shadow">
          <Route exact path="/balance" component={Info} />
        </div>
      </Col>
    );

    return (
      <Container>
        <Row>
          <Col
            xs={transactionListColumnWidth}
            xsOffset={transactionListColumnOffset}
            md={transactionListColumnWidth}
            mdOffset={transactionListColumnOffset}
            lg={transactionListColumnWidth}
            lgOffset={transactionListColumnOffset}
            className="transaction-list-left"
          >
            <div id="custom-container" className="unselectable shadow">
              <Route exact path="/balance" component={CategoryTemplate} />
            </div>
          </Col>
          {this.props.viewingTransactions && renderTransactionInfo()}
        </Row>
      </Container>
    );
  }
}

export default PageBody;
