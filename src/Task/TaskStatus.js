import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TaskStatus.css'

const TaskStatus = () => {
  const [tasks, setTasks] = useState([]);
  const navigate=useNavigate()

  const handleFetchTasks = () => {
    // Make an HTTP request to fetch tasks from the backend
    axios.get('http://localhost:8080/api/task-status/all')
      .then(response => {
        setTasks(response.data); // Update state with fetched tasks
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  useEffect(() => {
    // Fetch tasks when the component mounts
    handleFetchTasks();
  }, []);
  const handleClick2=()=>{
    navigate("/")
  }
  return (
    <div className='table3'>
       <h2 style={{display:'inline'}}>Tasks Status</h2>
      <button style={{float:'right',marginBottom:'13px',backgroundColor:'gray'}} type="button" onClick={handleClick2} className="btn btn-secondary">Back</button>
    <table className="table table-striped">

      <thead>
        <tr>
          <th>ID</th>
          <th>Task Name</th>
          <th>assignedEmployeeId</th>
          <th>start Date</th>
          <th>End Date</th>
          <th>Status</th>
          <th>Priority</th>
          {/* Add more table headers as needed */}
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id}>
            <td>{task.id}</td>
            <td>{task.name}</td>
            <td>{task.assignedEmployeeId}</td>
            <td>{task.startDate}</td>
            <td>{task.endDate}</td>
            <td>{task.taskStatus}</td>
            <td>{task.priority}</td>
            {/* Render additional task details in table cells */}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default TaskStatus;
