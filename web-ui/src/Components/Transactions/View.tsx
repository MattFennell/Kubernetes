import * as React from 'react';
import '../../Style/Transactions.css';
import TransactionTableBody from './TransactionTableBody';
import Transaction from '../../Models/Types/Transaction';
import Category from '../../Models/Category';
import PayeeSummary from '../../Models/Types/PayeeSummary';
import {
  getTransactions,
  addTransactionsBelow,
  addTransactionsAbove,
  getPayeeSummary,
  getCategories
} from '../../Services/UserService';
import AccountBalance from '../../Containers/Account';
import { Table, Col, Row } from 'reactstrap';
import * as BufferSizes from './TransactionBufferSize';

interface TransactionsProps {
  transactions: Transaction[];
  transactionsPerPage: number;
  fetchingTransactions: number;
  setTransactions: (trans: Transaction[]) => void;
  addTransactionsAbove: (trans: Transaction[]) => void;
  addTransactionsBelow: (trans: Transaction[]) => void;
  removeTransactionsAbove: (pageSize: number) => void;
  removeTransactionsBelow: (pageSize: number) => void;
  setTransactionsPerPage: (transactionsPerPage: number) => void;
  setFetchingTransactions: (fetchingTransactions: number) => void;
  payeeCache: any;
  addToPayeeCache: (id: string, payeeSummary: PayeeSummary) => void;
  setCategories: (cats: Category[]) => void;
  setMonthBeingViewed: (monthBeingViewed: string) => void;
}

interface TransactionsState {
  monthBeingViewed: string;
  minimumDate: Date;
  maximumDate: Date;
  addingToCache: any;
}

