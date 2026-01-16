import { useRouter } from "next/router";

function PortfolioProjectPage() {
  const router = useRouter();
  console.log(router);

  // send a request to some backend sewrver
  // to fetch the piece of data with an id of router.query.projectid

  return (
    <div>
      <h1>The PortfolioProject Page {router.query.projectid}</h1>
    </div>
  );
}

export default PortfolioProjectPage;
