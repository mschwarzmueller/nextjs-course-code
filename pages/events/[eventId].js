import { Fragment } from 'react';
import { getEventById, getFeaturedEvents } from '../../helpers/api-utils';
import EventSummary from '../../components/event-detail/event-summary';
import EventLogistics from '../../components/event-detail/event-logistics';
import EventContent from '../../components/event-detail/event-content';
import Head from 'next/head';

function EventDetail(props) {
  const event = props.selectedEvent;

  if (!event) {
    return <div className="center"><p>Loading</p></div>;
  }

  return (
    <Fragment>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description} />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  );
}
export default EventDetail;

export async function getStaticPaths() {
  const events = await getFeaturedEvents();
  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;
  const event = await getEventById(eventId);

  return {
    props: { selectedEvent: event },
    revalidate: 30,
  };
}
