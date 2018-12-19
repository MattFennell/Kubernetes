import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Bubble from '../Reusable/Bubble';
import TextScottCash from '../Reusable/TextScottCash';
import '../../Style/SplashScreen.css';

interface Props extends RouteComponentProps {
  redirect: string;
}
class SplashScreen extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    if (this.props.redirect !== null) {
      this.props.history.push(this.props.redirect);
    }
  }

  componentDidMount() {
    let header: HTMLElement | null = document.getElementById('header');
    if (header != null) {
      header.hidden = true;
    }
  }
  render() {
    return (
      <div id="container-no-margin">
        <Bubble className="bubble-medium" />
        <Bubble className="bubble-smallest" />
        <Bubble className="bubble-turquoise">
          <TextScottCash />
        </Bubble>
      </div>
    );
  }
}
export default withRouter(SplashScreen);
