import { connect } from 'react-redux';
import { State } from '../Reducers/root';
import RowMonths from '../Components/Reusable/Header/RowMonths';
import { setButtonMonthInfo } from '../Actions/TransactionActions';
import {
  getButtonMonthInfo,
  getFetchingTransactions,
  getMonthBeingViewed
} from '../Selectors/TransactionSelector';

const mapStateToProps = (state: State) => ({
  buttonMonthInfo: getButtonMonthInfo(state),
  fetchingTransactions: getFetchingTransactions(state),
  monthBeingViewed: getMonthBeingViewed(state)
});

const mapDispatchToProps = {
  setButtonMonthInfo
};

export default connect<any, any, any>(
  mapStateToProps as any,
  mapDispatchToProps
)(RowMonths);
