import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";

function Home() {
  const [property, setProperty] = useState({ title: "" });
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://todoback-ej5o.onrender.com/api/todos");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch tasks",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!property.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Task cannot be empty!",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put(
          `https://todoback-ej5o.onrender.com/api/todos/${editingId}`,
          property
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Task updated successfully",
          confirmButtonColor: "#3085d6",
        });
      } else {
        await axios.post(
          "https://todoback-ej5o.onrender.com/api/todos",
          property
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Task added successfully",
          confirmButtonColor: "#3085d6",
        });
      }
      
      fetchTasks();
      setProperty({ title: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.error || "Operation failed",
        confirmButtonColor: "#d33",
      });
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://todoback-ej5o.onrender.com/api/todos/${id}`);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Task deleted successfully",
        confirmButtonColor: "#3085d6",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.error || "Failed to delete task",
        confirmButtonColor: "#d33",
      });
    }
  };

  const editTask = (task) => {
    setProperty({ title: task.title });
    setEditingId(task._id);
  };

  return (
    <div>
      <nav>
        <div className="logo">To-Do List</div>
      </nav>
      <div className="container">
        <h2>Task Manager</h2>
        <form onSubmit={handleSubmit} className="input-section">
          <input
            type="text"
            name="title"
            value={property.title}
            onChange={handleChange}
            placeholder="Enter a new task"
          />
          <button type="submit">{editingId !== null ? "Update Task" : "Add Task"}</button>
        </form>
        <div id="taskList">
          {tasks.map((task) => (
            <div key={task._id} className="task">
              <span>{task.title}</span>
              <button className="delete" onClick={() => deleteTask(task._id)}>
                Delete
              </button>
              <button className="edit" onClick={() => editTask(task)}>
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
