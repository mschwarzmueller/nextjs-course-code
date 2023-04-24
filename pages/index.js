import Image from "next/image";
import { getFeaturedEvents } from "../dummy-data";
import EventList from "../components/events/event-list";

const Home = () => {
	const featuredEvents = getFeaturedEvents();
	return (
		<div>
			<h1>Home</h1>
			<EventList items={featuredEvents} />
		</div>
	);
};

export default Home;
