import * as React from 'react';
import '../../Style/Info.css';
import Transaction from '../../Models/Types/Transaction';
import PayeeSummary from '../../Models/Types/PayeeSummary';
import TransactionInfoHeader from './SpecificInformation/TransactionInfoHeader';
import TransactionPayeeInfo from './SpecificInformation/TransactionPayeeInfo';
import TransactionNote from './SpecificInformation/Notes/TransactionNote';
import TransactionInfoCloseButton from '../../Containers/TransactionInfoCloseButton';
import { CategoriesMeta } from '../../Models/Interfaces/CategoriesMeta';
import Category from '../../Models/Category';

interface InfoProps {
  transactionBeingViewed: Transaction;
  payeeSummaryBeingViewed: PayeeSummary;
  addTransactionDescription: (id: string, note: string) => void;
  deleteTransactionDescription: (id: string) => void;
  categoriesMeta: CategoriesMeta;
  setTransactionCategory: (id: string, category: Category) => void;
  categories: Array<Category>;
  notesMeta: {
    error: string;
    isRequestingAddNotes: boolean;
    isRequestingDeleteNotes: boolean;
  };
}

class Info extends React.Component<InfoProps> {
  constructor(props: InfoProps) {
    super(props);
    this._addNoteToTransaction = this._addNoteToTransaction.bind(this);
    this._deleteNoteFromTransaction = this._deleteNoteFromTransaction.bind(this);
    this._changeTransactionCategory = this._changeTransactionCategory.bind(this);
  }

  _addNoteToTransaction(note: string) {
    const { transactionBeingViewed, addTransactionDescription } = this.props;

    return addTransactionDescription(transactionBeingViewed.id, note);
  }

  _deleteNoteFromTransaction() {
    const { transactionBeingViewed, deleteTransactionDescription } = this.props;

    return deleteTransactionDescription(transactionBeingViewed.id);
  }

  _changeTransactionCategory(category: Category) {
    const { transactionBeingViewed, setTransactionCategory } = this.props;

    return setTransactionCategory(transactionBeingViewed.id, category);
  }

  render() {
    const {
      transactionBeingViewed,
      payeeSummaryBeingViewed,
      notesMeta,
      categories,
      categoriesMeta
    } = this.props;

    const { payee, description, id } = transactionBeingViewed;

    return (
      <div className="transaction-info-page">
        <TransactionInfoCloseButton setViewingTransactions={() => {}} />
        <TransactionInfoHeader
          transactionBeingViewed={transactionBeingViewed}
          setTransactionCategory={this._changeTransactionCategory}
          categories={categories}
          meta={categoriesMeta}
        />
        <TransactionPayeeInfo payeeSummary={payeeSummaryBeingViewed} payeeName={payee.name} />
        <hr />
        <div className="transaction-note-container">
          <div className="error-message">
            {// Crash prevention - may not reflect actual state
            notesMeta ? notesMeta.error : ''}
          </div>
          <TransactionNote
            note={description}
            addNote={this._addNoteToTransaction}
            deleteNote={this._deleteNoteFromTransaction}
            currentTransactionId={id}
            meta={notesMeta}
          />
        </div>
      </div>
    );
  }
}

export default Info;
