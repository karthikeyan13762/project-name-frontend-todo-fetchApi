import React, { useEffect, useState } from "react";

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const apiURL = "https://project-name-backend-todo-fetchapi.onrender.com";
  // ------------------------------------------------------------

  const handleSubmit = async () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      const response = await fetch(`${apiURL}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
      console.log(response);

      if (response.ok) {
        setMessage("Item added successfully");
        const newTodo = await response.json(); // Assuming backend returns the created todo item
        console.log(newTodo);

        setTodos([...todos, newTodo]);
        setTitle("");
        setDescription("");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      } else {
        setError("Unable to create todo item");
      }
    } else {
      setError("Title and description cannot be empty");
    }
  };
  // ------------------------------------------------------------
  const handleUpdate = async () => {
    if (title.trim() !== "" && description.trim() !== "") {
      const response = await fetch(`${apiURL}/todo/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setMessage("Item updated successfully");
        setTodos(
          todos.map((todo) =>
            todo._id === editId ? { ...todo, title, description } : todo
          )
        );
        setEditId(null);
        setTitle("");
        setDescription("");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      } else {
        setError("Unable to update todo item");
      }
    } else {
      setError("Title and description cannot be empty");
    }
  };
  // ------------------------------------------------------------

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setTitle(todo.title);
    setDescription(todo.description);
  };
  // ------------------------------------------------------------

  const handleDelete = async (id) => {
    const response = await fetch(`${apiURL}/todo/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setMessage("Item deleted successfully");
      setTodos(todos.filter((todo) => todo._id !== id));
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } else {
      setError("Unable to delete todo item");
    }
  };
  // ------------------------------------------------------------

  const getItems = async () => {
    try {
      const response = await fetch(apiURL + "/todo");
      if (!response.ok) {
        throw new Error("Failed to fetch todo items");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Failed to load todo items");
    }
  };

  useEffect(() => {
    getItems();
  }, []);
  // ------------------------------------------------------------

  return (
    <>
      <div className="row p-3 bg-primary text-white">
        <h1>Todo app</h1>
      </div>
      <div className="row">
        <h2>{editId ? "Edit Item" : "Add Item"}</h2>
        {message && <p className="text-primary">{message}</p>}
        <div className="form-group d-flex gap-2 m-1 p-3">
          <input
            type="text"
            placeholder="Enter a title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter a description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {editId ? (
            <button className="btn btn-info" onClick={handleUpdate}>
              Update
            </button>
          ) : (
            <button className="btn btn-info" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="list-group-item d-flex justify-content-between align-items-center bg-warning text-dark my-2"
            >
              <span className="mt-1 fw-bold">{todo.title}</span>
              <span className="mt-1 fw-bold">{todo.description}</span>
              <div>
                <button
                  className="btn btn-success me-2 mt-1"
                  onClick={() => handleEdit(todo)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger me-2 mt-1"
                  onClick={() => handleDelete(todo._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Todo;