class Transactions extends React.Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    // Overestimate the max rows per page (better to load too many than too few)
    this.state = {
      monthBeingViewed: new Date().getFullYear() + '_' + (new Date().getMonth() + 1),
      minimumDate: new Date(-8640000000000000),
      maximumDate: new Date(8640000000000000),
      addingToCache: {} as { payee: { id: string; payee: PayeeSummary } }
    };

    this._addTransactionsBottom = this._addTransactionsBottom.bind(this);
    this._addTransactionsAbove = this._addTransactionsAbove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.updateDimensions);
    // Initially load transactions starting from today
    let date = new Date().toISOString();
    date = date.replace(':', '%3A');
    date = date.replace('+', '%2B');
    this.props.setFetchingTransactions(this.props.fetchingTransactions + 1);
    getTransactions(date, this.props.transactionsPerPage * BufferSizes.initialFetchSize)
      .then(response => {
        // Set the redux store to these transactions
        // Toggle boolean for whether we are waiting for a response from the server

        this.props.setTransactions(response);
        this.props.setFetchingTransactions(this.props.fetchingTransactions - 1);

        // An overestimate
        this.props.setTransactionsPerPage(
          Math.floor(window.innerHeight / this._determineHeightOfRows()) *
            BufferSizes.initialFetchSize
        );
      })
      .then(() => {
        this.addPayeesToCache(this.props.transactions);
      });
    getCategories().then(response => {
      this.props.setCategories(response);
    });

    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.updateDimensions);
  }

  _determineHeightOfRows = (): number => {
    let dateHeight = $('.date-row').height();
    let transactionHeight = $('.transaction').height();
    let bodyHeight;

    if (dateHeight !== undefined && transactionHeight !== undefined) {
      bodyHeight = dateHeight + transactionHeight;
    } else {
      bodyHeight = 85;
    }
    return bodyHeight;
  };

  // When the dimensions of the screen change (zoom in or out), update the max rows per line
  // This method is costly in performance
  updateDimensions() {
    const bodyHeight = this._determineHeightOfRows();

    // An overestimate
    this.props.setTransactionsPerPage(
      Math.floor(window.innerHeight / bodyHeight) * BufferSizes.initialFetchSize
    );
  }

  // Return 0 if the element is below the viewport
  // Return 1 if it the element is above the viewport
  // Return a number between 0-1 indicating it's y-position in the viewport
  // Should take into account the height of the header for more accurate visibility result.
  visibility(obj: HTMLElement) {
    let headerHeight = jQuery($('#header')).height();
    let windowWidth = jQuery(window).width();
    let windowHeight = jQuery(window).height();
    let objRectangle = obj.getBoundingClientRect();
    let elementWidth = objRectangle.width;
    let elementHeight = objRectangle.height;
    if (headerHeight) {
      elementHeight = elementHeight - headerHeight;
    }
    if (
      windowWidth !== undefined &&
      windowHeight !== undefined &&
      elementWidth !== undefined &&
      elementHeight !== undefined
    ) {
      let y1 = objRectangle.top - windowHeight;
      let y2 = objRectangle.top + elementHeight;
      return Math.max(0, Math.min((0 - y1) / (y2 - y1), 1));
    } else {
      return 0.5;
    }
  }

  // Finds the last table viewable element on the page out of an array of HTML elements
  // Does a binary search - the element directly beneath the last element should have a value of 0 (from this.visibility)
  // Will always return final element in array when at bottom of page, even if it's not visible rather than searching infinite
  findLastOnPage(elements: JQuery<HTMLElement>, start: number, end: number): number {
    if (start >= elements.length - 3) {
      return elements.length - 1;
    }
    let mid = Math.floor((start + end) / 2);
    let vis = this.visibility(elements.get(mid));
    if (vis === 0) {
      return this.findLastOnPage(elements, start, mid);
    } else if (vis === 1) {
      return this.findLastOnPage(elements, mid, end);
    } else {
      if (this.visibility(elements.get(mid + 1)) === 0) {
        return mid;
      }
      if (start + 1 === end) {
        return mid + 1;
      }
      return this.findLastOnPage(elements, mid, end);
    }
  }

  // Same as findLastOnPage but finds the first element on the page
  findFirstOnPage(elements: JQuery<HTMLElement>, start: number, end: number): number {
    if (start >= elements.length - 3) {
      return elements.length - 1;
    }
    let mid = Math.floor((start + end) / 2);
    let vis = this.visibility(elements.get(mid));
    if (vis === 0) {
      return this.findFirstOnPage(elements, start, mid);
    } else if (vis === 1) {
      return this.findFirstOnPage(elements, mid, end);
    } else {
      if (this.visibility(elements.get(mid - 1)) === 1 || mid === 0) {
        return mid;
      }
      return this.findFirstOnPage(elements, start, mid);
    }
  }

  findFirstVisibleTransactionIndex(elements: JQuery<HTMLElement>): number {
    for (let i = 0; i < elements.length; i++) {
      if (this.visibility(elements.get(i)) < 1) {
        return i;
      }
    }
    return elements.length - 1;
  }

  addPayeesToCache(transaction: Array<Transaction>) {
    transaction.forEach(t => {
      if (
        this.props.payeeCache[t.payee.id] === undefined &&
        this.state.addingToCache[t.payee.id] === undefined
      ) {
        // This essentially toggles a boolean for each payee id, so we only fire off 1 request per payee at a time
        let state = this.state.addingToCache;
        state[t.payee.id] = true;
        this.setState({ addingToCache: state });
        getPayeeSummary(t.payee.id)
          .then(response => {
            this.props.addToPayeeCache(t.payee.id, response);
          })
          .then(() => {
            let state = this.state.addingToCache;
            state[t.payee.id] = undefined;
            this.setState({ addingToCache: state });
          });
      }
    });
  }

  // Add transactions below (requests for more based off the date of the last transaction)
  addBelow() {
    let date = this.props.transactions[this.props.transactions.length - 1].date.toString();
    date = date.replace(':', '%3A');
    date = date.replace('+', '%2B');
    this.props.setFetchingTransactions(this.props.fetchingTransactions + 1);
    addTransactionsBelow(date, this.props.transactionsPerPage * BufferSizes.amountToAddBelow)
      .then(response => {
        this._addTransactionsBottom(response);
      })
      .then(() => this.props.setFetchingTransactions(this.props.fetchingTransactions - 1));
  }

  // Add transactions above (requests for more based off the date of the first transaction)
  addAbove(pageSize: number) {
    if (this.props.transactions !== undefined) {
      let date = this.props.transactions[0].date.toString();
      date = date.replace(':', '%3A');
      date = date.replace('+', '%2B');

      this.props.setFetchingTransactions(this.props.fetchingTransactions + 1);
      addTransactionsAbove(date, pageSize * BufferSizes.amountToAddAbove)
        .then(response => {
          this._addTransactionsAbove(response);
        })
        .then(() => this.props.setFetchingTransactions(this.props.fetchingTransactions - 1));
    }
  }

  handleScroll() {
    // Don't load more transactions if waiting for a response from the server
    if (this.props.fetchingTransactions === 0 && this.props.transactions.length > 0) {
      let mostRecentDate = new Date(this.props.transactions[0].date);
      let latestDate = new Date(this.props.transactions[this.props.transactions.length - 1].date);

      let tbodys: JQuery<HTMLElement> = $('#trans').children();
      let tbodysTransactionOnly: JQuery<HTMLElement> = $('#trans').children('.transaction');

      let firstIndex = this.findFirstOnPage(tbodys, 0, tbodys.length - 1);
      let lastIndex = this.findLastOnPage(tbodys, 0, tbodys.length - 1);
      let firstVisibleIndex = this.findFirstVisibleTransactionIndex(tbodysTransactionOnly);

      let needToAddAbove: boolean = false;
      let needToAddBelow: boolean = false;
      let needToDelAbove: boolean = false;
      let needToDelBelow: boolean = false;

      // Checks if the first fully visible transaction has the same date as monthBeingViewed and updates monthBeingViewed if not.
      if (this.props.transactions[firstVisibleIndex]) {
        let firstFullyVisibleTransactionDate: Date = new Date(
          this.props.transactions[firstVisibleIndex].date
        );
        let firstFullyVisibleTransactionMonth: string =
          firstFullyVisibleTransactionDate.getFullYear() +
          '_' +
          (firstFullyVisibleTransactionDate.getMonth() + 1);
        if (this.state.monthBeingViewed !== firstFullyVisibleTransactionMonth) {
          this.props.setMonthBeingViewed(firstFullyVisibleTransactionMonth);
          this.setState({
            monthBeingViewed: firstFullyVisibleTransactionMonth
          });
        }
      }

      // If less than twice as many rows can be displayed in a page are below, then add <insertBufferBelow from TransactionBufferSize.tsx> pages worth below
      if (
        tbodys.length - lastIndex <
          BufferSizes.insertBufferBelow * this.props.transactionsPerPage &&
        latestDate > this.state.minimumDate
      ) {
        needToAddBelow = true;

        // If more than <deleteBufferBelow from TransactionBufferSize.tsx> times as many can be showed on a page below, remove a pages worth below
      } else if (
        tbodys.length - lastIndex >
        BufferSizes.deleteBufferBelow * this.props.transactionsPerPage
      ) {
        needToDelBelow = true;
      }

      // If less than twice as many rows can be displayed in a page are above, then add <insertBufferAbove from TransactionBufferSize.tsx> pages worth above
      if (
        firstIndex < BufferSizes.insertBufferAbove * this.props.transactionsPerPage &&
        mostRecentDate < this.state.maximumDate
      ) {
        needToAddAbove = true;

        // If more than 90 above, then remove a pages worth above
      } else if (firstIndex > BufferSizes.deleteBufferAbove * this.props.transactionsPerPage) {
        needToDelAbove = true;
      }
      this._performActionsNeeded(needToAddAbove, needToAddBelow, needToDelAbove, needToDelBelow);
    }
  }
  _performActionsNeeded = (
    addAbove: boolean,
    addBelow: boolean,
    delAbove: boolean,
    delBelow: boolean
  ) => {
    if (addAbove) {
      this.addAbove(this.props.transactionsPerPage);
    }
    if (addBelow) {
      this.addBelow();
    }
    if (delAbove) {
      this.props.removeTransactionsAbove(
        this.props.transactionsPerPage * BufferSizes.amountToRemoveAbove
      );
    }
    if (delBelow) {
      this.props.removeTransactionsBelow(
        this.props.transactionsPerPage * BufferSizes.amountToRemoveBelow
      );
    }
  };

  // Add transactions to the bottom
  // If no more transactions are received from the server, set the new minimum date to the date of the last transaction
  _addTransactionsBottom(transaction: Array<Transaction>) {
    if (transaction.length === 0) {
      this.setState({
        minimumDate: new Date(this.props.transactions[this.props.transactions.length - 1].date)
      });
    }
    this.addPayeesToCache(transaction);
    this.props.addTransactionsBelow(transaction);
  }

  // Add transactions above
  // Always grabs one duplicate transaction (the most recent) which is at the end of array of the servers response
  _addTransactionsAbove(transaction: Array<Transaction>) {
    if (transaction.length <= 1) {
      this.setState({
        maximumDate: new Date(this.props.transactions[0].date)
      });
      this.addPayeesToCache(transaction);
    }

    if (transaction.length > 1) {
      // Need to remove the final transaction, as the API is >=, so will return the top transaction again (which appears at the end of the list)
      transaction.splice(-1, 1);
      this.props.addTransactionsAbove(transaction);
    }
  }

  _transactionTableJSX = () => {
    if (this.props.transactions !== undefined && this.props.transactions.length > 0) {
      return (
        <Table responsive>
          <TransactionTableBody transactions={this.props.transactions} />
        </Table>
      );
    } else if (this.props.fetchingTransactions === 0) {
      return (
        <React.Fragment>
          <h5 id="no-transactions-message">Hi! Thanks for joining Scott Cash!</h5>
          <br />
          <h5>Here you will see your transactions once you make some.</h5>
        </React.Fragment>
      );
    } else {
      return <React.Fragment />;
    }
  };

  render() {
    // This ensures that if you scroll to the top super quickly, it will still load the most recent transactions
    if (
      this.props.transactions !== undefined &&
      this.props.fetchingTransactions === 0 &&
      this.props.transactions.length > 0 &&
      window.scrollY < 300
    ) {
      let mostRecentDate = new Date(this.props.transactions[0].date);
      if (mostRecentDate < this.state.maximumDate) {
        this.addAbove(100);
      }
    }

    return (
      <div id="outer-account-balance">
        <div>
          <Row>
            <Col sm="1" md={{ size: 1 }} lg="1" id="no-height" />
            <Col sm="10" md={{ size: 10 }} lg="10">
              <AccountBalance />
            </Col>
            <Col sm="1" md={{ size: 1 }} lg="1" />
          </Row>
        </div>

        <div id="transaction-table">
          <Row id="transaction-table-row">
            <Col sm="12" md={{ size: 12 }} lg="12" id="trans-columns">
              {this._transactionTableJSX()}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Transactions;
