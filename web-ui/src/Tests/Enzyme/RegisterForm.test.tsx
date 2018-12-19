import * as React from 'react';
import Enzyme from './enzyme-setup';
import RegisterForm from '../../Components/Register/RegisterForm';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import RootReducer from '../../Reducers/root';

const store = createStore(RootReducer);
let wrapper: any;
beforeEach(() => {
  wrapper = Enzyme.mount(
    <Provider store={store}>
      <Router>
        <RegisterForm setAccount={() => {}} />
      </Router>
    </Provider>
  );
});

describe('RegisterForm', () => {
  it('renders error label with no text by default', () => {
    expect(wrapper.find('Label.error-text').text()).toBeFalsy();
  });

  it('renders error label with correct text when there is an error', () => {
    wrapper.find('RegisterForm').setState({ error: 'Test error text' });
    wrapper.update();

    expect(wrapper.find('Label.error-text').text()).toEqual('Test error text');
  });
});
