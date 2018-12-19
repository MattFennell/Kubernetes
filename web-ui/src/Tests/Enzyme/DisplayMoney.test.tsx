import * as React from 'react';
import Enzyme from './enzyme-setup';
import DisplayMoney from '../../Components/Reusable/DisplayMoney';

describe('DisplayMoney', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = Enzyme.shallow(<DisplayMoney balance={500} transactionRow={false} />);
  });

  it('Renders a div with the classname "money"', () => {
    expect(wrapper.find('.money').hasClass('money')).toBe(true);
  });

  it('Renders a positive balance (initially provided in pence) in pounds to two decimal place with "£" as the prefix', () => {
    expect(wrapper.find('.money').text()).toBe('£5.00');
  });

  it('Renders a negative balance (initially provided in pence) in pounds to two decimal place with "-£" as the prefix', () => {
    wrapper = Enzyme.shallow(<DisplayMoney balance={-500} transactionRow={false} />);
    expect(wrapper.find('.money').text()).toEqual('-£5.00');
  });

  it('Renders a balance of 0 pence in pounds to two decimal place with "£" as the prefix', () => {
    wrapper = Enzyme.shallow(<DisplayMoney balance={0} transactionRow={false} />);
    expect(wrapper.find('.money').text()).toEqual('£0.00');
  });

  it('Renders a positive balance (initially provided in pence) in pounds to two decimal place with "£" as the prefix', () => {
    wrapper = Enzyme.shallow(<DisplayMoney balance={1234} transactionRow={false} />);
    expect(wrapper.find('.money').text()).toEqual('£12.34');
  });

  it('Renders a negative balance (initially provided in pence) in pounds to two decimal place with "-£" as the prefix', () => {
    wrapper = Enzyme.shallow(<DisplayMoney balance={-9431} transactionRow={false} />);
    expect(wrapper.find('.money').text()).toEqual('-£94.31');
  });

  it('Renders a large positive balance (initially provided in pence) in pounds to two decimal place with "£" as the prefix', () => {
    wrapper = Enzyme.shallow(<DisplayMoney balance={123456789} transactionRow={false} />);
    expect(wrapper.find('.money').text()).toEqual('£1,234,567.89');
  });

  it('Renders a large negative balance (initially provided in pence) in pounds to two decimal place with "-£" as the prefix', () => {
    wrapper = Enzyme.shallow(<DisplayMoney balance={-123456789} transactionRow={false} />);
    expect(wrapper.find('.money').text()).toEqual('-£1,234,567.89');
  });

  it('Renders a positive balance (initially provided in pence) in pounds to two decimal place with "£" as the prefix when in the header', () => {
    wrapper = Enzyme.shallow(<DisplayMoney balance={153} transactionRow={false} />);
    expect(wrapper.find('.money').text()).toEqual('£1.53');
  });
});
