import DUMMY_DATA from "../data/DUMMY_DATA";
import MeetupList from "../components/meetups/MeetupList";

const AllMeetupsPage = () => {
  return <section>
    <h1>All Meetups</h1>
    <ul>
      {DUMMY_DATA.map((m) => {
        return (
          <MeetupList key={m.id} meetups={DUMMY_DATA} />
        )
      })}
    </ul>
  </section>;
};
export default AllMeetupsPage;
