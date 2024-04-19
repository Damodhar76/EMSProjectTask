
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik'; // Import useFormik hook
import * as Yup from 'yup'; // Import Yup for validation
import './CreateCompany.css'; // Import the CSS file

const CreateCompanyForm = () => {
  const formik = useFormik({
    initialValues: {
      companyName: '',
      founder: '',
      about: '',
      address: ''
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required('Company Name is required'),
      founder: Yup.string().required('Founder is required'),
      about: Yup.string().required('About is required'),
      address: Yup.string().required('Address is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post('http://localhost:9096/api/companies/save', values);
        console.log(response.data); // Assuming the response contains the newly created company data
        // Clear the form fields after successful submission
        resetForm();
      } catch (error) {
        console.error('Error creating company:', error);
      }
    }
  });

  return (
    <div className="card">
      <h2>Create a Company</h2>
      <form onSubmit={formik.handleSubmit}>
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={formik.values.companyName}
            onChange={formik.handleChange}
          />
          {formik.touched.companyName && formik.errors.companyName ? (
            <div className="error" style={{color:'red'}}>{formik.errors.companyName}</div>
          ) : null}
        </label>
        <br />
        <label>
          Founder:
          <input
            type="text"
            name="founder"
            value={formik.values.founder}
            onChange={formik.handleChange}
          />
          {formik.touched.founder && formik.errors.founder ? (
            <div className="error"style={{color:'red'}}>{formik.errors.founder}</div>
          ) : null}
        </label>
        <br />
        <label>
          About:
          <textarea
            name="about"
            value={formik.values.about}
            onChange={formik.handleChange}
          />
          {formik.touched.about && formik.errors.about ? (
            <div className="error"style={{color:'red'}}>{formik.errors.about}</div>
          ) : null}
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="error"style={{color:'red'}}>{formik.errors.address}</div>
          ) : null}
        </label>
        <br />
        <button type="submit">Create Company</button>
      </form>
      {/* Button to navigate to the company list page */}
      <Link to="/CompanyList">
        <button>View Companies</button>
      </Link>
    </div>
  );
};

export default CreateCompanyForm;
