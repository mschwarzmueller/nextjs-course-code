import MeetupItem from './MeetupItem'
import classes from './MeetupList.module.css'

const MeetupList = ({ meetups }) => {
    return (
        <ul className={classes.list}>
            {meetups.map((m) => (
                <MeetupItem key={m.id} {...m} />
            ))}
        </ul>
    )
}
export default MeetupList