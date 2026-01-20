import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!newTask) return;
    await API.post("/tasks", { title: newTask });
    setNewTask("");
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await API.put(`/tasks/${task.id}`, { title: task.title, completed: !task.completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveEditing = async (id) => {
    if (!editingTitle) return alert("Titlul este necesar");
    await API.put(`/tasks/${id}`, { title: editingTitle, completed: tasks.find(t => t.id === id).completed });
    cancelEditing();
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border px-2 py-1 flex-grow rounded-l"
          placeholder="New task"
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">
          Add
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between mb-2">
            {editingId === task.id ? (
              <div className="flex flex-grow items-center space-x-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="border px-2 py-1 flex-grow rounded"
                />
                <button onClick={() => saveEditing(task.id)} className="bg-green-500 text-white px-2 rounded hover:bg-green-600">
                  Save
                </button>
                <button onClick={cancelEditing} className="bg-gray-300 px-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span
                  onClick={() => toggleComplete(task)}
                  className={`cursor-pointer flex-grow ${task.completed ? "line-through text-gray-400" : ""}`}
                >
                  {task.title}
                </span>
                <div className="space-x-2">
                  <button onClick={() => startEditing(task)} className="text-yellow-500 hover:text-yellow-700">
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
