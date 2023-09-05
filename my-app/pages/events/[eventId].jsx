import{useRouter} from 'next/router'
import { getEventById } from '@/dummy-data';

function EventsDetailPage() {
  const router = useRouter();

  const eventId = router.query.eventId;
  const event = getEventById(eventId);

  if(!event) {
    return <p>No event Found!</p>
  }
  
  return (
    <div>
      <h1>Event Detail</h1>
    </div>
  )
}

export default EventsDetailPage
