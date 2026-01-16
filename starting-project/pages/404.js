import { useRouter } from "next/router";

function PageError() {
  const router = useRouter();

  function handleBackHome() {
    router.replace("/");
  }

  return (
    <div>
      <h1>The Error Page</h1>
      <button onClick={handleBackHome}>Click to Back To Home!</button>
    </div>
  );
}

export default PageError;
