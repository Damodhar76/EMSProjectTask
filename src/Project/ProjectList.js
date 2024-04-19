// // ProjectList.js

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ProjectList.css';


// const ProjectList = () => {
//     const [projects, setProjects] = useState([]);

//     useEffect(() => {
//         // Fetch the list of projects from the backend API
//         const fetchProjects = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8068/projects');
//                 setProjects(response.data);
//             } catch (error) {
//                 console.error('Error fetching projects:', error);
//             }
//         };

//         fetchProjects();
//     }, []);


//     const handleDeleteProject = async (id) => {
//         const confirmed = window.confirm('Are you sure you want to delete this project?');
//         if (confirmed) {
//             try {
//                 await axios.delete(`http://localhost:8068/projects/${id}`);
//                 setProjects(projects.filter(project => project.id !== id));
//             } catch (error) {
//                 console.error('Error deleting project:', error);
//             }
//         }
//     };


//     // Function to format team members
//     const formatTeamMembers = (teamMembers) => {
//         return teamMembers.join(', '); // Join member names with comma
//     };
//     return (
//         <div>
//             <h2>Project List</h2>
//             <table>
//                 <thead>
//                     <tr>
//                     <th>ID</th>
//                         <th>Project Name</th>
//                         <th>Team Members</th>
//                         <th>Testing Members</th>
//                         <th>Description</th>
//                         <th>Budget</th>
//                         <th>Start Date</th>
//                         <th>End Date</th>
//                         <th>Number of Hours</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {projects.map(project => (
//                         <tr key={project.id}>
//                             <td>{project.id}</td>
//                             <td>{project.projectName}</td>
//                             {/* <td>{formatTeamMembers(project.projectTeamMembers)}</td> */}
//                             <td>
//                                 <ul>
//                                     {project.projectTeamMembers.map((member, index) => (
//                                         <li key={index} className={index === 0 ? 'team-lead' : ''}>
//                                             {member}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </td>
//                             <td>
//     <ul>
//         {project.projectTestingMembers.map((testingMember, index) => (
//             <li key={index}>
//                 {testingMember}
//             </li>
//         ))}
//     </ul>
// </td>


//                             <td>{project.projectDescription}</td>
//                             <td>{project.projectBudget}</td>
//                             <td>{project.projectStartDate}</td>
//                             <td>{project.projectEndDate}</td>
//                             <td>{project.numberOfHours}</td>
//                             <td>
//                                 <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ProjectList;


// ProjectList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './ProjectList.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch the list of projects from the backend API
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8068/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const handleDeleteProject = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this project?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8068/projects/${id}`);
                setProjects(projects.filter(project => project.id !== id));
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <div>
            <h2>Project List</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Project Name</th>
                        <th>Team Members</th>
                        <th>Testing Members</th>
                        <th>Description</th>
                        <th>Budget</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Number of Hours</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.projectName}</td>
                            <td>
                                <ul>
                                    {project.projectTeamMembers.map((member, index) => (
                                        <li key={index} className={index === 0 ? 'team-lead' : ''}>
                                            {member}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {project.projectTestingMembers.map((testingMember, index) => (
                                        <li key={index}>
                                            {testingMember}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>{project.projectDescription}</td>
                            <td>{project.projectBudget}</td>
                            <td>{project.projectStartDate}</td>
                            <td>{project.projectEndDate}</td>
                            <td>{project.numberOfHours}</td>
                            <td>
                                {/* Update button */}
                                <Link to={`/EditProjectForm/${project.id}`} className="btn btn-primary">
                                    Update
                                </Link>
                                {/* Delete button */}
                                <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectList;
