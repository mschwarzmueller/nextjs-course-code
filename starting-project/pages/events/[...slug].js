import { getFilteredEvents } from "../../dummy-data";
import { useRouter } from "next/router";
import EventList from "../../components/events/event-list";
import ResultsTitle from '../../components/events/results-title';
import { Fragment } from "react";
import Button from "../../components/ui/button";
import ErrorAlert from '../../components/ui/error-alert';
function FilteredEventsPage()  {
    const router = useRouter();
    const filteredData = router.query.slug;

    if (!filteredData) {
        return (
            <p className="center">Loading...</p>
        )
    }

    const filteredYear = filteredData[0];
    const filteredMonth = filteredData[1];

    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    if (isNaN(numYear) || isNaN(numMonth) || numYear > 2030 || numYear < 2021 || numMonth < 1 || numMonth > 12) {
        return (
            <Fragment>
                <ErrorAlert><p>Invalid Filter. Please adjust your values!</p>

                </ErrorAlert>
                <div className="center">
                    <Button linke='/events'>Show All Events</Button>
                </div>
            </Fragment>

        )
    }

    const filteredEvents = getFilteredEvents({year: numYear, month: numMonth});

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <Fragment>
                <ErrorAlert>
                <p>No events found for the chosen filter!</p>
                </ErrorAlert>
                <div className="center">
                    <Button linke='/events'>Show All Events</Button>
                </div>
            </Fragment>

        )
    }

    const date = new Date(numYear, numMonth - 1);

    return (
        <Fragment>
            <ResultsTitle date={date} />
            <EventList items={filteredEvents}/>
        </Fragment>
    )
}

export default FilteredEventsPage;