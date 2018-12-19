import * as React from 'react';
import Enzyme from './enzyme-setup';
import TransactionAddNoteForm from '../../Components/Transactions/SpecificInformation/Notes/TransactionAddNoteForm';

describe('TransactionAddNoteForm', () => {
  it('can not add note if input is empty', () => {
    const addNoteCallBack = jest.fn((note: string) => {});

    const wrapper = Enzyme.shallow(
      <TransactionAddNoteForm
        isRequestingAddNotes={false}
        isRequestingDeleteNotes={false}
        initialNote=""
        deleteNote={() => {}}
        addNote={addNoteCallBack}
      />
    );

    expect(wrapper.find('.add-note-button').hasClass('disabled')).toBe(true);

    wrapper.find('.add-note-button').simulate('click');

    expect(addNoteCallBack.mock.calls.length).toBe(0);
  });
});

it('can add a note', () => {
  const newNote = 'New note';
  const addNoteCallBack = jest.fn((note: string) => {});
  const wrapper = Enzyme.shallow(
    <TransactionAddNoteForm
      isRequestingAddNotes={false}
      isRequestingDeleteNotes={false}
      initialNote=""
      deleteNote={() => {}}
      addNote={addNoteCallBack}
    />
  );
  wrapper.find('input').simulate('change', { target: { value: newNote } });

  expect(wrapper.find('input')).toHaveLength(1);
  expect(wrapper.find('.add-note-button').hasClass('disabled')).toBe(false);

  wrapper.find('.add-note-button').simulate('click');

  expect(addNoteCallBack.mock.calls.length).toBe(1);
  expect(addNoteCallBack.mock.calls[0][0]).toBe(newNote);
});
