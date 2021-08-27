import { Fragment } from 'react';

import MainNavigation from './MainNavigation';

function LayoutWrapper(props) {
  return (
    <Fragment>
      <MainNavigation />
      <main>{props.children}</main>
    </Fragment>
  );
}

export default LayoutWrapper;
