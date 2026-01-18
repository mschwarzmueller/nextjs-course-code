import DUMMY_DATA from "../data/DUMMY_DATA";
import MeetupList from "../components/meetups/MeetupList";

const AllMeetupsPage = () => {
  return <section>
    <h1>All Meetups</h1>
    <MeetupList meetups={DUMMY_DATA} />
  </section>;
};
export default AllMeetupsPage;
