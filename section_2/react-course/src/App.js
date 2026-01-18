import Todo from "./components/Todo";
import { tasks } from "./data/data";

function App() {
  return (
    <div>
      <h1>My Todo</h1>
      {tasks.map(({ id, title, startDate, endDate, progress, assignee }) => (
        <Todo
          key={id}
          title={title}
          startDate={startDate}
          endDate={endDate}
          progress={progress}
          assignedTo={assignee}
        />
      ))}
    </div>
  );
}

export default App;
