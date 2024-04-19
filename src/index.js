import React from 'react';
import {  BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import Manager from './Manager/Manager';
import Managerhompage from './Manager/Managerhompage';
import Admin from './Admin/Admin';
import EmployeeHome from './Employee/EmployeeHome'
import Employee from './Employee/Employee';
import CreateCompanyForm from './Company/CreateCompanyForm';
import CompanyList from './Company/CompanyList';
import Company from './Company/Company';
import CreateProjectForm from './Project/CreateProjectForm';
import EditProjectForm from './Project/EditProjectForm';
import ProjectList from './Project/ProjectList';
import EmployeeTable from './Employee/EmployeeTable';
import CreateTask from './Task/CreateTask';
import DepartmentManager from './Task/DepartmentManager';
import FullViewPdf from './Task/FullViewPdf';
import TaskStatus from './Task/TaskStatus';
import AddEmployee from './Employee/AddEmployee';
import UpdateEmployee from './Employee/UpdateEmployee';
import TaskManager from './Task/TaskManager';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Admin/>}/>
      <Route path="/Manager" element={<Manager/>}/>
      <Route path="/Managerhompage" element={<Managerhompage/>}/>
      <Route path="/Admin" element={<Admin/>}/>
       <Route path="/EmployeeHome" element={<EmployeeHome/>}/>
       <Route path="/Employee" element={<Employee/>}/> 
      <Route path='/CreateCompanyForm' element={<CreateCompanyForm/>}></Route>
      <Route path='/CompanyList'element={<CompanyList/>}></Route>
      <Route path='/Company/:companyid' element={<Company/>}></Route>
      <Route path='/CreateProjectForm' element={<CreateProjectForm/>}></Route>
      <Route path='/EditProjectForm/:projectId' element={<EditProjectForm/>}></Route>
      <Route path='/ProjectList' element={<ProjectList/>}></Route>
      <Route path='/EmployeeTable' element={<EmployeeTable/>}></Route>
      <Route path='/CreateTask'element={<CreateTask/>}></Route>
      <Route path='/DepartmentManager' element={<DepartmentManager/>}></Route>
      <Route path='/FullViewPdf' element={<FullViewPdf/>}></Route>
      <Route path='/TaskStatus' element={<TaskStatus/>}></Route>
      <Route path='TaskManager' element={<TaskManager/>}></Route>
      <Route path='/AddEmployee' element={<AddEmployee/>}></Route>
      <Route path='/UpdateEmployee' element={<UpdateEmployee/>}></Route>
       
      </Routes>
    </BrowserRouter>
  
  
  </React.StrictMode>
);


reportWebVitals();
