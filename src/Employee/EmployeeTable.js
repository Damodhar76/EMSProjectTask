/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button,Modal,Form } from 'react-bootstrap';
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';
import FullScreenPDFViewer from '../Task/FullViewPdf';
import './Employee.css'

const EmployeeTable = () => {
  const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/employees/6')
      .then(response => {
        setEmployees([response.data]);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  const handleEmployeeClick = (employeeId) => {
    axios.get(`http://localhost:8080/api/tasks?assignedEmployeeId=${employeeId}`)
      .then(response => {
        const tasksWithStatus = response.data.map(task => ({
          ...task,
          selectedStatus: task.taskStatus // Assuming taskStatus field exists in your task object
        }));
        setTasks(tasksWithStatus);
        setSelectedEmployee(employeeId);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };
  
  const handleStartButtonClick = async (task) => {
    console.log("task id :"+task.id)
    const id = employees[0].id;
    console.log("employee id "+id)
    const response =await axios.post(`http://localhost:8080/api/tasks/mail/${id}/${task.id}`)
    alert(response.data)
   
  };
  // eslint-disable-next-line no-unused-vars
  const [selectedTask, setSelectedTask] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(null);
 
  const handleStatusChange = (selectedOption, taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, selectedStatus: selectedOption } : task
      )
    );
  };

  const handleUploadButtonClick = async (task) => {
    console.log(task);
    const { id, name, startDate, endDate, assignedEmployeeId, priority,projectName } = task;
    if (!name || !startDate || !endDate || !assignedEmployeeId || !priority || !task.selectedStatus) {
      alert('Please select status of task.');
      return;
    }

    const taskDetails = {
      id,
      name,
      projectName,
      startDate,
      endDate,
      assignedEmployeeId,
      priority,
      taskStatus: task.selectedStatus.value, // Assuming you have selectedStatus available
    };

    try {
      // Send taskDetails to the backend
      await axios.post('http://localhost:8080/api/task-status/create', taskDetails);

      alert('Task details uploaded successfully.');
    } catch (error) {
      alert(' Details already uploaded.');
    }
  };
  
  const [editTaskData, setEditTaskData] = useState({});

  const [showModal, setShowModal] = useState(false);
 
  
  
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleUpdate = async () => {
    if (selectedTask && editTaskData.taskStatus) {
      const { id, name, startDate, endDate, assignedEmployeeId, priority ,projectName} = selectedTask;
      
  
      // Perform validation for required fields
      if (!name || !startDate || !endDate || !assignedEmployeeId || !priority||!projectName) {
        alert('Please fill out all required fields.');
        return;
      }
  
      const taskDetails = {
        id,
        name,
        startDate,
        projectName,
        endDate,
        assignedEmployeeId,
        priority,
        
       taskStatus: editTaskData.taskStatus, // Use editTaskData.taskStatus
      };
      
  
      try {
        await axios.put('http://localhost:8080/api/task-status/update', taskDetails);
  
        alert('Task details updated successfully.');
        setShowModal(false);
      } catch (error) {
        alert('Error updating task details.');
      }
    } else {
      alert('Please select a task  status.');
    }
  };
  
  const [showPDF, setShowPDF] = useState(false);
const togglePDF = () => {
  setShowPDF(!showPDF);
};
  

const handleUpdateButtonClick = (task) => {
  setSelectedTask(task);
  setEditTaskData({ ...task });
  setSelectedStatus(task.selectedStatus); // Set the initial value of selectedStatus to the existing task status
  setShowModal(true);
};
const handleInputChange = (selectedOption) => {
  setSelectedStatus(selectedOption); // Update selectedStatus state
  setEditTaskData({ ...editTaskData, taskStatus: selectedOption.value });
};
const handleClick=()=>{
  navigate("/employee")
}

  return (
    <div className='table1'>
      <h2>Employee Details</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.department?.name}</td>
              <td>
                <Button onClick={() => handleEmployeeClick(employee.id)} onDoubleClick={handleClick}>View Tasks</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedEmployee && (
        <div>
          <h2>Tasks Assigned to Employee</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th style={{width:'250px'}}>Employee Id</th>
                <th style={{width:'200px'}}>Project Name</th>
                <th style={{width:'400px'}}>Name</th>
                <th>Attached File</th>
                <th style={{width:'400px'}}>Start Date</th>
                <th style={{width:'400px'}}>End Date</th>
                <th>Priority</th>
                <th className="status-header">Status of Task</th>
               
                <th>Start Button</th>
                <th>Upload Deatils</th>
                <th>Update Details</th>
                
                {/* Add more task details headers as needed */}
              </tr>
            </thead>
            <tbody>
        {tasks.map(task => (
          <tr key={task.id}>
            <td>{task.id}</td>
            <td>{task.assignedEmployeeId}</td>
            <td>{task.projectName}</td>
            <td>{task.name}</td>
            <td><Button onClick={togglePDF} className="btn btn-primary">
                      {showPDF ? 'Hide File' : 'View File'}
                    </Button>
                    {showPDF && <FullScreenPDFViewer pdfData={task.attachedFile} />}
</td>
            <td>{task.startDate}</td>
            <td>{task.endDate}</td>
            <td>{task.priority}</td>
            <td>
      <Select
        value={task.selectedStatus} // Use task-specific status
        onChange={(selectedOption) => handleStatusChange(selectedOption, task.id)} // Pass task id to handleStatusChange
        options={[
         
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
          { value: 'on_hold', label: 'On Hold' },
        ]}
      />
    </td>
            <td style={{marginRight:'5px'}}>
              <Button style={{marginRight:'15px'}} onClick={()=>handleStartButtonClick(task)}>Start</Button>
             </td>
            <td>
            <Button onClick={() => handleUploadButtonClick(task)}>Upload</Button>

            </td>
            <td>
            <Button onClick={() => handleUpdateButtonClick(task)}>Update</Button>
            </td>
          </tr>
        ))}
      </tbody>
          </Table>
        </div>
      )}
       <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group>
              <Form.Label>Id</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={editTaskData.id}
                onChange={handleInputChange}
                readOnly
              />
               </Form.Group>
               <Form.Group>
  <Form.Label>Status</Form.Label>
  <Select
    value={selectedStatus} // Use selectedStatus directly
    onChange={handleInputChange}
    options={[
      { value: 'pending', label: 'Pending' },
      { value: 'completed', label: 'Completed' },
      { value: 'on_hold', label: 'On Hold' },
    ]}
  />
</Form.Group>
  

            <Form.Group>
              <Form.Label>assignedEmployeeId</Form.Label>
              <Form.Control
                type="text"
                name="assignedEmployeeId"
                value={editTaskData.assignedEmployeeId}
                readOnly
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={editTaskData.endDate}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editTaskData.name}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="projectName"
                value={editTaskData.projectName}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                type="text"
                name=" priority"
                value={editTaskData.priority}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={editTaskData.startDate}
                onChange={handleInputChange}
                readOnly
              />
            </Form.Group>
            
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeTable;
