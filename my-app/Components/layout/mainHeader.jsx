import React from 'react'
import classes from './mainHeader.module.css'
import Link from 'next/link'

function MainHeader() {
  return (
    <header className={classes.header}> 
    <div className={classes.logo}>
      <Link href='/'>Next Events</Link>
    </div>
    <nav className={classes.navigation}>
<ul>
    <li>
     <Link href='/events'> Browse All Events</Link>   
    </li>
</ul>
    </nav>
    </header>
  )
}

export default MainHeader;
