import Category from '../Category';
import Payee from '../Payee';

type Transaction = {
  amount: number;
  category: Category;
  date: Date;
  description: string;
  id: string;
  payee: Payee;
};

export default Transaction;
