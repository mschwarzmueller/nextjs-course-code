import PinIcon from '../icons/PinIcon';
import CalendarIcon from '../icons/calendarIcon';
import ArrowIcon from '../icons/ArrowIcon';
import Button from '../ui/button';
import classes from './event-item.module.css';

function EventItem({ title, image, date, location, id }) {
  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedAddress = location.replace(', ', '\n');

  const exploreLink = `/events/${id}`;

  return (
    <li className={classes.item}>
      <img src={`/${image}`} alt={title} />
      <div className={classes.content}>
        <div className={classes.summary}>
          <h2>{title}</h2>
          <div className={classes.date}>
            <CalendarIcon />
            <time>{humanReadableDate}</time>
          </div>
          <div className={classes.address}>
            <PinIcon />
            <address>{formattedAddress}</address>
          </div>
        </div>
        <div classname={classes.actions}>
          <Button link={exploreLink}>
            <span>Explore Event</span>
            <span className={classes.icon}>
              <ArrowIcon />
            </span>
          </Button>
        </div>
      </div>
    </li>
  );
}
export default EventItem;
