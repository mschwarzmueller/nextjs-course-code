import React from 'react'
import EventItem from './eventItem'

function EventList(props) {

    const {items} = props
  return (
    <ul>
      {items.map(event => <EventItem/>)}
    </ul>
  )
}
import EventItem from './eventItem'

export default EventList
