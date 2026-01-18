import Card from '../ui/Card'
import classes from './NewMeetupForm.module.css'
import { useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

const NewMeetupForm = ({ onAddMeetup }) => {
    // properties
    const enteredTitleRef = useRef();
    const enteredImageRef = useRef();
    const enteredAddressRef = useRef();
    const enteredDescriptionRef = useRef();

    // helper methods
    const handleSubmitForm = (e) => {
        e.preventDefault();
        const meetupData = {
            meetupId: uuidv4(),
            title: enteredTitleRef.current.value,
            image: enteredImageRef.current.value,
            address: enteredAddressRef.current.value,
            description: enteredDescriptionRef.current.value
        }

        onAddMeetup(meetupData);

    }

    // return component
    return (
        <Card>
            <form className={classes.form} onSubmit={handleSubmitForm}>
                <div className={classes.control}>
                    <label htmlFor="title">Title</label>
                    <input type="text" required id="title" ref={enteredTitleRef} />
                </div>
                <div className={classes.control}>
                    <label htmlFor="image">Image</label>
                    <input type="url" required id="image" ref={enteredImageRef} />
                </div>
                <div className={classes.control}>
                    <label htmlFor="address">Address</label>
                    <input type="text" required id="address" ref={enteredAddressRef} />
                </div>
                <div className={classes.control}>
                    <label htmlFor="description">Description</label>
                    <textarea required id="description" ref={enteredDescriptionRef} />
                </div>
                <div className={classes.actions}>
                    <button type="submit">Add Meetup</button>
                </div>
            </form>
        </Card>
    )
}
export default NewMeetupForm