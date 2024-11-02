import React, { useState } from 'react';

function BankForm() {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': token,
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ bankName, accountNumber, confirmAccountNumber, ifscCode }),
    });

    const data = await response.json();
    console.log(data);
    
    if (response.ok) alert(data.message);
    else alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Bank Name" onChange={(e) => setBankName(e.target.value)} />
      <input type="text" placeholder="Account Number" onChange={(e) => setAccountNumber(e.target.value)} />
      <input type="text" placeholder="Confirm Account Number" onChange={(e) => setConfirmAccountNumber(e.target.value)} />
      <input type="text" placeholder="IFSC Code" onChange={(e) => setIfscCode(e.target.value)} />
      <button type="submit">Save Bank Details</button>
    </form>
  );
}

export default BankForm;



// import React, { useState } from "react";
// import "./BankForm.css"; // Include CSS for styling

// const BankForm = () => {
//   const [formData, setFormData] = useState({
//     bankName: "",
//     actualName: "",
//     accountNumber: "",
//     ifsc: ""
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.bankName) newErrors.bankName = "Please enter bank name";
//     if (!formData.actualName) newErrors.actualName = "Please enter your name";
//     if (!formData.accountNumber) newErrors.accountNumber = "Please enter account number";
//     if (!formData.ifsc) newErrors.ifsc = "Please enter IFSC";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       alert("Form submitted successfully!");
//       // Submit form data to backend or process it as needed
//     }
//   };

//   return (
//     <div className="bank-form-container">
//       <h2>Bank</h2>
//       <p className="sub-heading">Add your cash withdrawal account</p>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Bank name</label>
//           <input
//             type="text"
//             name="bankName"
//             placeholder="Please enter bank name"
//             value={formData.bankName}
//             onChange={handleChange}
//           />
//           {errors.bankName && <span className="error">{errors.bankName}</span>}
//         </div>

//         <div className="form-group">
//           <label>Holder name</label>
//           <input
//             type="text"
//             name="actualName"
//             placeholder="Please enter your name"
//             value={formData.actualName}
//             onChange={handleChange}
//           />
//           {errors.actualName && <span className="error">{errors.actualName}</span>}
//         </div>

//         <div className="form-group">
//           <label>Account number</label>
//           <input
//             type="text"
//             name="accountNumber"
//             placeholder="Please enter account number"
//             value={formData.accountNumber}
//             onChange={handleChange}
//           />
//           {errors.accountNumber && <span className="error">{errors.accountNumber}</span>}
//         </div>

//         <div className="form-group">
//           <label>IFSC</label>
//           <input
//             type="text"
//             name="ifsc"
//             placeholder="Please enter IFSC"
//             value={formData.ifsc}
//             onChange={handleChange}
//           />
//           {errors.ifsc && <span className="error">{errors.ifsc}</span>}
//         </div>

//         <button type="submit" className="submit-button">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default BankForm;
