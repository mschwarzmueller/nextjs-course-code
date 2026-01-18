import MeetupList from "../components/meetups/MeetupList";
import { useState, useEffect } from "react";

const AllMeetupsPage = () => {
  // properties
  const [isLoading, setIsLoading] = useState(true);
  const [loadedMeetups, setLoadedMeetups] = useState();

  // get data from Firebase
  useEffect(() => {
    setIsLoading(true);
    fetch('https://react-getting-started-9f56f-default-rtdb.firebaseio.com/meetups.json')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        // transform firebase object to an array
        const meetups = [];
        for (const key in data) {
          const meetup = {
            id: key,
            ...data[key]
          }
          meetups.push(meetup)
        }
        setIsLoading(false);
        setLoadedMeetups(meetups);
      })
  }, []);

  // show Loading... while data loads
  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    )
  }


  // return component
  return <section>
    <h1>All Meetups</h1>
    <MeetupList meetups={loadedMeetups} />
  </section>;
};
export default AllMeetupsPage;
