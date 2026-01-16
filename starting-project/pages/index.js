import Link from "next/link";

function HomePage() {
  return (
    <div>
      <h1>The Home Page</h1>
      <ul>
        <li>
          {/* replace means can't go back */}
          <Link replace href="/portfolio">
            Portfolio
          </Link>
        </li>
        <li>
          <Link href="/clients">Clients</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
