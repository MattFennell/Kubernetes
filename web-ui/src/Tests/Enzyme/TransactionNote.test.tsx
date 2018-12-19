import * as React from 'react';
import Enzyme from './enzyme-setup';
import TransactionNote from '../../Components/Transactions/SpecificInformation/Notes/TransactionNote';

const meta = {
  isRequestingAddNotes: false,
  isRequestingDeleteNotes: false,
  error: ''
};

describe('TransactionNote', () => {
  it('displays existing note', () => {
    const note = 'Existing note';
    const wrapper = Enzyme.shallow(
      <TransactionNote
        note={note}
        addNote={(note: string) => {}}
        deleteNote={() => {}}
        currentTransactionId="1"
        meta={meta}
      />
    );

    expect(wrapper.find('.note-text')).toBeDefined();
    expect(wrapper.find('.note-text').text()).toBe(note);
  });

  it('can edit existing note', () => {
    const note = 'Existing note';
    const wrapper = Enzyme.shallow(
      <TransactionNote
        note={note}
        addNote={(note: string) => {}}
        deleteNote={() => {}}
        currentTransactionId="1"
        meta={meta}
      />
    );

    expect(wrapper.find('input')).toHaveLength(0);

    wrapper.find('.note-icon').simulate('click');

    expect(wrapper.find('TransactionAddNoteForm')).toHaveLength(1);
  });

  it('can edit new note', () => {
    const wrapper = Enzyme.shallow(
      <TransactionNote
        note=""
        addNote={(note: string) => {}}
        deleteNote={() => {}}
        currentTransactionId="1"
        meta={meta}
      />
    );

    expect(wrapper.find('input')).toHaveLength(0);

    wrapper.find('TransactionInfoAddNoteButton').simulate('click');

    expect(wrapper.find('TransactionAddNoteForm')).toHaveLength(1);
  });
});
