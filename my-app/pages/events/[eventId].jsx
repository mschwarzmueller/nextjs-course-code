import { useRouter } from "next/router";
import { Fragment } from "react";
import { getEventById } from "@/dummy-data";
import EventSummary from "@/Components/event-detail/event-summary";
import EventLogistics from "@/Components/event-detail/event-logistics";
import EventContent from "@/Components/event-detail/event-content";

function EventsDetailPage() {
  const router = useRouter();

  const eventId = router.query.eventId;
  const event = getEventById(eventId);

  if (!event) {
    return <p>No event Found!</p>;
  }

  return (
    <Fragment>
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

export default EventsDetailPage;
