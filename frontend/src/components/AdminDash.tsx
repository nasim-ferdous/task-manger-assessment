"use client";
import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";

export default function AdminDash() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("2"); // Default to the 'User' we seeded

  const loadTasks = async () => {
    const data = await apiCall("/tasks");
    setTasks(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiCall("/tasks", "POST", {
      title,
      assignedUserId: parseInt(assignedUserId),
    });
    setTitle("");
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel - Task Management</h1>

      {/* Create Task Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 items-end"
      >
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            New Task Title
          </label>
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Create Task
        </button>
      </form>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: any) => (
              <tr key={task.id} className="border-t">
                <td className="p-4">{task.title}</td>
                <td className="p-4">{task.assignedTo?.email}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
