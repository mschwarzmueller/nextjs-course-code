import Link from "next/link";

function ClientsPage() {
  const clients = [
    { id: "max", name: "Maximilian" },
    { id: "manu", name: "Manuel" },
  ];

  return (
    <div>
      <h1>The Clients Page</h1>
      <ul>
        {clients.map(({ id, name }) => (
          <li key={id}>
            {/* <Link // 写法2 不推荐
              href={{
                pathname: "/clients/[id]",
                query: { id }, // id: client.id => 解构client.id 解构id: id => id
                }}
                > */}
            <Link href={`/clients/${id}`}>{name}</Link>
          </li>
        ))}
        {/* <li>
          <Link href="/clients/max">Maximilian</Link>
        </li>
        <li>
          <Link href="/clients/manu">Manuel</Link>
        </li> */}
      </ul>
    </div>
  );
}

export default ClientsPage;
