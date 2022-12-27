import { MongoClient } from "mongodb"; // this wont't be visible to the client
import Head from "next/head";
import { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a giant list of React Meetups taking place around the world"
        />
      </Head>
      <MeetupList meetups={props.allMeetups} />
    </Fragment>
  );
}

export async function getStaticProps() {
  // Do something like get data from API
  const client = await MongoClient.connect(
    "mongodb+srv://idiris_omer:12Deadmetal12@cluster0.7pdpnm4.mongodb.net/test",
    {useUnifiedTopology: true}
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const allMeetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      allMeetups: allMeetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.title,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
