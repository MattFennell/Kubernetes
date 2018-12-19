import * as React from 'react';
import { Col } from 'reactstrap';
import { MonthButtonInfo } from '../../../Models/Interfaces/MonthButtonInfo';
import { getButtonMonthInfo } from '../../../Services/UserService';
import ButtonMonth from '../../../Containers/ButtonMonth';
import HorizontalDragScroll from './HorizontalDragScroll';

interface Props {
  buttonMonthInfo: Array<MonthButtonInfo>;
  setButtonMonthInfo: (buttonMonthInfo: Array<MonthButtonInfo>) => void;
  fetchingTransactions: number;
  monthBeingViewed: string;
}
interface State {
  selectedButtonId: string;
  initialUpdate: boolean;
  clicked: boolean;
}
class RowMonths extends React.Component<Props, State> {
  private monthsRow: React.RefObject<HTMLElement>;
  private selectedButton: React.RefObject<HTMLElement>;
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedButtonId: this._currentMonthButtonId(),
      initialUpdate: true,
      clicked: false
    };
    this.monthsRow = React.createRef<HTMLElement>();
    this.selectedButton = React.createRef<HTMLElement>();
  }
  componentDidMount() {
    getButtonMonthInfo().then(response => this.props.setButtonMonthInfo(response));
  }

  componentDidUpdate() {
    let targetButton: HTMLElement | null = document.getElementById(this.props.monthBeingViewed);
    if (targetButton && !this.state.clicked) {
      this._handleMonthChange(targetButton);
    }
    if (this.state.initialUpdate) {
      if (targetButton) {
        this.monthsRow.current!.scrollLeft = this._calculateHowFarToScroll(targetButton);
        this.setState({ initialUpdate: false });
      }
    }
    if (this.state.clicked) {
      this.setState({ clicked: false });
    }
  }

  // Prevents component updating more than necessary on scroll, which can cause animation glitches
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      this.props.fetchingTransactions !== nextProps.fetchingTransactions ||
      this.state.clicked !== nextState.clicked
    ) {
      return false;
    }
    return true;
  }

  _currentMonthButtonId = (): string => {
    return new Date().getFullYear() + '_' + (new Date().getMonth() + 1);
  };

  _handleMonthChange = (targetButton: HTMLElement) => {
    if (targetButton) {
      this._selectButton(targetButton);
    }
  };

  _handleButtonClick = (targetButton: HTMLElement) => {
    if (targetButton) {
      this.setState({ clicked: true });
      this._selectButton(targetButton);
    }
  };

  _selectButton = (targetButton: HTMLElement) => {
    if (this.state.selectedButtonId !== targetButton.id) {
      this.setState({
        selectedButtonId: targetButton.id
      });
      targetButton.classList.add('selected');
      $(this.monthsRow.current!).animate(
        { scrollLeft: this._calculateHowFarToScroll(targetButton) },
        200
      );
    }
  };

  _calculateHowFarToScroll = (element: HTMLElement): number => {
    // Element's x position from the left - half of window width + half of element's width
    return element.offsetLeft - window.innerWidth / 2 + element.clientWidth / 2;
  };

  _generateUniqueName = (year: number, month: number, deliminator: string) => {
    return year + deliminator + month;
  };

  _tableBodyJSX = () => {
    return this.props.buttonMonthInfo.map(Month => (
      <ButtonMonth
        key={this._generateUniqueName(Month.year, Month.month, '_')}
        id={this._generateUniqueName(Month.year, Month.month, '_')}
        count={Month.count}
        month={Month.month}
        year={Month.year}
        selectButton={this._handleButtonClick}
        isSelected={
          this.state.selectedButtonId === this._generateUniqueName(Month.year, Month.month, '_')
        }
        thisMonth={
          new Date().getFullYear() === Month.year && Month.month === new Date().getMonth() + 1
        }
        setRef={() => this.selectedButton}
      />
    ));
  };

  _textIfNoMonthInfo = () => {
    if (this.props.fetchingTransactions === 0)
      return <h6 className="message-for-no-header">You haven't made any transactions yet.</h6>;
  };

  render() {
    return (
      <HorizontalDragScroll monthsRowRef={this.monthsRow}>
        <div className="months unselectable row" ref={this.monthsRow as any}>
          <Col lg="12">
            {this.props.buttonMonthInfo !== undefined && this.props.buttonMonthInfo.length > 0
              ? this._tableBodyJSX()
              : this._textIfNoMonthInfo()}
          </Col>
        </div>
      </HorizontalDragScroll>
    );
  }
}
export default RowMonths;
