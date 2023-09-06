import { Fragment } from "react";
import { useRouter } from "next/router";
import { getFilteredEvents } from "@/dummy-data";
import EventList from "@/Components/events/eventList";
import ResultsTitle from "@/Components/events/results-title";
import Button from "@/Components/events/UserInterface/button";
import ErrorAlert from "@/Components/error-alert/error-alert";

function FilteredEventsPage() {
  const router = useRouter();
  const filterData = router.query.slug;

  if (!filterData) {
    return <p className="center">Loading...</p>;
  }

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>Invalid Filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button Link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const FilteredEvents = getFilteredEvents({
    year: numYear,
    month: numMonth,
  });

  if (!FilteredEvents || FilteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button Link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={FilteredEvents} />
    </Fragment>
  );
}

export default FilteredEventsPage;
