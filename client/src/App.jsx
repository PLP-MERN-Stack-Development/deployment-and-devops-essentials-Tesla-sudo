import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(`${API_URL}/todos`);
    setTodos(res.data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await axios.post(`${API_URL}/todos`, { text: input });
    setTodos([res.data, ...todos]);
    setInput('');
  };

  const toggleTodo = async (id, completed) => {
    const res = await axios.patch(`${API_URL}/todos/${id}`, { completed: !completed });
    setTodos(todos.map(todo => todo._id === id ? res.data : todo));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">My Todo List</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-8">
        <input
        
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" /> Add
        </button>
      </form>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id, todo.completed)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'} text-lg`}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No todos yet. Add one above!</p>
      )}
    </div>
  );
}

export default App;