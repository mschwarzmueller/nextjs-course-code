import Head from 'next/head';
import EventList from '../components/events/event-list';
import { getFeaturedEvents } from '../helpers/api-utils';

function HomePage(props) {
  return (
    <div>
      <Head>
        <title>NextJS Events</title>
        <meta name="description" content="A lot of great events" />
      </Head>
      <EventList items={props.featuredEvents} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();

  return {
    props: {
      featuredEvents,
    },
    revalidate: 1800,
  };
}

export default HomePage;
