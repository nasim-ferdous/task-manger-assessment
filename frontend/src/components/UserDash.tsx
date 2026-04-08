"use client";
import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";

export default function UserDash() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await apiCall("/tasks");
    setTasks(data);
  };

  const updateStatus = async (id: number, status: string) => {
    await apiCall(`/tasks/${id}/status`, "PATCH", { status });
    loadTasks(); // Refresh to show the change
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Assigned Tasks</h1>
      <div className="grid gap-4">
        {tasks.map((task: any) => (
          <div
            key={task.id}
            className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-gray-500 text-sm">Status: {task.status}</p>
            </div>
            <select
              value={task.status}
              onChange={(e) => updateStatus(task.id, e.target.value)}
              className="p-2 border rounded bg-gray-50"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500">No tasks assigned to you yet.</p>
        )}
      </div>
    </div>
  );
}
