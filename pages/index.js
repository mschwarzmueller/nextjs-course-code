import React from 'react';
import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';

const index = (props) => {
  return <MeetupList meetups={props.meetups} />;
};
export async function getStaticProps() {
  const client = await MongoClient.connect(
    'mongodb+srv://jerry:cloudmongo5299@cluster0.bmczp.mongodb.net/Testing_First_NextJS?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetUpsCollection = db.collection('first_nextjs_meetups');
  const meetups = await meetUpsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((each) => ({
        title: each.title,
        address: each.address,
        image: each.image,
        id: each._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default index;
