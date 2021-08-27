import React, { Fragment } from 'react';
import classes from './MeetupDetails.module.css';
const MeetupDetails = (props) => {
  return (
    <Fragment>
      <h2>Details</h2>
      <section className={classes.detail}>
        <img src={props.image} alt={props.title} />
        <div>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
      </section>
    </Fragment>
  );
};

export default MeetupDetails;
