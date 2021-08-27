import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { Fragment } from 'react';
import NewMeetUpForm from '../../components/meetups/NewMeetupForm';
const index = () => {
  const router = useRouter();
  const addMeetUpHandler = async (dataEntered) => {
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      body: JSON.stringify(dataEntered),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    router.push('/');
  };
  return (
    <Fragment>
      <Head>
        <title>Add new MeetUp</title>
        <meta
          name="description"
          content="add your own meetups and create amazing networking oppertunities!"
        />
      </Head>
      <NewMeetUpForm onAddMeetup={addMeetUpHandler} />;
    </Fragment>
  );
};

export default index;
