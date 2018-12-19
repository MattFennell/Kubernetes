import { Credentials } from '../Models/Interfaces/Credentials';
import { Account } from '../Models/Interfaces/Account';
import { RegistrationDetails } from '../Models/Interfaces/RegistrationDetails';
import { MonthButtonInfo } from '../Models/Interfaces/MonthButtonInfo';
import Transaction from '../Models/Types/Transaction';
import { Tokens } from '../Models/Interfaces/Tokens';
import { getBearerHeader } from './CredentialInputService';
import PayeeSummary from '../Models/Types/PayeeSummary';
import Category from '../Models/Category';

export const register = (data: RegistrationDetails): Promise<void> => {
  return fetch('/api/user', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        let msg: string = 'name or surname';
        response.json().then(response => {
          msg = response.message.toString();
        });
        throw new Error('Invalid characters in ' + msg + '.');
      } else if (response.status === 409) {
        let msg: string = 'email or username';
        response.json().then(response => {
          msg = response.message.toString();
        });
        throw new Error('User with this ' + msg + ' already exists.');
      } else if (response.status === 500) {
        throw new Error('Sorry, something went wrong!');
      } else {
        throw new Error(response.status.toString());
      }
    }
  });
};
export const getButtonMonthInfo = (): Promise<Array<MonthButtonInfo>> => {
  return fetch('/api/transaction/month/count', {
    method: 'GET',
    headers: { Authorization: getBearerHeader() }
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
  });
};

export const getTransactions = (date: string, pageSize: number): Promise<Array<Transaction>> => {
  return fetch('/api/transaction?endDate=' + date + '&pageSize=' + pageSize, {
    method: 'GET',
    headers: { Authorization: getBearerHeader() }
  }).then(function(response) {
    if (response.status === 200) {
      return response.json();
    }
  });
};

export const getCategories = (): Promise<Array<Category>> => {
  return fetch('/api/category/all', {
    method: 'GET',
    headers: { Authorization: getBearerHeader() }
  }).then(function(response) {
    if (response.status === 200) {
      return response.json();
    }
  });
};

export const getPayeeSummary = (payeeId: string): Promise<PayeeSummary> => {
  return fetch('/api/payee/' + payeeId + '/summary', {
    method: 'GET',
    headers: { Authorization: getBearerHeader() }
  }).then(function(response) {
    if (response.status === 200) {
      return response.json();
    }
  });
};

export const addTransactionsBelow = (
  date: string,
  pageSize: number
): Promise<Array<Transaction>> => {
  return fetch('/api/transaction?endDate=' + date + '&pageSize=' + pageSize, {
    method: 'GET',
    headers: { Authorization: getBearerHeader() }
  })
    .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
    })
    .catch(error => console.error(error));
};

export const addTransactionsAbove = (
  date: string,
  pageSize: number
): Promise<Array<Transaction>> => {
  return fetch('/api/transaction?startDate=' + date + '&pageSize=' + (pageSize + 1), {
    method: 'GET',
    headers: { Authorization: getBearerHeader() }
  })
    .then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
    })
    .catch(error => console.error(error));
};

export const addNote = (id: string, description: string): Promise<Response> => {
  return fetch('/api/transaction/' + id + '/note', {
    method: 'POST',
    headers: { Authorization: getBearerHeader() },
    body: description
  }).then(response => {
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Authentication error. Please refresh the page and try again.');
      } else if (response.status === 500) {
        throw new Error('Internal server error. If problems persist, please contact support.');
      }
    } else if (response.status === 201) {
      return response;
    }

    throw new Error('Oops, an error occurred. Please try again.');
  });
};

export const deleteNote = (id: string): Promise<Response> => {
  return fetch('/api/transaction/' + id + '/note', {
    method: 'DELETE',
    headers: { Authorization: getBearerHeader() }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Authentication error. Please refresh the page and try again.');
      } else if (response.status === 500) {
        throw new Error('Internal server error. If problems persist, please contact support.');
      }
    } else if (response.status === 204) {
      return response;
    }

    throw new Error('Oops, an error occurred. Please try again.');
  });
};

export const login = (data: Credentials): Promise<Tokens> => {
  return fetch('/api/token', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Login Unsuccessful');
      } else if (response.status === 500) {
        throw new Error('Internal server error');
      } else {
        throw new Error(response.status.toString());
      }
    } else if (response.status === 201) {
      return response.json();
    }
  });
};

export const changeTransactionCategory = (transactionId: string, categoryId: string) => {
  return fetch('/api/transaction/' + transactionId + '/category', {
    method: 'POST',
    body: JSON.stringify(categoryId),
    headers: { Authorization: getBearerHeader(), 'Content-Type': 'application/json' }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Internal server error');
      } else {
        throw new Error(response.status.toString());
      }
    }
  });
};

export const getBalance = (): Promise<{ balance: number }> => {
  return fetch('/api/user/current', {
    method: 'GET',
    headers: { Authorization: getBearerHeader() }
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }
  });
};

export const getUser = (): Promise<Account> => {
  return fetch('/api/user/current', {
    method: 'GET',
    headers: { Authorization: getBearerHeader() }
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }
  });
};

export const deleteUser = (): Promise<void> => {
  return fetch('/api/user/current', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    if (response.status === 403) {
      throw new Error('Delete Current User Unsuccessfull: 403 Forbidden!');
    } else if (response.status === 204) {
      throw new Error('User Successfully Deleted');
    }
  });
};
