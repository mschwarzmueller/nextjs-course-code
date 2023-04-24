import { useRouter } from "next/router";

const SingleEvent = () => {
	const router = useRouter();
	console.log(router.query);
	return (
		<div>
			<h1>Single Event Page</h1>
			<p>This page is where the individual events are shown.</p>
		</div>
	);
};

export default SingleEvent;
