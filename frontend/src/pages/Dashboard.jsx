import { useEffect, useState } from "react";
import API from "../api/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    const res = await API.post("/tasks", { title });
    setTasks([...tasks, res.data]);
    setTitle("");
  };

  const toggleTask = async (task) => {
    const res = await API.put(`/tasks/${task.id}`, {
      completed: !task.completed,
    });
    setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h2>My Tasks</h2>

      <form onSubmit={addTask}>
        <input
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button>Add</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              onClick={() => toggleTask(task)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
