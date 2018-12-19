import { Account } from '../Models/Interfaces/Account';

export enum ActionTypes {
  SET_BALANCE = 'CHANGE_BALANCE',
  SET_FIRSTNAME = 'SET_FIRSTNAME',
  SET_SURNAME = 'SET_SURNAME',
  SET_USERNAME = 'SET_USERNAME',
  SET_EMAIL = 'SET_EMAIL',
  SET_ACCOUNT = 'SET_ACCOUNT',
  RESET_ACCOUNT = 'RESET_ACCOUNT'
}
export interface SetBalance {
  type: ActionTypes.SET_BALANCE;
  payload: { balance: number };
}

export interface SetFirstName {
  type: ActionTypes.SET_FIRSTNAME;
  payload: { firstName: string };
}

export interface SetSurname {
  type: ActionTypes.SET_SURNAME;
  payload: { surname: string };
}

export interface SetEmail {
  type: ActionTypes.SET_EMAIL;
  payload: { email: string };
}

export interface ResetAccount {
  type: ActionTypes.RESET_ACCOUNT;
  payload: {};
}

export interface SetUsername {
  type: ActionTypes.SET_USERNAME;
  payload: { username: string };
}

export interface SetAccount {
  type: ActionTypes.SET_ACCOUNT;
  payload: {
    account: Account;
  };
}

export const setBalance = (balance: number): SetBalance => {
  return {
    type: ActionTypes.SET_BALANCE,
    payload: {
      balance
    }
  };
};

export const setFirstname = (firstName: string): SetFirstName => {
  return {
    type: ActionTypes.SET_FIRSTNAME,
    payload: {
      firstName
    }
  };
};
export const setSurname = (surname: string): SetSurname => {
  return {
    type: ActionTypes.SET_SURNAME,
    payload: {
      surname
    }
  };
};
export const setEmail = (email: string): SetEmail => {
  return {
    type: ActionTypes.SET_EMAIL,
    payload: {
      email
    }
  };
};
export const setUsername = (username: string): SetUsername => {
  return {
    type: ActionTypes.SET_USERNAME,
    payload: {
      username
    }
  };
};

export const resetAccount = (): ResetAccount => {
  return {
    type: ActionTypes.RESET_ACCOUNT,
    payload: {}
  };
};

export const setAccount = (account: Account): SetAccount => {
  return {
    type: ActionTypes.SET_ACCOUNT,
    payload: {
      account
    }
  };
};
export type Action =
  | SetBalance
  | SetFirstName
  | SetSurname
  | SetEmail
  | SetUsername
  | SetAccount
  | ResetAccount;
