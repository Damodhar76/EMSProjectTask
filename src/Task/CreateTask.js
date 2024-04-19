import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './CreateTask.css'
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState('');
  const [projectName,setProjectName]=useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch departments data from the backend
    axios.get('http://localhost:8080/api/departments')
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  const handleDepartmentChange = (selectedDepartment) => {
    setDepartment(selectedDepartment);
    // Fetch employees based on the selected department
    axios.get(`http://localhost:8080/api/employees/by-department-id?departmentId=${selectedDepartment}`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
    // Reset assigned employee when department changes
    setAssignedEmployee('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Prepare data for the request body
    const formData = new FormData();
    if(!projectName){
      alert("enter project name")
      return
    }
    if(!taskName){
      alert("enter task name")
      return
    }
    if(!startDate){
      alert("enter start date")
      return
    }
    if(!endDate){
      alert("enter end date")
      return
    }
    if(!priority){
      alert("select task priority")
      return
    }
    if(!assignedEmployee){
      alert("select employee")
      return
    }
    if(!department){
      alert("select department ")
      return
    }
    if(!taskDescription){
      alert("enter task description")
      return
    }
    if(!file){
      alert("select file")
      return
    }
    formData.append('projectName',projectName)
    formData.append('name', taskName);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('priority', priority);
    formData.append('assignedEmployeeId', assignedEmployee);
    formData.append('departmentId', department);
    formData.append('taskDescription', taskDescription);
    formData.append('file', file||null);

    // Send POST request to create task
    axios.post('http://localhost:8080/api/tasks/create', formData)
      .then(response => {
        console.log('Task created successfully:', response.data);
        alert("Task created successfully! and Confirmation mail sent to employee sucessfully");
       
        // Reset form fields after successful creation
        setProjectName('')
        setTaskName('');
        setStartDate('');
        setEndDate('');
        setPriority('');
        setDepartment('');
        setAssignedEmployee('');
        setTaskDescription('');
        setFile(null);
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });
  };
  
  // Define your options for the select
  const options = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  // Define your change handler function
  const handlePriorityChange = (selectedOption) => {
    setPriority(selectedOption.value);
  };
  const options2 = employees.map(emp => ({
    value: emp.id,
    label: emp.name
  }));

  const handleAssignedEmployeeChange = selectedOption => {
    setAssignedEmployee(selectedOption.value);
  };
  const options3 = departments.map(dept => ({
    value: dept.id,
    label: dept.name
  }));

  const handleSelectedDepartmentChange = selectedOption => {
    setDepartment(selectedOption.value);
    handleDepartmentChange(selectedOption.value); // Invoke the parent handler
  };

  const handleClick = () => {
    navigate("/status");
  };
const handleNavigate=()=>{
  navigate("/task")
}
const handleClick1=()=>{
  navigate("/")
}
  return (
    <div className="task-form-container">
      <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            className="form-control"
            id="projectName"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            className="form-control"
            id="taskName"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <Select
            options={options}
            value={options.find(option => option.value === priority)}
            onChange={handlePriorityChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <Select
            options={options3}
            value={options3.find(option => option.value === department)}
            onChange={handleSelectedDepartmentChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="assignedEmployee">Assigned Employee</label>
          <Select
            options={options2}
            value={options2.find(option => option.value === assignedEmployee)}
            onChange={handleAssignedEmployeeChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="taskDescription">Task Description</label>
          <textarea
            className="form-control"
            id="taskDescription"
            rows={3}
            placeholder="Enter task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Attach File</label>
          <input
            type="file"
            className="form-control-file"
            id="file"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
            accept=".pdf,.doc,.docx"
          />
        </div>

        <button type="submit" onClick={handleClick1}className="btn btn-primary mr-2">
          Create Task
        </button>
        <button type="button" onClick={handleClick} className="btn btn-secondary">
          Tasks Status
        </button>
        <button type="button" style={{marginLeft:'0px'}} onClick={handleNavigate} className="btn btn-primary mr-2">
          Tasks 
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
