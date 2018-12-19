import * as React from 'react';
import Category from '../../../Models/Category';
import Transaction from '../../../Models/Types/Transaction';
import { setTransactionCategory } from '../../../Actions/TransactionActions';
import { DropdownItem, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { CategoriesMeta } from '../../../Models/Interfaces/CategoriesMeta';
import { Image } from 'react-bootstrap';

interface TransactionCategoryInfoProps {
  categories: Array<Category>;
  transactionBeingViewed: Transaction;
  setTransactionCategory: (category: Category) => void;
  meta: CategoriesMeta;
}

interface State {
  currentCategory: Category;
  dropdownOpen: boolean;
  isRequesting: boolean;
}

class TransactionCategoryInfo extends React.Component<TransactionCategoryInfoProps, State> {
  constructor(props: TransactionCategoryInfoProps) {
    super(props);
    this._handleCategoryChange = this._handleCategoryChange.bind(this);
    this._toggle = this._toggle.bind(this);
    this.state = {
      currentCategory: this.props.transactionBeingViewed.category,
      dropdownOpen: false,
      isRequesting: props.meta ? props.meta.isRequestingChangeCategory : false
    };
  }

  _handleCategoryChange(categoryId: string) {
    this.setState({ isRequesting: true });
    var newCategory = this.props.categories.find(function(element) {
      return element.id === categoryId;
    });
    if (newCategory) {
      this.props.setTransactionCategory(newCategory);
      setTransactionCategory(this.props.transactionBeingViewed.id, newCategory);
    }
  }

  _toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    const meta = this.props.meta;
    const categories = this.props.categories;
    const currentCategory = this.props.transactionBeingViewed.category;
    const categoryOptions = categories.map(category => (
      <p className="menu-items">
        <DropdownItem
          className={'category-menu-item-' + (category.id === currentCategory.id)}
          key={category.id}
          value={category.description}
          onClick={() => this._handleCategoryChange(category.id)}
        >
          {category.description}
        </DropdownItem>
      </p>
    ));

    return (
      <div>
        {meta && meta.isRequestingChangeCategory ? (
          <div className="loading-spinner-container">
            <Image className="loading-spinner" src="Spinner.svg" alt="Loading Spinner" />
          </div>
        ) : (
          <div className="category-change-error"> {meta ? meta.error : ''} </div>
        )}
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this._toggle}>
          {'Category: '}
          <DropdownToggle caret className="category-menu-toggle">
            {currentCategory.description + ' ▼'}
          </DropdownToggle>
          <DropdownMenu className="category-menu">{categoryOptions}</DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default TransactionCategoryInfo;
