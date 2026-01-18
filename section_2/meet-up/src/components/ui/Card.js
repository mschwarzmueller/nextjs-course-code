import classes from './Card.module.css'

const Card = ({ children }) => {
    return (
        <div className={classes.card}>{children}</div>
    )
}
export default Card