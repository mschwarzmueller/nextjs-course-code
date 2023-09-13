import EventList from '@/Components/events/eventList'
import { getAllEvents } from '@/dummy-data'
import EventSearch from '@/Components/events/eventSearch';
import { Fragment } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

function AllEventsPage() {

  const events = getAllEvents();
const router = useRouter();

function findEventsHandler(year, month){
  const fullPath = `/events/${year}/${month}/abc`;
router.push(fullPath)
}

  return (
    <Fragment>
     <Head>
      <title>All Events</title>
      <meta name="description" content="Find a lot of great events that allow you to evolve..."/>
    </Head>
    <EventSearch onSearch={findEventsHandler} />
    <EventList items={events} />
    </Fragment>
  )
}

export default AllEventsPage
