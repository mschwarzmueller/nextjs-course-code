import React from 'react'
import Link from 'next/link'
import classes from './button.module.css'

function Button(props) {
  return (
    <Link className={classes.btn}href={props.link}>
    {props.children}
    </Link>
  );
}

export default Button
