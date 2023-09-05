import React from 'react'
import classes from '/mainHeader.module.css'

function MainHeader() {
  return (
    <header>
    <div>
      <Link href='/'>Next Events</Link>
    </div>
    <nav>
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
