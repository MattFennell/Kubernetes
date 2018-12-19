import * as React from 'react';
import '../../Style/Bubble.css';

interface BubbleProps {
  className: string;
  children?: React.ReactNode;
}

class Bubble extends React.Component<BubbleProps, {}> {
  render() {
    return <div className={'bubble shadow ' + this.props.className}>{this.props.children}</div>;
  }
}
export default Bubble;
