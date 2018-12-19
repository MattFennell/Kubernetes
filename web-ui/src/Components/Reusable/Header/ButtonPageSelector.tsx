import * as React from 'react';
import classNames from 'classnames';

interface ButtonPageSelectorProps {
  select: () => void;
  id: string;
  text: string;
  imgSrc: string;
  selected: boolean;
  setRef: () => React.RefObject<HTMLDivElement>;
}

class ButtonPageSelector extends React.Component<ButtonPageSelectorProps> {
  shouldComponentUpdate(nextProps: ButtonPageSelectorProps) {
    return nextProps !== this.props;
  }

  render() {
    return (
      <div
        id={this.props.id}
        className={classNames('cursor-pointer', {
          selected: this.props.selected
        })}
        onClick={() => this.props.select()}
        ref={this.props.setRef()}
      >
        <img src={this.props.imgSrc} />
        <h6>{this.props.text}</h6>
      </div>
    );
  }
}

export default ButtonPageSelector;
