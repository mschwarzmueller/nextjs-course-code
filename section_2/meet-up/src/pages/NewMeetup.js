import NewMeetupForm from "../components/meetups/NewMeetupForm";
import { useHistory } from 'react-router-dom'

const NewMeetupPage = () => {
  // properties
  const history = useHistory();

  // helper methods
  const handleAddMeetup = (meetupData) => {
    fetch('https://react-getting-started-9f56f-default-rtdb.firebaseio.com/meetups.json', {
      method: 'POST',
      body: JSON.stringify(meetupData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      history.replace('/');
    })
  }

  // return component
  return <section>
    <h1>Add New Meetup</h1>
    <NewMeetupForm onAddMeetup={handleAddMeetup} />
  </section>
};
export default NewMeetupPage;
