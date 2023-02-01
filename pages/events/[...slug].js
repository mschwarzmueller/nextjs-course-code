import { useRouter } from 'next/router';
import { Fragment } from 'react';
import EventList from '../../components/events/event-list';
import { getFilteredEvents } from '../..//helpers/api-utils';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import Head from 'next/head';

function FilteredEvents(props) {
  const router = useRouter();
  const filterData = router.query.slug;

  const pageHead = (
    <Head>
      <title>NextJS Filtered Events</title>
      <meta
        name="description"
        content={`A list of filtered events`}
      />
    </Head>
  );

  if (!filterData) {
    return (
      <Fragment>
        {pageHead}
        <p className="center">Loading...</p>;
      </Fragment>
    );
  }

  if (props.hasError) {
    return (
      <Fragment>
        {pageHead}
        <div className="center">
          <p>No events found.</p>
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  if (!props.filteredEvents || props.filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHead}
        <div className="center">
          <p>No events found for the chosen filter.</p>
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(props.date.year, props.date.month - 1);

  return (
    <Fragment>
      {pageHead}
      <ResultsTitle date={date} />
      <EventList items={props.filteredEvents} />
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;

  const filterData = params.slug;

  const numYear = filterData[0];
  const numMonth = filterData[1];

  const filteredYear = +numYear; //transforming to number by +
  const filteredMonth = +numMonth;

  if (
    isNaN(filteredYear) ||
    isNaN(filteredMonth) ||
    filteredYear > 2030 ||
    filteredYear < 2020 ||
    filteredMonth < 1 ||
    filteredMonth > 12
  ) {
    return {
      props: { hasError: true },
      // notFound: true,
      // redirect: {
      //   destination: '/error'
      // }
    };
  }

  const filteredEvents = await getFilteredEvents({
    year: filteredYear,
    month: filteredMonth,
  });

  return {
    props: {
      filteredEvents,
      date: {
        year: filteredYear,
        month: filteredMonth,
      },
    },
  };
}

export default FilteredEvents;
