import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta
          name="description"
          content={props.meetupData.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {

  const client = await MongoClient.connect(
    "mongodb+srv://idiris_omer:12Deadmetal12@cluster0.7pdpnm4.mongodb.net/test",
    {useUnifiedTopology: true}
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const allMeetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: allMeetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // Do something like get data from API
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://idiris_omer:12Deadmetal12@cluster0.7pdpnm4.mongodb.net/test"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
    revalidate: 10,
  };
}

export default MeetupDetails;
