import { Account } from './Account';
import { MonthButtonInfo } from './MonthButtonInfo';

export interface UserProps {
  setAccount: (account: Account) => void;
  setButtonMonthInfo: (buttonMonthInfo: Array<MonthButtonInfo>) => void;
}
