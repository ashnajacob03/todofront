import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";

function Home() {
  const [property, setProperty] = useState({ title: "" });
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

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
      await axios.post(
        "https://todoback-ej5o.onrender.com/itemInserting",
        property
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Task added successfully",
        confirmButtonColor: "#3085d6",
      });

      if (editingIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = property.title;
        setTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        setTasks([...tasks, property.title]);
      }
      
      setProperty({ title: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Task not added",
        confirmButtonColor: "#d33",
      });
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index) => {
    setProperty({ title: tasks[index] });
    setEditingIndex(index);
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
          <button type="submit">{editingIndex !== null ? "Update Task" : "Add Task"}</button>
        </form>
        <div id="taskList">
          {tasks.map((task, index) => (
            <div key={index} className="task">
              <span>{task}</span>
              <button className="delete" onClick={() => deleteTask(index)}>
                Delete
              </button>
              <button className="edit" onClick={() => editTask(index)}>
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
