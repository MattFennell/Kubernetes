import * as React from 'react';
import Transactions from '../Containers/Transactions';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SplashScreen from './Reusable/SplashScreen';

class CategoryTemplate extends React.Component<RouteComponentProps, {}> {
  public render() {
    let header = document.getElementById('header');
    if (header != null) {
      header.hidden = false;
    }
    if (sessionStorage.access !== undefined) {
      return <Transactions />;
    } else {
      return <SplashScreen redirect={'/login'} />;
    }
  }
}
export default withRouter(CategoryTemplate);
