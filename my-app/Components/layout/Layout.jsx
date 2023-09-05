import { Fragment } from 'react'
import MainHeader from './mainHeader'

function Layout(props) {
  return (
    <Fragment>
    <MainHeader/>
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
