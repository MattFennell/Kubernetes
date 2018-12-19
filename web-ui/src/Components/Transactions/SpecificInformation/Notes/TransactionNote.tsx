import * as React from 'react';
import { Image } from 'react-bootstrap';
import TransactionInfoAddNoteButton from './TransactionInfoAddNoteButton';
import TransactionAddNoteForm from './TransactionAddNoteForm';

interface Props {
  note: string;
  addNote: (note: string) => void;
  deleteNote: () => void;
  currentTransactionId: string;
  meta: {
    error: string;
    isRequestingAddNotes: boolean;
    isRequestingDeleteNotes: boolean;
  };
}

interface State {
  isEditing: boolean;
  currentTransactionId: string;
  isRequesting: boolean;
}

class TransactionNote extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEditing: false,
      currentTransactionId: props.currentTransactionId,
      isRequesting: props.meta.isRequestingAddNotes || props.meta.isRequestingDeleteNotes
    };

    this._handleAddNote = this._handleAddNote.bind(this);
    this._handleEditNote = this._handleEditNote.bind(this);
    this._handleDeleteNote = this._handleDeleteNote.bind(this);
    this._renderAddNoteForm = this._renderAddNoteForm.bind(this);
    this._renderStaticNote = this._renderStaticNote.bind(this);
  }

  _handleAddNote(note: string) {
    const { isRequesting } = this.state;
    const { addNote } = this.props;

    if (!isRequesting) {
      addNote(note);
    }
  }

  _handleEditNote() {
    this.setState({ isEditing: true });
  }

  _handleDeleteNote() {
    const { isRequesting } = this.state;
    const { deleteNote } = this.props;

    if (!isRequesting) {
      deleteNote();
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // If changing view transaction
    if (nextProps.currentTransactionId !== prevState.currentTransactionId) {
      return {
        isEditing: false,
        currentTransactionId: nextProps.currentTransactionId,
        isRequesting: nextProps.meta.isRequestingAddNotes || nextProps.meta.isRequestingDeleteNotes
      };
    }

    // When receiving response back from server
    else if (
      prevState.isRequesting &&
      !(nextProps.meta.isRequestingAddNotes || nextProps.meta.isRequestingDeleteNotes)
    ) {
      if (nextProps.meta.error) {
        return {
          isEditing: true,
          isRequesting:
            nextProps.meta.isRequestingAddNotes || nextProps.meta.isRequestingDeleteNotes
        };
      }

      return {
        isEditing: false,
        isRequesting: nextProps.meta.isRequestingAddNotes || nextProps.meta.isRequestingDeleteNotes
      };
    }
    if (nextProps.meta) {
      return {
        isRequesting: nextProps.meta.isRequestingAddNotes || nextProps.meta.isRequestingDeleteNotes
      };
    }
  }

  _renderAddNoteForm() {
    const { meta, note } = this.props;
    let isRequestingAddNotes: boolean;
    let isRequestingDeleteNotes: boolean;
    if (meta) {
      isRequestingAddNotes = meta.isRequestingAddNotes;
      isRequestingDeleteNotes = meta.isRequestingDeleteNotes;
    } else {
      // Crash prevention - need to avoid this being necessary
      isRequestingAddNotes = false;
      isRequestingDeleteNotes = false;
    }

    return (
      <TransactionAddNoteForm
        isRequestingAddNotes={isRequestingAddNotes}
        isRequestingDeleteNotes={isRequestingDeleteNotes}
        initialNote={note}
        deleteNote={this._handleDeleteNote}
        addNote={this._handleAddNote}
      />
    );
  }

  _renderStaticNote() {
    const { note } = this.props;

    return (
      <div className="note confirmed flex-container">
        <div className="note-text">{note}</div>
        <Image
          className="note-icon"
          src="pencil-edit-button-pink.svg"
          alt="Edit Pencil"
          onClick={this._handleEditNote}
        />
      </div>
    );
  }

  render() {
    const { isEditing } = this.state;
    const { note } = this.props;

    if (isEditing) {
      return this._renderAddNoteForm();
    }

    if (note) {
      return this._renderStaticNote();
    }

    return (
      <TransactionInfoAddNoteButton onClick={(e: any) => this.setState({ isEditing: true })} />
    );
  }
}
export default TransactionNote;
