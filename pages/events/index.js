import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';
import { getAllEvents } from '../../helpers/api-utils';

function EventsPage(props) {
  const router = useRouter();
  const { events } = props;

  const findEventsHandler = (year, month) => {
    const fullPath = `/events/${year}/${month}`;

    router.push(fullPath);
  };

  return (
    <Fragment>
      <Head>
        <title>NextJS All Events</title>
        <meta name="description" content="A lot of great events" />
      </Head>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </Fragment>
  );
}
export default EventsPage;

export async function getStaticProps() {
  const events = await getAllEvents();
  return {
    props: { events },
    revalidate: 60,
  };
}
