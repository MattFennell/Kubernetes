import * as React from 'react';
import DocumentListenerService from '../../../Services/DocumentListenerService';

interface HorizontalDragScrollProps {
  children?: any;
  className?: string;
  monthsRowRef?: React.RefObject<HTMLElement>;
}

class HorizontalDragScroll extends React.Component<HorizontalDragScrollProps, {}> {
  private isMouseDown = false;
  private lastMousePosition = 0;

  componentDidMount() {
    if (this.props.monthsRowRef) {
      this.props.monthsRowRef.current!.addEventListener('mousedown', this._mousedown);
      DocumentListenerService.addListener('mouseup', this._mouseup);
      DocumentListenerService.addListener('mousemove', this._mousemove);
    }
  }
  _mousedown = (e: any) => {
    this.isMouseDown = true;
    this.lastMousePosition = e.screenX;
  };
  _mouseup = () => {
    this.isMouseDown = false;
  };
  _mousemove = (e: any) => {
    if (this.isMouseDown) {
      if (this.props.monthsRowRef)
        this.props.monthsRowRef.current!.scrollLeft -= e.screenX - this.lastMousePosition;
      this.lastMousePosition = e.screenX;
    }
  };
  componentWillUnmount() {
    if (this.props.monthsRowRef) {
      this.props.monthsRowRef.current!.removeEventListener('mousedown', this._mousedown);
      DocumentListenerService.removeListener('mouseup', this._mouseup);
      DocumentListenerService.removeListener('mousemove', this._mousemove);
    }
  }
  render() {
    return <div className={'scroll-wrapper ' + this.props.className}>{this.props.children}</div>;
  }
}
export default HorizontalDragScroll;
