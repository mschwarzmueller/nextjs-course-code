import { useRouter } from "next/router";

function ClientProjectsPage() {
  const router = useRouter();
  console.log(router.query);

  function handleLoadProject() {
    router.push("/clients/max/projecta"); //Navigate to...
    // router.push({
    //   pathname: "/clients/[id]/[clientprojectid]",
    //   query: { id: "max", clientprojectid: "projecta" },
    // });
    // router.replace("/clients/max/projecta"); //can't go back
  }

  return (
    <div>
      <h1>The Projects of a Given Client {router.query.id}</h1>
      <button onClick={handleLoadProject}>Load Project A</button>
    </div>
  );
}

export default ClientProjectsPage;
