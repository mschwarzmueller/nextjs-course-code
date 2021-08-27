import React, { Fragment } from 'react';
import MeetupDetails from '../../components/meetups/MeetupDetails';
import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';
const index = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetails
        title={props.meetupData.title}
        image={props.meetupData.image}
        address={props.meetupData.address}
      />
    </Fragment>
  );
};
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://jerry:cloudmongo5299@cluster0.bmczp.mongodb.net/Testing_First_NextJS?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetUpsCollection = db.collection('first_nextjs_meetups');
  const meetups = await meetUpsCollection.find({}, { _iD: 1 }).toArray();
  client.close();
  return {
    fallback: false,
    paths: meetups.map((meetup) => ({ params: { meetupId: meetup._id.toString() } })),
  };
}
export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    'mongodb+srv://jerry:cloudmongo5299@cluster0.bmczp.mongodb.net/Testing_First_NextJS?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetUpsCollection = db.collection('first_nextjs_meetups');
  const selectedMeetUp = await meetUpsCollection.findOne({ _id: ObjectId(meetupId) });
  console.log(selectedMeetUp ? selectedMeetUp : 'no');
  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetUp._id.toString(),
        title: selectedMeetUp.address,
        image: selectedMeetUp.image,
        description: selectedMeetUp.description,
      },
    },
  };
}
export default index;
