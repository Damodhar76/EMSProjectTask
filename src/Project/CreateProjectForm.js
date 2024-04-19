
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreateProjectForm.css';

const CreateProjectForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectTeamMembers: [],
    projectTestingMembers:[],
    projectDescription: '',
    projectBudget: '',
    projectStartDate: '',
    projectEndDate: '',
    numberOfHours: '',
  });
  const [managers, setManagers] = useState([]); // State to store manager names and IDs
  const [selectedManager, setSelectedManager] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeNames, setSelectedEmployeeNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTestingQuery, setSearchTestingQuery] = useState(''); // New state for searching testing members

  useEffect(() => {
    fetchEmployeeNamesAndIds();
    fetchManagerNamesAndIds(); // Fetch manager names and IDs
  }, []);

  useEffect(() => {
    if (formData.projectStartDate && formData.projectEndDate) {
      const startDate = new Date(formData.projectStartDate);
      const endDate = new Date(formData.projectEndDate);
      const diffInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalHours = diffInDays * 9; // Assuming 9 hours per day
      setFormData((prevState) => ({
        ...prevState,
        numberOfHours: totalHours.toString(),
      }));
    }
  }, [formData.projectStartDate, formData.projectEndDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'projectTeamMembers') {
      const employeeId = parseInt(value); // Convert value to integer
      if (checked) {
        // Add the employeeId to the projectTeamMembers array
        setFormData((prevState) => ({
          ...prevState,
          projectTeamMembers: [...prevState.projectTeamMembers, employeeId],
        }));
      } else {
        // Remove the employeeId from the projectTeamMembers array
        setFormData((prevState) => ({
          ...prevState,
          projectTeamMembers: prevState.projectTeamMembers.filter((id) => id !== employeeId),
        }));
      }
    } else {
      // For other fields, update the state normally
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'number' ? parseInt(value) : value, // Parse number fields as integers
      }));
    }
  };

  const fetchEmployeeNamesAndIds = async () => {
    try {
      const response = await axios.get('http://localhost:8087/api-v2/employees/names');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employee names and ids:', error);
      toast.error('Failed to fetch employee names and ids. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const handleRemoveEmployee = (index) => {
    const updatedNames = [...selectedEmployeeNames];
    updatedNames.splice(index, 1);
    setSelectedEmployeeNames(updatedNames);
  
    const updatedMembers = [...formData.projectTeamMembers];
    updatedMembers.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      projectTeamMembers: updatedMembers,
    }));
  };

  const fetchManagerNamesAndIds = async () => {
    try {
      const response = await axios.get('http://localhost:8087/api-v2/managers/names');
      setManagers(response.data);
    } catch (error) {
      console.error('Error fetching manager names and ids:', error);
      toast.error('Failed to fetch manager names and ids. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

//   const handleManagerChange = (managerFullName) => {
//     if (formData.projectTestingMembers.includes(managerFullName)) {
//         // If the manager is already in the array, remove it
//         setFormData((prevState) => ({
//             ...prevState,
//             projectTestingMembers: formData.projectTestingMembers.filter((name) => name !== managerFullName),
//         }));
//     } else {
//         // Otherwise, add it to the array
//         setFormData((prevState) => ({
//             ...prevState,
//             projectTestingMembers: [...prevState.projectTestingMembers, managerFullName],
//         }));
//     }
// };

  
  const handleRemoveTestingMember = (index) => {
    const updatedTestingMembers = [...formData.projectTestingMembers];
    updatedTestingMembers.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      projectTestingMembers: updatedTestingMembers,
    }));
  };

  const handleCheckboxChange = (employeeFullName) => {
    // Check if the employee is already in the project team members
    if (formData.projectTeamMembers.includes(employeeFullName)) {
      toast.warning('Employee is already a team member of this project!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
    // Update the form data
    setFormData((prevState) => ({
      ...prevState,
      projectTeamMembers: [...prevState.projectTeamMembers, employeeFullName],
    }));
    // Update the selected employee names
    setSelectedEmployeeNames((prevNames) => [...prevNames, employeeFullName]);
  };
  
const handleManagerChange = (managerFullName) => {
    if (formData.projectTestingMembers.includes(managerFullName)) {
        toast.warning('Manager is already a testing member of this project!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
        return;
    }
    setFormData((prevState) => ({
        ...prevState,
        projectTestingMembers: [...formData.projectTestingMembers, managerFullName],
    }));
};


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTestingSearchChange = (e) => {
    setSearchTestingQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredManagers = managers.filter((manager) =>
    manager.fullName.toLowerCase().includes(searchTestingQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.projectName.trim() === '') {
      toast.error('Project Name cannot be empty!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
    // Validate project name format (string followed by an optional integer)
    const projectNamePattern = /^[a-zA-Z]+[0-9]*$/;
    if (!projectNamePattern.test(formData.projectName)) {
      toast.error('Project Name must start with a string followed by an optional integer!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
    if (formData.projectBudget.trim() === '' || isNaN(formData.projectBudget)) {
      toast.error('Budget must be a number!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
    if (formData.projectStartDate.trim() === '' || formData.projectEndDate.trim() === '') {
      toast.error('Please select Start Date and End Date!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
    if (new Date(formData.projectStartDate) >= new Date(formData.projectEndDate)) {
      toast.error('End Date must be after Start Date!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
    if (formData.projectTeamMembers.length === 0) {
      toast.error('Please select at least one Team Member!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8068/projects', formData);
      console.log(response.data);
      toast.success('Project created successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      // Clear form data after successful submission
      setFormData({
        projectName: '',
        projectTeamMembers: [],
        projectTestingMembers:[],
        projectDescription: '',
        projectBudget: '',
        projectStartDate: '',
        projectEndDate: '',
        numberOfHours: '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create project. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <center><h2>Create Project</h2></center>
          <div className="form-group">
            <label htmlFor="projectName">Project Name:</label>
            <input
              type="text"
              className="form-control"
              id="projectName"
              placeholder="Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
            />
          </div>
{/* 
          <div className="form-group">
            <label htmlFor="projectTeamMembers">Team Members:</label>
            <input
              type="text"
              className="form-control"
              id="employeeSearch"
              placeholder="Search for employee..."
              value={searchQuery}
              onChange={handleSearchChange} 
            />
            {searchQuery && filteredEmployees.length === 0 && (
              <p className="text-danger">No matching employees found.</p>
            )}
            {searchQuery && filteredEmployees.map((employee) => (
              <div key={employee.id} className="form-check form-check-inline">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`employee-${employee.fullName}`}
                  value={employee.fullName}
                  checked={formData.projectTeamMembers.includes(employee.fullName)}
                  onChange={() => handleCheckboxChange(employee.fullName)}
                />
                <label className="form-check-label" htmlFor={`employee-${employee.fullName}`}>
                  {employee.fullName}
                </label>
              </div>
            ))}
          </div> */}
<div className="form-group">
  <label htmlFor="projectTeamMembers">Team Members:</label>
  <input
    type="text"
    className="form-control"
    id="employeeSearch"
    placeholder="Search for employee..."
    value={searchQuery}
    onChange={handleSearchChange} 
  />
  {searchQuery && filteredEmployees.length === 0 && (
    <p className="text-danger">No matching employees found.</p>
  )}
  {searchQuery && filteredEmployees.map((employee) => (
    <div key={employee.id} className="form-check form-check-inline">
      <input
        type="checkbox"
        className="form-check-input"
        id={`employee-${employee.fullName}`}
        value={employee.fullName}
        checked={formData.projectTeamMembers.includes(employee.fullName)}
        onChange={() => handleCheckboxChange(employee.fullName)}
      />
      <label className="form-check-label" htmlFor={`employee-${employee.fullName}`}>
        {employee.fullName}
      </label>
    </div>
  ))}
</div>

<div className="form-group">
  <label>Selected Team Members:</label>
  <ul>
    {selectedEmployeeNames.map((name, index) => (
      <li key={index}>
        {name}
        <span
          style={{ color: 'red', cursor: 'pointer', marginLeft: '5px' }}
          onClick={() => handleRemoveEmployee(index)}
        >
          &#10006;
        </span>
      </li>
    ))}
  </ul>
</div>
<div className="form-group">
            <label htmlFor="projectTestingMembers">Testing Members:</label>
            <input
              type="text"
              className="form-control"
              id="testingMemberSearch"
              placeholder="Search for testing member..."
              value={searchTestingQuery}
              onChange={handleTestingSearchChange} 
            />
            {searchTestingQuery && filteredManagers.length === 0 && (
              <p className="text-danger">No matching testing members found.</p>
            )}
            {searchTestingQuery && filteredManagers.map((manager) => (
              <div key={manager.id} className="form-check form-check-inline">
               <input
    type="checkbox"
    className="form-check-input"
    id={`testingMember-${manager.fullName}`}
    checked={formData.projectTestingMembers.includes(manager.fullName)}
    onChange={() => handleManagerChange(manager.fullName)} // Pass manager.fullName directly
/>


                <label className="form-check-label" htmlFor={`testingMember-${manager.fullName}`}>
                  {manager.fullName}
                </label>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label>Selected Testing Members:</label>
  <ul>
    {formData.projectTestingMembers.map((name, index) => (
      <li key={index}>
        {name}
        <span
          style={{ color: 'red', cursor: 'pointer', marginLeft: '5px' }}
          onClick={() => handleRemoveTestingMember(index)}
        >
          &#10006;
        </span>
      </li>
    ))}
  </ul>
</div>

          <div className="form-group">
            <label htmlFor="projectDescription">Description:</label>
            <textarea
              className="form-control"
              id="projectDescription"
              placeholder="Write few lines about project"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectBudget">Budget:</label>
            <input
              type="text"
              className="form-control"
              id="projectBudget"
              placeholder="Budget"
              name="projectBudget"
              value={formData.projectBudget}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectStartDate">Start Date:</label>
            <input
              type="date"
              className="form-control"
              id="projectStartDate"
              name="projectStartDate"
              value={formData.projectStartDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectEndDate">End Date:</label>
            <input
              type="date"
              className="form-control"
              id="projectEndDate"
              name="projectEndDate"
              value={formData.projectEndDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="numberOfHours">Number of Hours:</label>
            <input
              type="text"
              className="form-control"
              id="numberOfHours"
              placeholder="No of hours"
              name="numberOfHours"
              value={formData.numberOfHours}
              disabled
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Project
          </button>
          <Link to="/ProjectList" className="btn btn-secondary">
            Project List
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
