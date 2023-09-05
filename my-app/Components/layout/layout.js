import React from 'react'

function Layout(props) {
  return (
    <Fragment>
      <main>{props.children}</main>
    </Fragment>
  )
}

export default Layout
