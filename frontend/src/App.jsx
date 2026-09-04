import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" });

  const loadTasks = async () => {
    const response = await fetch(`${API}/tasks`);
    setTasks(await response.json());
  };

  useEffect(() => { loadTasks().catch(console.error); }, []);

  const createTask = async (event) => {
    event.preventDefault();
    const response = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!response.ok) return alert("Task title is required.");
    setForm({ title: "", description: "", priority: "medium" });
    loadTasks();
  };

  const updateStatus = async (task) => {
    const status = task.status === "todo" ? "in-progress" :
                   task.status === "in-progress" ? "done" : "todo";
    await fetch(`${API}/tasks/${task._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  };

  return (
    <main className="container">
      <header>
        <p className="eyebrow">DEVOPS PRACTICE PROJECT</p>
        <h1>TaskFlow</h1>
        <p>Simple task management application for learning CI/CD.</p>
      </header>

      <section className="card">
        <h2>Create Task</h2>
        <form onSubmit={createTask}>
          <input placeholder="Task title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <select value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <button>Create Task</button>
        </form>
      </section>

      <section>
        <div className="section-title"><h2>Your Tasks</h2><span>{tasks.length} total</span></div>
        {tasks.length === 0 ? <div className="empty">No tasks yet.</div> :
          tasks.map(task => (
            <article className="task" key={task._id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description || "No description"}</p>
                <small>{task.priority.toUpperCase()} · {task.status}</small>
              </div>
              <div className="actions">
                <button onClick={() => updateStatus(task)}>Next status</button>
                <button className="danger" onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </article>
          ))
        }
      </section>
    </main>
  );
}
