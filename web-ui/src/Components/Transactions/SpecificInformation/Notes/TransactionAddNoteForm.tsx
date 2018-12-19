import * as React from 'react';
import classNames from 'classnames';
import { Image } from 'react-bootstrap';

interface Props {
  isRequestingAddNotes: boolean;
  isRequestingDeleteNotes: boolean;
  initialNote: string;
  deleteNote: () => void;
  addNote: (note: string) => void;
}

interface State {
  inputValue: string;
}

class TransactionAddNoteForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      inputValue: props.initialNote
    };

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleAddNote = this._handleAddNote.bind(this);
  }

  _handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this._handleAddNote();
  }

  _handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ inputValue: e.target.value });
  }

  _handleAddNote() {
    const { addNote } = this.props;
    const { inputValue } = this.state;

    if (inputValue) {
      addNote(inputValue);
    }
  }

  render() {
    const { isRequestingAddNotes, isRequestingDeleteNotes, deleteNote } = this.props;
    const { inputValue } = this.state;

    return (
      <form className="note-form flex-container note" onSubmit={this._handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={this._handleChange}
          maxLength={63}
          autoFocus
        />
        <div className="flex-container note-button-group">
          {!isRequestingAddNotes ? (
            <div
              className={classNames('add-note-button', {
                disabled: !inputValue || isRequestingDeleteNotes
              })}
              onClick={this._handleAddNote}
            >
              Add
            </div>
          ) : (
            <div className="loading-spinner-container">
              <Image className="loading-spinner" src="Spinner.svg" alt="Loading Spinner" />
            </div>
          )}
          {!isRequestingDeleteNotes ? (
            <Image
              className={classNames('note-icon', {
                disabled: isRequestingAddNotes
              })}
              src="rubbish-bin.svg"
              alt="Rubbish Bin"
              onClick={deleteNote}
            />
          ) : (
            <Image className="loading-spinner" src="Spinner.svg" alt="Loading Spinner" />
          )}
        </div>
      </form>
    );
  }
}
export default TransactionAddNoteForm;
