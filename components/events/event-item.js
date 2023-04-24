import Link from "next/link";
import Image from "next/image";

const EventItem = (props) => {
	const { id, title, location, image, date } = props;
	const formattedDate = new Date(date).toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	const formattedAddress = location.replace(", ", "\n");

	const fullEvent = `/events/${id}`;

	return (
		<li>
			<Image src={image} alt={title} width={1024} height={768} />
			<div>
				<div>
					<h2>{title}</h2>
				</div>
				<div>
					<time>{formattedDate}</time>
				</div>
				<div>
					<address>{formattedAddress}</address>
				</div>
			</div>
			<div>
				<Link href={fullEvent}>Explore Event</Link>
			</div>
		</li>
	);
};

export default EventItem;
