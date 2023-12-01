import Link from "next/link";
import classes from './button.module.css'
function Button(props) {
    if (props.link) {
        <Link href={props.link}>
        <span className={classes.btn}>{props.children}</span>
    </Link>
    }
    return <button className={classes.btn} onClick={props.onClick}>{props.children}</button>
}

export default Button;