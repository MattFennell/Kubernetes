import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import PageBody from '../Components/Reusable/PageBody';
import { getViewingTransactions } from '../Selectors/TransactionSelector';

const mapStateToProps = (state: State) => ({
  viewingTransactions: getViewingTransactions(state)
});

export default connect<any, any, any>(mapStateToProps as any)(PageBody);
